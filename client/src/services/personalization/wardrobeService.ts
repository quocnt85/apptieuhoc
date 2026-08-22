import { cosmeticById } from '../../data/avatarCosmetics';
import { useGameStore } from '../../stores/useGameStore';
import { usePersonalizationStore } from '../../stores/usePersonalizationStore';

export type WardrobeTransaction = { ok: true; charge: number } | { ok: false; reason: 'UNKNOWN_ITEM' | 'INSUFFICIENT_COINS' };

export const planWardrobeTransaction = (priceCoins: number, balance: number, alreadyOwned: boolean, unlimited: boolean): WardrobeTransaction => {
  if (alreadyOwned) return { ok: true, charge: 0 };
  if (unlimited) return { ok: true, charge: 0 };
  return balance >= priceCoins ? { ok: true, charge: priceCoins } : { ok: false, reason: 'INSUFFICIENT_COINS' };
};

export const purchaseAndEquipCosmetic = (childId: string, itemId: string): WardrobeTransaction => {
  const item = cosmeticById(itemId);
  if (!item) return { ok: false, reason: 'UNKNOWN_ITEM' };
  const personalization = usePersonalizationStore.getState();
  const child = personalization.children[childId];
  const game = useGameStore.getState();
  const transaction = planWardrobeTransaction(item.priceCoins, game.user.novaCoins, Boolean(child?.unlockedCosmeticIds.includes(itemId)), game.isUnlimitedMode);
  if (!transaction.ok) return transaction;
  if (transaction.charge) game.setNovaCoins(game.user.novaCoins - transaction.charge);
  personalization.unlockCosmetic(childId, itemId);
  usePersonalizationStore.getState().equipCosmetic(childId, item.slot, itemId);
  return transaction;
};
