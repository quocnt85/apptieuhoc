import type { ProcessedImage } from '../../types/personalization';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const MAX_INPUT_DIMENSION = 12_000;

export interface ImageProcessOptions {
  aspectRatio: number;
  maxWidth: number;
  maxHeight: number;
  outputMimeType?: ProcessedImage['mimeType'];
  quality?: number;
}

const canvasToBlob = (canvas: HTMLCanvasElement | OffscreenCanvas, mimeType: string, quality: number) => new Promise<Blob>((resolve, reject) => {
  if ('convertToBlob' in canvas) {
    void canvas.convertToBlob({ type: mimeType, quality }).then(resolve, reject);
    return;
  }
  canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Cannot encode processed image.')), mimeType, quality);
});

const decodeImage = async (input: Blob) => {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(input, { imageOrientation: 'from-image' });
    return { source: bitmap as CanvasImageSource, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
  }
  const url = URL.createObjectURL(input); const image = new Image(); image.decoding = 'async'; image.src = url;
  await image.decode();
  return { source: image as CanvasImageSource, width: image.naturalWidth, height: image.naturalHeight, close: () => URL.revokeObjectURL(url) };
};

export const processLocalImage = async (input: Blob, options: ImageProcessOptions): Promise<ProcessedImage> => {
  if (!ALLOWED_MIME.has(input.type)) throw new Error('Chỉ hỗ trợ ảnh JPEG, PNG hoặc WebP.');
  if (input.size <= 0 || input.size > MAX_INPUT_BYTES) throw new Error('Ảnh phải nhỏ hơn 15 MB.');
  const decoded = await decodeImage(input);
  try {
    if (decoded.width < 64 || decoded.height < 64 || decoded.width > MAX_INPUT_DIMENSION || decoded.height > MAX_INPUT_DIMENSION) {
      throw new Error('Kích thước ảnh không hợp lệ.');
    }
    const inputRatio = decoded.width / decoded.height;
    const cropWidth = inputRatio > options.aspectRatio ? decoded.height * options.aspectRatio : decoded.width;
    const cropHeight = inputRatio > options.aspectRatio ? decoded.height : decoded.width / options.aspectRatio;
    const scale = Math.min(1, options.maxWidth / cropWidth, options.maxHeight / cropHeight);
    const outputWidth = Math.max(1, Math.round(cropWidth * scale));
    const outputHeight = Math.max(1, Math.round(cropHeight * scale));
    const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(outputWidth, outputHeight) : Object.assign(document.createElement('canvas'), { width: outputWidth, height: outputHeight });
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Thiết bị không hỗ trợ xử lý ảnh.');
    context.drawImage(decoded.source, (decoded.width - cropWidth) / 2, (decoded.height - cropHeight) / 2, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);
    const mimeType = options.outputMimeType ?? 'image/webp';
    const blob = await canvasToBlob(canvas, mimeType, options.quality ?? 0.86);
    const encodedMimeType = ALLOWED_MIME.has(blob.type) ? blob.type as ProcessedImage['mimeType'] : mimeType;
    return { blob, mimeType: encodedMimeType, width: outputWidth, height: outputHeight };
  } finally {
    decoded.close();
  }
};

export const dataUrlToBlob = (dataUrl: string) => {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([a-zA-Z0-9+/=]+)$/.exec(dataUrl);
  if (!match) throw new Error('Ảnh local cũ không hợp lệ.');
  const binary = atob(match[2]); const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: match[1] });
};
