import { Capacitor } from '@capacitor/core';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';

const KEY = 'novastars_parent_biometric_enabled';
export const parentBiometric = {
  isEnabled: () => localStorage.getItem(KEY) === 'true',
  setEnabled: (enabled: boolean) => enabled ? localStorage.setItem(KEY, 'true') : localStorage.removeItem(KEY),
  isAvailable: async () => Capacitor.isNativePlatform() && (await BiometricAuth.checkBiometry()).isAvailable,
  authenticate: () => BiometricAuth.authenticate({
    reason: 'Mở Góc phụ huynh', cancelTitle: 'Dùng PIN', allowDeviceCredential: false,
    iosFallbackTitle: 'Dùng PIN', androidTitle: 'Mở Góc phụ huynh', androidSubtitle: 'Xác thực bằng sinh trắc học', androidConfirmationRequired: false,
  }),
};
