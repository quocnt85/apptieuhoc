import { Capacitor } from '@capacitor/core';
import { PRODUCT_CATEGORY, Purchases, type PurchasesStoreProduct } from '@revenuecat/purchases-capacitor';
import { parentFeatureFlags } from '../config/parentFeatureFlags';

export type ParentProductId = 'novastars.diamonds.100' | 'novastars.diamonds.350' | 'novastars.diamonds.1000' | 'novastars.diamonds.2500' | 'novastars.vip.monthly' | 'novastars.vip.annual';
export interface LocalizedProduct { id: ParentProductId; title: string; localizedPrice: string; }

export const PRODUCT_IDS: ParentProductId[] = [
  'novastars.vip.monthly', 'novastars.vip.annual',
  'novastars.diamonds.100', 'novastars.diamonds.350', 'novastars.diamonds.1000', 'novastars.diamonds.2500',
];

let configuredFor: string | null = null;
let cachedProducts: PurchasesStoreProduct[] = [];

const configure = async (appUserId: string) => {
  if (!parentFeatureFlags.iap) throw new Error('Mua hàng đang tắt cho đến khi hoàn tất kiểm định cửa hàng.');
  if (!Capacitor.isNativePlatform()) throw new Error('Mua hàng chỉ khả dụng trong ứng dụng iOS/Android.');
  if (!appUserId) throw new Error('Thiếu mã tài khoản phụ huynh.');
  if (configuredFor === appUserId) return;
  const platform = Capacitor.getPlatform();
  const apiKey = platform === 'ios' ? import.meta.env.VITE_REVENUECAT_IOS_API_KEY : import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY;
  if (!apiKey) throw new Error('Chưa cấu hình RevenueCat API key cho bản ứng dụng này.');
  const configured = await Purchases.isConfigured();
  if (configured.isConfigured) await Purchases.logIn({ appUserID: appUserId });
  else await Purchases.configure({ apiKey, appUserID: appUserId });
  configuredFor = appUserId;
};

const loadProducts = async (appUserId: string) => {
  await configure(appUserId);
  const [subscriptions, consumables] = await Promise.all([
    Purchases.getProducts({ productIdentifiers: PRODUCT_IDS.slice(0, 2), type: PRODUCT_CATEGORY.SUBSCRIPTION }),
    Purchases.getProducts({ productIdentifiers: PRODUCT_IDS.slice(2), type: PRODUCT_CATEGORY.NON_SUBSCRIPTION }),
  ]);
  cachedProducts = [...subscriptions.products, ...consumables.products];
  return cachedProducts;
};

export const purchaseProvider = {
  isAvailable: () => parentFeatureFlags.iap && Capacitor.isNativePlatform(),
  getProducts: async (appUserId = localStorage.getItem('novastars_parent_id') ?? ''): Promise<LocalizedProduct[]> => {
    if (!Capacitor.isNativePlatform() || !appUserId) return [];
    const products = await loadProducts(appUserId);
    return products.filter((product): product is PurchasesStoreProduct & { identifier: ParentProductId } => PRODUCT_IDS.includes(product.identifier as ParentProductId)).map((product) => ({ id: product.identifier, title: product.title, localizedPrice: product.priceString }));
  },
  purchase: async (id: ParentProductId, appUserId: string) => {
    await configure(appUserId);
    const product = cachedProducts.find((item) => item.identifier === id) ?? (await loadProducts(appUserId)).find((item) => item.identifier === id);
    if (!product) throw new Error('Sản phẩm chưa được cấu hình trên cửa hàng.');
    const result = await Purchases.purchaseStoreProduct({ product });
    return { transactionId: result.productIdentifier };
  },
  restore: async (appUserId: string) => { await configure(appUserId); await Purchases.restorePurchases(); },
};
