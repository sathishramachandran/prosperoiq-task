// src/utils/encryption.ts
import Fernet from "fernet";

export function encryptPayload(payload: object): string {
  const SECRET = 'ghbnjgfhjkhgjcvbjyg';
  const secret = new Fernet.Secret(SECRET);
  const token = new Fernet.Token({
    secret,
    time: Date.now(),
  });
  const plaintext = JSON.stringify(payload);
  return token.encode(plaintext);
}

export function decryptPayload(encrypted: string): object {
  const SECRET = process.env.ENCRYPTION_KEY!;
  const secret = new Fernet.Secret(SECRET);
  const token = new Fernet.Token({
    secret,
    token: encrypted,
    time: Date.now(),
  });

  const decrypted = token.decode();
  return JSON.parse(decrypted);
}

const keyBase64 = process.env.ENCRYPTION_KEY_AES!;
const keyBuffer = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));

export async function encrypt(data: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    false,
    ["encrypt"],
  );
  const encoded = new TextEncoder().encode(data);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoded,
  );
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(encrypted: string): Promise<string> {
  const data = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    false,
    ["decrypt"],
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    ciphertext,
  );
  return new TextDecoder().decode(decrypted);
}
