import { App as CapacitorApp, type RestoredListenerEvent } from '@capacitor/app';
import { Camera, CameraResultType, CameraSource, type Photo } from '@capacitor/camera';

export type CaptureSource = 'camera' | 'photos' | 'prompt';
export interface CapturedImage { blob: Blob; source: CaptureSource; restored: boolean }

const sourceMap: Record<CaptureSource, CameraSource> = { camera: CameraSource.Camera, photos: CameraSource.Photos, prompt: CameraSource.Prompt };
const pendingRestoredListeners = new Set<(result: CapturedImage) => void>();
let restoreInitialized = false;

const photoToBlob = async (photo: Pick<Photo, 'webPath' | 'format'>) => {
  if (!photo.webPath) throw new Error('Camera did not return a readable image.');
  const response = await fetch(photo.webPath);
  if (!response.ok) throw new Error('Cannot read the captured image.');
  const blob = await response.blob();
  return blob.type ? blob : new Blob([await blob.arrayBuffer()], { type: `image/${photo.format || 'jpeg'}` });
};

const onRestored = async (event: RestoredListenerEvent) => {
  if (event.pluginId !== 'Camera' || event.methodName !== 'getPhoto' || !event.success || !event.data) return;
  const photo = event.data as Photo;
  const result: CapturedImage = { blob: await photoToBlob(photo), source: 'camera', restored: true };
  pendingRestoredListeners.forEach((listener) => listener(result));
};

export const initializeCameraRestore = () => {
  if (restoreInitialized) return;
  restoreInitialized = true;
  void CapacitorApp.addListener('appRestoredResult', (event) => { void onRestored(event).catch(() => undefined); });
};

export const subscribeToRestoredCapture = (listener: (result: CapturedImage) => void) => {
  initializeCameraRestore(); pendingRestoredListeners.add(listener);
  return () => pendingRestoredListeners.delete(listener);
};

export const captureLocalImage = async (source: CaptureSource = 'prompt'): Promise<CapturedImage> => {
  initializeCameraRestore();
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: sourceMap[source],
    quality: 92,
    correctOrientation: true,
    allowEditing: false,
    saveToGallery: false,
  });
  return { blob: await photoToBlob(photo), source, restored: false };
};
