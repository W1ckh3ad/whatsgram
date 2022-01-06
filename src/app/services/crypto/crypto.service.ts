import { Injectable } from '@angular/core';

const algName = 'RSA-OAEP';
const hashName: AlgorithmIdentifier = 'SHA-256';
const modulusLength = 2048;
@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  async encryptMessage(messageString: string, publicKey: CryptoKey) {
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: algName,
      },
      publicKey,
      this.stringToBuffer(messageString)
    );
    return this.bufferToHex(encrypted);
  }

  async decryptMessage(messageHex: string, privateKey: CryptoKey) {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: algName,
      },
      privateKey,
      this.hexToBuffer(messageHex)
    );

    return this.bufferToString(decrypted);
  }

  generateKeys() {
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
  }

  async exportKeys(pair: CryptoKeyPair) {
    const [privateKey, publicKey] = await Promise.all([
      window.crypto.subtle.exportKey('pkcs8', pair.privateKey),
      window.crypto.subtle.exportKey('spki', pair.publicKey),
    ]);
    return {
      privateKey: this.bufferToHex(privateKey),
      publicKey: this.bufferToHex(publicKey),
    };
  }

  async importKeys(privateKey: string, publicKey: string) {
    const res = await Promise.all([
      this.importPrivateKey(privateKey),
      this.importPublicKey(publicKey),
    ]);
    return { privateKey: res[0], publicKey: res[1] };
  }

  importPublicKey(key: string): Promise<CryptoKey> {
    const binaryDer = this.hexToBuffer(key);
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
  }

  importPrivateKey(key: string): Promise<CryptoKey> {
    const binaryDer = this.hexToBuffer(key);
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
  }

  private stringToBuffer(message: string): ArrayBuffer {
    var buffer = new ArrayBuffer(message.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buffer);
    for (var i = 0, strLen = message.length; i < strLen; i++) {
      bufView[i] = message.charCodeAt(i);
    }
    return buffer;
  }

  private bufferToString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(buffer));
  }

  private bufferToHex(buffer: ArrayBuffer): string {
    return [...new Uint8Array(buffer)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('');
  }

  private hexToBuffer(hexString: string): ArrayBuffer {
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
}
