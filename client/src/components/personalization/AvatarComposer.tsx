import React from 'react';
import { cosmeticById, DEFAULT_EQUIPPED_COSMETICS } from '../../data/avatarCosmetics';
import { usePersonalizationStore } from '../../stores/usePersonalizationStore';
import type { AvatarCosmeticSlot } from '../../types/personalization';
import { LocalMediaImage } from './LocalMediaImage';

export const AvatarComposer: React.FC<{
  childId: string;
  presetAvatar: string;
  className?: string;
  preview?: Partial<Record<AvatarCosmeticSlot, string>>;
}> = ({ childId, presetAvatar, className = '', preview }) => {
  const child = usePersonalizationStore((state) => state.children[childId]);
  const equipped = preview ?? child?.equippedCosmetics ?? DEFAULT_EQUIPPED_COSMETICS;
  const background = cosmeticById(equipped.BACKGROUND)?.visual.gradient ?? 'from-indigo-950 via-purple-950 to-slate-950';
  const frame = cosmeticById(equipped.FRAME)?.visual.frameClass ?? 'border-sky-400';
  const outfit = cosmeticById(equipped.OUTFIT)?.visual.emoji;
  const headgear = cosmeticById(equipped.HEADGEAR)?.visual.emoji;
  const accessory = cosmeticById(equipped.ACCESSORY)?.visual.emoji;
  const showPhoto = child?.avatarMode === 'PHOTO' && child.avatarAssetId;

  return <div className={`relative isolate overflow-hidden border-2 bg-gradient-to-br ${background} ${frame} ${className}`} data-testid="avatar-composer">
    <div className="absolute inset-0 opacity-40" style={{backgroundImage:'radial-gradient(circle at 25% 20%,white 0 1px,transparent 1.5px),radial-gradient(circle at 75% 35%,white 0 1px,transparent 1.5px)',backgroundSize:'28px 28px,38px 38px'}}/>
    <div className="absolute inset-[9%] flex items-center justify-center overflow-hidden rounded-[28%] bg-slate-950/25 text-[clamp(2rem,10vw,5rem)]">
      {showPhoto ? <LocalMediaImage assetId={child.avatarAssetId!} alt="Avatar local" className="h-full w-full object-cover" fallback={presetAvatar}/> : presetAvatar}
    </div>
    {outfit && <span className="absolute bottom-[1%] left-1/2 -translate-x-1/2 text-[clamp(1.6rem,7vw,3.5rem)] drop-shadow-lg" aria-hidden>{outfit}</span>}
    {headgear && <span className="absolute left-1/2 top-[-2%] -translate-x-1/2 text-[clamp(1.3rem,6vw,3rem)] drop-shadow-lg" aria-hidden>{headgear}</span>}
    {accessory && <span className="absolute bottom-[14%] right-[2%] text-[clamp(1rem,5vw,2.4rem)] drop-shadow-lg" aria-hidden>{accessory}</span>}
  </div>;
};
