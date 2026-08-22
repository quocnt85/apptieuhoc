import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, Check, ImagePlus, LockKeyhole, Sparkles, X } from 'lucide-react';
import { AVATAR_COSMETICS, cosmeticById, DEFAULT_AVATAR_COSMETICS, DEFAULT_EQUIPPED_COSMETICS } from '../../data/avatarCosmetics';
import { captureLocalImage, subscribeToRestoredCapture } from '../../services/personalization/cameraCapture';
import { processLocalImage } from '../../services/personalization/imageProcessing';
import { saveProcessedMedia } from '../../services/personalization/personalizationLifecycle';
import { purchaseAndEquipCosmetic } from '../../services/personalization/wardrobeService';
import { soundService } from '../../services/audio';
import { useGameStore } from '../../stores/useGameStore';
import { usePersonalizationStore } from '../../stores/usePersonalizationStore';
import type { AvatarCosmeticSlot, ProcessedImage } from '../../types/personalization';
import { AvatarComposer } from './AvatarComposer';
import { PERSONALIZATION_FEATURE_FLAGS } from '../../config/personalizationFeatureFlags';

const PRESETS = ['👨‍🚀', '👩‍🚀', '🧑‍🚀'];
const SLOTS: Array<{id:AvatarCosmeticSlot;label:string}> = [
  {id:'OUTFIT',label:'Trang phục'}, {id:'HEADGEAR',label:'Mũ'}, {id:'ACCESSORY',label:'Phụ kiện'}, {id:'FRAME',label:'Khung'}, {id:'BACKGROUND',label:'Nền'},
];

export const AvatarStudio: React.FC<{ childId: string; onClose: () => void }> = ({ childId, onClose }) => {
  const user = useGameStore((state) => state.user);
  const equipAvatar = useGameStore((state) => state.equipAvatar);
  const child = usePersonalizationStore((state) => state.children[childId]);
  const [slot, setSlot] = useState<AvatarCosmeticSlot>('OUTFIT');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<ProcessedImage | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const currentAvatar = user.avatar === '🚀' ? '👨‍🚀' : user.avatar;
  const photoCaptureEnabled = import.meta.env.DEV || PERSONALIZATION_FEATURE_FLAGS.photoAvatar;
  const selectedItem = cosmeticById(selectedItemId);
  const equipped = child?.equippedCosmetics ?? DEFAULT_EQUIPPED_COSMETICS;
  const unlocked = child?.unlockedCosmeticIds ?? [...DEFAULT_AVATAR_COSMETICS];
  const preview = useMemo(() => selectedItem ? { ...equipped, [selectedItem.slot]: selectedItem.id } : equipped, [equipped, selectedItem]);
  const owned = selectedItem ? unlocked.includes(selectedItem.id) : false;

  const prepareImage = async (blob: Blob) => {
    setBusy(true); setError('');
    try {
      const processed = await processLocalImage(blob, { aspectRatio: 3 / 4, maxWidth: 768, maxHeight: 1024 });
      if (pendingUrl) URL.revokeObjectURL(pendingUrl);
      setPendingImage(processed); setPendingUrl(URL.createObjectURL(processed.blob));
    } catch (value) { setError(value instanceof Error ? value.message : 'Không thể xử lý ảnh.'); }
    finally { setBusy(false); }
  };

  useEffect(() => subscribeToRestoredCapture((capture) => { void prepareImage(capture.blob); }), []);
  useEffect(() => () => { if (pendingUrl) URL.revokeObjectURL(pendingUrl); }, [pendingUrl]);

  const openCamera = async () => {
    if (!Capacitor.isNativePlatform()) { fileRef.current?.click(); return; }
    setBusy(true); setError('');
    try { const capture = await captureLocalImage('camera'); await prepareImage(capture.blob); }
    catch (value) { if (!String(value).toLowerCase().includes('cancel')) setError(value instanceof Error ? value.message : 'Không thể mở camera.'); }
    finally { setBusy(false); }
  };

  const savePhoto = async () => {
    if (!pendingImage) return;
    setBusy(true); setError('');
    try {
      const previous = child?.avatarAssetId ?? null;
      await saveProcessedMedia(childId, 'AVATAR_SOURCE', pendingImage, previous);
      setPendingImage(null); if (pendingUrl) URL.revokeObjectURL(pendingUrl); setPendingUrl(null);
      soundService.playVictory();
    } catch (value) { setError(value instanceof Error ? value.message : 'Không thể lưu avatar.'); }
    finally { setBusy(false); }
  };

  const choosePreset = (preset: string) => {
    equipAvatar(preset); usePersonalizationStore.getState().setAvatarMode(childId, 'PRESET'); soundService.playClick();
  };

  const applyItem = () => {
    if (!selectedItem) return;
    const result = purchaseAndEquipCosmetic(childId, selectedItem.id);
    if (!result.ok) { setError(result.reason === 'INSUFFICIENT_COINS' ? 'Chưa đủ Xu Nova.' : 'Vật phẩm không tồn tại.'); return; }
    setError(''); soundService.playVictory();
  };

  return <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/90 sm:items-center" role="dialog" aria-modal="true" aria-label="Xưởng avatar">
    <div className="flex max-h-[95dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[32px] border border-sky-400/40 bg-[#080d1d] sm:rounded-[32px]">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><div><h2 className="font-black text-yellow-300">Xưởng Avatar</h2><p className="text-[11px] text-slate-400">Ảnh chỉ lưu trên thiết bị</p></div><button onClick={onClose} className="rounded-xl bg-slate-800 p-2" aria-label="Đóng xưởng avatar"><X className="h-4 w-4"/></button></header>
      <div className="grid flex-1 gap-4 overflow-y-auto p-4 md:grid-cols-[210px_1fr]">
        <section className="space-y-3">
          <div className="mx-auto h-52 w-40">{pendingUrl ? <div className="relative h-full overflow-hidden rounded-[30px] border-2 border-amber-300"><img src={pendingUrl} alt="Xem trước ảnh mới" className="h-full w-full object-cover"/><div className="pointer-events-none absolute inset-3 rounded-[25%] border border-dashed border-white/80"/></div> : <AvatarComposer childId={childId} presetAvatar={currentAvatar} preview={preview} className="h-full w-full rounded-[30px]"/>}</div>
          {photoCaptureEnabled ? <>{pendingImage ? <div className="grid grid-cols-2 gap-2"><button disabled={busy} onClick={()=>{setPendingImage(null);if(pendingUrl)URL.revokeObjectURL(pendingUrl);setPendingUrl(null);}} className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold">Chụp lại</button><button disabled={busy} onClick={()=>void savePhoto()} className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-black text-slate-950"><Check className="mr-1 inline h-3 w-3"/>Dùng ảnh</button></div> : <div className="grid grid-cols-2 gap-2"><button disabled={busy} onClick={()=>void openCamera()} className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-black text-slate-950"><Camera className="mr-1 inline h-3.5 w-3.5"/>Chụp</button><button disabled={busy} onClick={()=>fileRef.current?.click()} className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-black"><ImagePlus className="mr-1 inline h-3.5 w-3.5"/>Chọn ảnh</button></div>}<input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={(event)=>{const file=event.target.files?.[0];if(file)void prepareImage(file);event.currentTarget.value='';}}/></> : <p className="rounded-xl bg-slate-900 p-2 text-[10px] text-slate-400">Chụp ảnh đang tắt ở production cho tới khi native smoke test hoàn tất.</p>}
          <div><div className="mb-2 text-[10px] font-black uppercase text-slate-400">Avatar mẫu</div><div className="grid grid-cols-3 gap-2">{PRESETS.map(preset=><button key={preset} onClick={()=>choosePreset(preset)} className={`rounded-xl border p-2 text-2xl ${child?.avatarMode!=='PHOTO'&&currentAvatar===preset?'border-cyan-300 bg-cyan-950':'border-slate-700 bg-slate-900'}`}>{preset}</button>)}</div></div>
        </section>
        <section className="space-y-3">
          <div className="flex gap-1 overflow-x-auto pb-1">{SLOTS.map(item=><button key={item.id} onClick={()=>{setSlot(item.id);setSelectedItemId(null);}} className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-bold ${slot===item.id?'bg-cyan-500 text-slate-950':'bg-slate-900 text-slate-300'}`}>{item.label}</button>)}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{AVATAR_COSMETICS.filter(item=>item.slot===slot).map(item=>{const isOwned=unlocked.includes(item.id);const isEquipped=equipped[item.slot]===item.id;return <button key={item.id} onClick={()=>setSelectedItemId(item.id)} className={`relative min-h-24 rounded-2xl border p-3 text-left ${selectedItemId===item.id?'border-yellow-300 bg-yellow-950/40':isEquipped?'border-cyan-400 bg-cyan-950/40':'border-slate-700 bg-slate-900'}`}><div className="text-2xl">{item.visual.emoji??(item.slot==='BACKGROUND'?'🌌':'🖼️')}</div><div className="mt-1 text-xs font-black">{item.name}</div><div className="mt-1 text-[10px] text-slate-400">{isOwned?'Đã sở hữu':`${item.priceCoins} 🟡`} · {item.rarity}</div>{!isOwned&&<LockKeyhole className="absolute right-2 top-2 h-3 w-3 text-slate-500"/>}</button>})}</div>
          {selectedItem&&<button onClick={applyItem} className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-3 text-sm font-black text-slate-950"><Sparkles className="mr-1 inline h-4 w-4"/>{owned?'Trang bị':`Mua & trang bị · ${selectedItem.priceCoins} Xu`}</button>}
          <p className="text-[11px] text-slate-500">Chạm vật phẩm để xem thử. Chỉ nút Trang bị/Mua mới thay đổi dữ liệu và trừ Xu.</p>
          {error&&<p role="alert" className="rounded-xl bg-rose-950 p-2 text-xs text-rose-300">{error}</p>}
        </section>
      </div>
    </div>
  </div>;
};
