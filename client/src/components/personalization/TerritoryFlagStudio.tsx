import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, Check, Flag, ImagePlus, Send, X } from 'lucide-react';
import { captureLocalImage, subscribeToRestoredCapture } from '../../services/personalization/cameraCapture';
import { processLocalImage } from '../../services/personalization/imageProcessing';
import { saveProcessedMedia } from '../../services/personalization/personalizationLifecycle';
import { usePersonalizationStore } from '../../stores/usePersonalizationStore';
import type { ProcessedImage } from '../../types/personalization';
import { LocalMediaImage } from './LocalMediaImage';

const STATUS_LABEL = {
  NONE: 'Chưa tạo',
  DRAFT_LOCAL: 'Bản nháp trên máy',
  PENDING_PARENT_REVIEW: 'Đang chờ phụ huynh duyệt',
  APPROVED_LOCAL: 'Đã được phụ huynh duyệt',
  REJECTED: 'Cần chỉnh lại',
} as const;

export const TerritoryFlagStudio: React.FC<{ childId: string; onClose: () => void }> = ({ childId, onClose }) => {
  const child = usePersonalizationStore((state) => state.children[childId]);
  const transition = usePersonalizationStore((state) => state.transitionFlagReview);
  const [pendingImage, setPendingImage] = useState<ProcessedImage | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const prepareImage = async (blob: Blob) => {
    setBusy(true); setError('');
    try {
      const processed = await processLocalImage(blob, { aspectRatio: 3 / 2, maxWidth: 1200, maxHeight: 800 });
      if (pendingUrl) URL.revokeObjectURL(pendingUrl);
      setPendingImage(processed); setPendingUrl(URL.createObjectURL(processed.blob));
    } catch (value) { setError(value instanceof Error ? value.message : 'Không thể xử lý ảnh cờ.'); }
    finally { setBusy(false); }
  };

  useEffect(() => subscribeToRestoredCapture((capture) => { void prepareImage(capture.blob); }), []);
  useEffect(() => () => { if (pendingUrl) URL.revokeObjectURL(pendingUrl); }, [pendingUrl]);

  const chooseCamera = async () => {
    if (!Capacitor.isNativePlatform()) { fileRef.current?.click(); return; }
    setBusy(true); setError('');
    try { const capture = await captureLocalImage('camera'); await prepareImage(capture.blob); }
    catch (value) { if (!String(value).toLowerCase().includes('cancel')) setError(value instanceof Error ? value.message : 'Không thể mở camera.'); }
    finally { setBusy(false); }
  };

  const saveDraft = async () => {
    if (!pendingImage) return;
    setBusy(true); setError('');
    try {
      await saveProcessedMedia(childId, 'FLAG_SOURCE', pendingImage, child?.flagAssetId ?? null);
      setPendingImage(null); if (pendingUrl) URL.revokeObjectURL(pendingUrl); setPendingUrl(null);
    } catch (value) { setError(value instanceof Error ? value.message : 'Không thể lưu cờ trên thiết bị.'); }
    finally { setBusy(false); }
  };

  const submit = () => {
    if (!transition(childId, 'PENDING_PARENT_REVIEW')) setError('Cờ chưa ở trạng thái có thể gửi duyệt.');
  };
  const status = child?.flagReviewStatus ?? 'NONE';
  const canReplace = status !== 'PENDING_PARENT_REVIEW';

  return <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/90 sm:items-center" role="dialog" aria-modal="true" aria-label="Xưởng cờ lãnh địa">
    <div className="w-full max-w-lg overflow-hidden rounded-t-[32px] border border-violet-400/40 bg-[#080d1d] sm:rounded-[32px]">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><div><h2 className="font-black text-violet-200">Cờ Lãnh Địa</h2><p className="text-[11px] text-slate-400">Ảnh chỉ lưu trên thiết bị · tỉ lệ 3:2</p></div><button onClick={onClose} className="rounded-xl bg-slate-800 p-2" aria-label="Đóng xưởng cờ"><X className="h-4 w-4"/></button></header>
      <div className="space-y-4 p-4">
        <div className="relative mx-auto aspect-[3/2] w-full max-w-sm overflow-hidden rounded-2xl border-2 border-violet-400/60 bg-gradient-to-br from-indigo-950 to-slate-950">
          {pendingUrl ? <img src={pendingUrl} alt="Xem trước cờ mới" className="h-full w-full object-cover"/> : child?.flagAssetId ? <LocalMediaImage assetId={child.flagAssetId} alt="Cờ lãnh địa local" className="h-full w-full object-cover" fallback="🚩"/> : <div className="flex h-full flex-col items-center justify-center text-violet-200"><Flag className="h-12 w-12"/><span className="mt-2 text-xs font-bold">Chụp hoặc chọn hình làm cờ</span></div>}
          <div className="pointer-events-none absolute inset-3 rounded-xl border border-dashed border-white/70"/>
        </div>
        <div className="rounded-xl bg-slate-900 px-3 py-2 text-xs"><span className="font-black text-cyan-300">{STATUS_LABEL[status]}</span>{child?.flagReviewNote && <span className="ml-2 text-rose-300">· {child.flagReviewNote}</span>}</div>
        {pendingImage ? <div className="grid grid-cols-2 gap-2"><button disabled={busy} onClick={()=>{setPendingImage(null);if(pendingUrl)URL.revokeObjectURL(pendingUrl);setPendingUrl(null);}} className="rounded-xl bg-slate-800 px-3 py-3 text-xs font-bold">Chọn lại</button><button disabled={busy} onClick={()=>void saveDraft()} className="rounded-xl bg-cyan-500 px-3 py-3 text-xs font-black text-slate-950"><Check className="mr-1 inline h-4 w-4"/>Lưu bản nháp</button></div> : <div className="grid grid-cols-2 gap-2"><button disabled={busy || !canReplace} onClick={()=>void chooseCamera()} className="rounded-xl bg-cyan-500 px-3 py-3 text-xs font-black text-slate-950"><Camera className="mr-1 inline h-4 w-4"/>Chụp</button><button disabled={busy || !canReplace} onClick={()=>fileRef.current?.click()} className="rounded-xl bg-indigo-600 px-3 py-3 text-xs font-black"><ImagePlus className="mr-1 inline h-4 w-4"/>Chọn ảnh</button></div>}
        <input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event)=>{const file=event.target.files?.[0];if(file)void prepareImage(file);event.currentTarget.value='';}}/>
        {(status === 'DRAFT_LOCAL' || status === 'REJECTED') && !pendingImage && <button data-testid="submit-flag-review" onClick={submit} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-black"><Send className="mr-1 inline h-4 w-4"/>Gửi phụ huynh duyệt</button>}
        {status === 'PENDING_PARENT_REVIEW' && <p className="text-center text-xs text-amber-300">Phụ huynh sẽ duyệt trong Góc Phụ Huynh. Cờ chưa được gắn lên hành tinh.</p>}
        {status === 'APPROVED_LOCAL' && <p className="text-center text-xs text-emerald-300">Cờ đã được áp dụng trong game trên thiết bị này.</p>}
        {error && <p role="alert" className="rounded-xl bg-rose-950 p-2 text-xs text-rose-300">{error}</p>}
      </div>
    </div>
  </div>;
};
