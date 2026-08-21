export type CatalogItem = {
  sku: string;
  diamondCost: number;
  kind: 'permanent' | 'consumable';
};

export const ITEM_CATALOG: Readonly<Record<string, CatalogItem>> = Object.freeze({
  solar_phoenix: { sku: 'solar_phoenix', diamondCost: 280, kind: 'permanent' },
  son_tinh: { sku: 'son_tinh', diamondCost: 120, kind: 'permanent' },
  thanh_giong: { sku: 'thanh_giong', diamondCost: 190, kind: 'permanent' },
  double_regen: { sku: 'double_regen', diamondCost: 15, kind: 'consumable' },
  boss_pass: { sku: 'boss_pass', diamondCost: 20, kind: 'consumable' },
  instant_refuel: { sku: 'instant_refuel', diamondCost: 25, kind: 'consumable' },
});

export const DIAMOND_PRODUCTS: Readonly<Record<string, number>> = Object.freeze({
  'novastars.diamonds.100': 100,
  'novastars.diamonds.350': 350,
  'novastars.diamonds.1000': 1000,
  'novastars.diamonds.2500': 2500,
});

export const VIP_PRODUCTS: Readonly<Record<string, number>> = Object.freeze({
  'novastars.vip.monthly': 150,
  'novastars.vip.annual': 2000,
});
