import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const failures = [];
const requireText = (content, pattern, label) => {
  if (!(pattern instanceof RegExp ? pattern.test(content) : content.includes(pattern))) failures.push(label);
};

const [packageText, capacitorConfig, manifest, legacyBackup, extractionRules, infoPlist, appDelegate, privacyManifest, xcodeProject, swiftPackage, parentApi, parentGate] = await Promise.all([
  read('package.json'),
  read('capacitor.config.ts'),
  read('android/app/src/main/AndroidManifest.xml'),
  read('android/app/src/main/res/xml/backup_rules.xml'),
  read('android/app/src/main/res/xml/data_extraction_rules.xml'),
  read('ios/App/App/Info.plist'),
  read('ios/App/App/AppDelegate.swift'),
  read('ios/App/App/PrivacyInfo.xcprivacy'),
  read('ios/App/App.xcodeproj/project.pbxproj'),
  read('ios/App/CapApp-SPM/Package.swift'),
  read('src/services/parentApi.ts'),
  read('src/services/personalization/parentGate.ts'),
]);
const packageJson = JSON.parse(packageText);

for (const dependency of ['@capacitor/core', '@capacitor/android', '@capacitor/ios', '@capacitor/cli']) {
  const version = packageJson.dependencies?.[dependency] ?? packageJson.devDependencies?.[dependency];
  if (!/^8\./.test(version ?? '')) failures.push(`${dependency} must remain on the audited Capacitor 8 line`);
}
requireText(capacitorConfig, 'cleartext: false', 'Capacitor cleartext transport must be disabled');
requireText(manifest, 'android:allowBackup="false"', 'Android automatic backup must be disabled');
requireText(manifest, 'android:usesCleartextTraffic="false"', 'Android manifest must explicitly reject cleartext traffic');
requireText(manifest, 'android:dataExtractionRules="@xml/data_extraction_rules"', 'Android 12+ data extraction rules must be attached');
requireText(manifest, 'android:fullBackupContent="@xml/backup_rules"', 'Android legacy backup rules must be attached');

const backupDomains = ['root', 'file', 'database', 'sharedpref', 'external', 'device_root', 'device_file', 'device_database', 'device_sharedpref'];
for (const domain of backupDomains) {
  requireText(legacyBackup, `domain="${domain}" path="."`, `Legacy Android backup must exclude ${domain}`);
  const occurrences = extractionRules.match(new RegExp(`domain="${domain}" path="\\."`, 'g'))?.length ?? 0;
  if (occurrences !== 2) failures.push(`Android cloud and device transfer must both exclude ${domain}`);
}

for (const key of ['NSCameraUsageDescription', 'NSFaceIDUsageDescription', 'NSPhotoLibraryUsageDescription', 'NSPhotoLibraryAddUsageDescription']) {
  requireText(infoPlist, `<key>${key}</key>`, `iOS Info.plist is missing ${key}`);
}
requireText(appDelegate, 'values.isExcludedFromBackup = true', 'iOS app data must be excluded from system backup');
requireText(appDelegate, '.libraryDirectory', 'iOS Library backup exclusion is missing');
requireText(appDelegate, '.documentDirectory', 'iOS Documents backup exclusion is missing');
requireText(privacyManifest, 'NSPrivacyAccessedAPICategoryFileTimestamp', 'iOS privacy manifest is missing the Filesystem API category');
requireText(privacyManifest, '<string>C617.1</string>', 'iOS privacy manifest is missing the approved Filesystem reason');
requireText(privacyManifest, 'NSPrivacyAccessedAPICategoryUserDefaults', 'iOS privacy manifest is missing the Preferences API category');
requireText(privacyManifest, '<string>CA92.1</string>', 'iOS privacy manifest is missing the approved Preferences reason');
requireText(xcodeProject, 'PrivacyInfo.xcprivacy in Resources', 'iOS privacy manifest must be a target resource');
if (/\.package\([^\n]*path:\s*"[^"]*\\/.test(swiftPackage)) failures.push('SwiftPM local package paths must use POSIX separators');
requireText(parentApi, 'SecureStorage.setSynchronize(false)', 'Native session storage must disable iCloud Keychain sync');
requireText(parentApi, 'KeychainAccess.whenUnlockedThisDeviceOnly', 'Native session token must not migrate to another device');
requireText(parentApi, 'novastars_parent_session_device_only_v1', 'Native session storage must use the audited device-only key namespace');
requireText(parentApi, 'SecureStorage.removeItem(LEGACY_TOKEN_KEY)', 'Legacy migratable Keychain sessions must be retired');
requireText(parentGate, /addListener\('appStateChange',[\s\S]*!isActive[\s\S]*parentGate\.lock\(\)/, 'Parent gate must lock when the native app becomes inactive');

if (failures.length) throw new Error(`Parent native privacy check failed:\n- ${failures.join('\n- ')}`);
console.log('Parent native privacy check passed (Capacitor 8; Android/iOS backup exclusion; device-only secure session; lifecycle lock).');
