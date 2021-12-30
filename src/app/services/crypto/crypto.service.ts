import { Injectable } from '@angular/core';

import { Buffer } from 'buffer';
@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  async encryptMessage(messageString: string, publicKey: CryptoKey) {
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      this.stringToBuffer(messageString)
    );

    return this.bufferToHex(encrypted);
  }

  async decryptMessage(messageHex: string, privateKey: CryptoKey) {
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      this.hexToBuffer(messageHex)
    );

    return this.bufferToString(decrypted);
  }

  generateKeys() {
    return window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
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
      this.importPrivateKey(publicKey),
    ]);
    return { privateKey: res[0], publicKey: res[1] };
  }

  importPublicKey(key: string): Promise<CryptoKey> {
    const binaryDer = this.hexToBuffer(key);
    return window.crypto.subtle.importKey(
      'spki',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
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
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    );
  }

  private stringToBuffer(message: string) {
    return Buffer.from(message);
  }

  private bufferToString(buffer: ArrayBuffer) {
    return Buffer.from(buffer).toString();
  }

  private bufferToHex(buffer: ArrayBuffer) {
    return [...new Uint8Array(Buffer.from(buffer))]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('');
  }

  private hexToBuffer(hexString: string) {
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
