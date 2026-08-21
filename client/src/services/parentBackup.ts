const encoder = new TextEncoder();
const decoder = new TextDecoder();
const backupKeys = () => Object.keys(localStorage).filter((key) => key === 'novastars_parent_zone_v1' || key === 'novastars_space_state_v2' || key.startsWith('novastars_space_state_profile_'));

const deriveKey = async (password: string, salt: Uint8Array, usage: KeyUsage[]) => {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', iterations: 180_000, salt }, material, { name: 'AES-GCM', length: 256 }, false, usage);
};
const bytesToBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const base64ToBytes = (value: string) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

export const createEncryptedBackup = async (password: string): Promise<Blob> => {
  if (password.length < 8) throw new Error('Mật khẩu sao lưu phải có ít nhất 8 ký tự.');
  const salt = crypto.getRandomValues(new Uint8Array(16)); const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ['encrypt']);
  const values = Object.fromEntries(backupKeys().map((name) => [name, localStorage.getItem(name)]));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify({ version: 1, exportedAt: Date.now(), parentAccountId: localStorage.getItem('novastars_parent_id'), values })));
  return new Blob([JSON.stringify({ format: 'novastars-parent-backup', version: 1, salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(encrypted)) })], { type: 'application/json' });
};

export const restoreEncryptedBackup = async (file: File, password: string) => {
  const envelope = JSON.parse(await file.text()) as { format: string; version: number; salt: string; iv: string; ciphertext: string };
  if (envelope.format !== 'novastars-parent-backup' || envelope.version !== 1) throw new Error('Tệp sao lưu không đúng định dạng.');
  const salt = base64ToBytes(envelope.salt); const iv = base64ToBytes(envelope.iv);
  const key = await deriveKey(password, salt, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(envelope.ciphertext));
  const payload = JSON.parse(decoder.decode(plain)) as { version: number; parentAccountId: string | null; values: Record<string, string | null> };
  if (payload.version !== 1 || !payload.values || payload.parentAccountId !== localStorage.getItem('novastars_parent_id')) throw new Error('Tệp sao lưu thuộc tài khoản khác hoặc không hợp lệ.');
  const validated = Object.entries(payload.values).filter(([name, value]) => {
    if (!(name === 'novastars_parent_zone_v1' || name === 'novastars_space_state_v2' || name.startsWith('novastars_space_state_profile_')) || typeof value !== 'string') return false;
    JSON.parse(value);
    return true;
  });
  for (const [name, value] of validated) localStorage.setItem(name, value as string);
};
