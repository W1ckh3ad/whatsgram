const algName = 'RSA-OAEP';
const hashName: AlgorithmIdentifier = 'SHA-256';
const modulusLength = 2048;

export async function encryptMessage(
  messageString: string,
  publicKey: CryptoKey
) {
  try {
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: algName,
      },
      publicKey,
      stringToBuffer(messageString)
    );
    return bufferToHex(encrypted);
  } catch (error) {
    console.error('EncryptMessage error', error);
    throw error;
  }
}

export async function decryptMessage(
  messageHex: string,
  privateKey: CryptoKey
) {
  try {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: algName,
      },
      privateKey,
      hexToBuffer(messageHex)
    );

    return bufferToString(decrypted);
  } catch (error) {
    console.error('DecryptMessage error', error);
    throw error;
  }
}

export function generateKeys() {
  try {
    return window.crypto.subtle.generateKey(
      {
        name: algName,
        modulusLength,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: hashName,
      },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Key Generation Error', error);
    throw error;
  }
}

export async function exportKeys(pair: CryptoKeyPair) {
  try {
    const [privateKey, publicKey] = await Promise.all([
      window.crypto.subtle.exportKey('pkcs8', pair.privateKey),
      window.crypto.subtle.exportKey('spki', pair.publicKey),
    ]);
    return {
      privateKey: bufferToHex(privateKey),
      publicKey: bufferToHex(publicKey),
    };
  } catch (error) {
    console.error('Exporting Keys error', error);
    throw error;
  }
}

export async function importKeys(privateKey: string, publicKey: string) {
  try {
    const res = await Promise.all([
      importPrivateKey(privateKey),
      importPublicKey(publicKey),
    ]);
    return { privateKey: res[0], publicKey: res[1] };
  } catch (error) {
    console.error('importKeys error', error);
    throw error;
  }
}

export function importPublicKey(key: string): Promise<CryptoKey> {
  try {
    const binaryDer = hexToBuffer(key);
    return window.crypto.subtle.importKey(
      'spki',
      binaryDer,
      {
        name: algName,
        hash: hashName,
      },
      true,
      ['encrypt']
    );
  } catch (error) {
    console.error('importPublicKey error', error);
    throw error;
  }
}

export function importPrivateKey(key: string): Promise<CryptoKey> {
  try {
    const binaryDer = hexToBuffer(key);
    return window.crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: algName,
        hash: hashName,
      },
      true,
      ['decrypt']
    );
  } catch (error) {
    console.error('importPrivateKey error', error);
    throw error;
  }
}

function stringToBuffer(message: string): ArrayBuffer {
  var buffer = new ArrayBuffer(message.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buffer);
  for (var i = 0, strLen = message.length; i < strLen; i++) {
    bufView[i] = message.charCodeAt(i);
  }
  return buffer;
}

function bufferToString(buffer: ArrayBuffer): string {
  return String.fromCharCode.apply(null, new Uint16Array(buffer));
}

function bufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hexString: string): ArrayBuffer {
  hexString = hexString.replace(/^0x/, '');
  if (hexString.length % 2 != 0) {
    console.error(
      'WARNING: expecting an even number of characters in the hexString'
    );
  }
  const bad = hexString.match(/[G-Z\s]/i);
  if (bad) {
    console.error('WARNING: found non-hex characters', bad);
  }

  var integers = hexString.match(/[\dA-F]{2}/gi).map((s) => parseInt(s, 16));
  return new Uint8Array(integers).buffer;
}
