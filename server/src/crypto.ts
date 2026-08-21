const encoder = new TextEncoder();

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

const fromHex = (value: string): Uint8Array => {
  if (!/^[0-9a-f]+$/i.test(value) || value.length % 2 !== 0) return new Uint8Array();
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
};

export const sha256Hex = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return toHex(new Uint8Array(digest));
};

export const constantTimeEqual = async (provided: string, expected: string): Promise<boolean> => {
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  const left = new Uint8Array(providedHash);
  const right = new Uint8Array(expectedHash);
  let difference = left.length ^ right.length;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    difference |= (left[index % left.length] ?? 0) ^ (right[index % right.length] ?? 0);
  }
  return difference === 0;
};

export const randomToken = (bytesLength = 32): string => {
  const bytes = new Uint8Array(bytesLength);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
};

export const randomOtp = (): string => {
  const max = 0x1_0000_0000;
  const ceiling = max - (max % 1_000_000);
  const buffer = new Uint32Array(1);
  do crypto.getRandomValues(buffer); while (buffer[0] >= ceiling);
  return String(buffer[0] % 1_000_000).padStart(6, '0');
};

export const createPinVerifier = async (
  pin: string,
  pepper: string,
): Promise<{ salt: string; verifier: string; version: 1 }> => {
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const salt = toHex(saltBytes);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(`${pin}:${pepper}`),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new Uint8Array(saltBytes).buffer, iterations: 120_000 },
    key,
    256,
  );
  return { salt, verifier: toHex(new Uint8Array(bits)), version: 1 };
};

export const verifyPin = async (
  pin: string,
  pepper: string,
  salt: string,
  expectedVerifier: string,
): Promise<boolean> => {
  const saltBytes = fromHex(salt);
  if (saltBytes.length !== 16) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(`${pin}:${pepper}`),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new Uint8Array(saltBytes).buffer, iterations: 120_000 },
    key,
    256,
  );
  return constantTimeEqual(toHex(new Uint8Array(bits)), expectedVerifier);
};

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();
