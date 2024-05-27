const KEY_SIZE = 256;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const e = async (plain: string | object) => {
  const plainText = typeof plain === "string" ? plain : JSON.stringify(plain);
  const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const ivBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await makePasswordKey(k);
  const aesKey = await deriveKey(passwordKey, saltBytes, ["encrypt"]);
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: ivBytes },
    aesKey,
    encoder.encode(plainText)
  );
  const encryptedBytes = new Uint8Array(encryptedContent);
  const buffer = new Uint8Array(
    saltBytes.byteLength + ivBytes.byteLength + encryptedBytes.byteLength
  );
  buffer.set(saltBytes, 0);
  buffer.set(ivBytes, saltBytes.byteLength);
  buffer.set(encryptedBytes, saltBytes.byteLength + ivBytes.byteLength);
  return bufferToBase64(buffer);
};

export const d = async (cipherText: string) => {
  const cipherBytes = base64ToBuffer(cipherText);
  const saltBytes = cipherBytes.slice(0, 16);
  const ivBytes = cipherBytes.slice(16, 32);
  const encryptedBytes = cipherBytes.slice(32);
  const passwordKey = await makePasswordKey(k);
  const aesKey = await deriveKey(passwordKey, saltBytes, ["decrypt"]);
  const decryptedContent = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    aesKey,
    encryptedBytes
  );
  return decoder.decode(decryptedContent);
};

const bufferToBase64 = (buffer: Uint8Array) =>
  window.btoa(
    Array.from(buffer)
      .map((b) => String.fromCharCode(b))
      .join("")
  );

const base64ToBuffer = (b64: string) =>
  Uint8Array.from(window.atob(b64), (c) => c.charCodeAt(0));

const makePasswordKey = (password: string) =>
  window.crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

const deriveKey = (passwordKey: CryptoKey, salt: Uint8Array, keyUsages: KeyUsage[]) =>
  window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 179,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: KEY_SIZE },
    false,
    keyUsages
  );

export const k = String.fromCharCode(
  ...new Uint8Array(
    [
      "22",
      "14",
      "2s",
      "24",
      "2c",
      "15",
      "3o",
      "16",
      "1i",
      "2f",
      "1c",
      "1k",
      "3i",
      "2t",
      "3p",
      "1h",
      "36",
      "1b",
      "2a",
      "26",
      "12",
      "20",
      "37",
      "2j",
      "27",
      "41",
      "1q",
      "1r",
      "1i",
      "23",
      "21",
    ].map((it) => parseInt(it, parseInt("11111", 2)))
  )
);
