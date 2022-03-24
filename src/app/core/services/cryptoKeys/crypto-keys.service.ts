import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { AuthService } from '@services/auth/auth.service';
import { importPrivateKey } from '@utils/crypto.utils';
import { BehaviorSubject } from 'rxjs';

const privateKeyStorgageKey = 'dsadsadasdsa';

@Injectable({
  providedIn: 'root',
})
export class CryptoKeysService {
  privateKeyField$ = new BehaviorSubject<CryptoKey>(null);
  
  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((x) => {
      if (!x) return;
      this.importPrivateKey().then((x) => this.privateKeyField$.next(x));
    });
  }

  set privateKey(privateKeyField: CryptoKey) {
    this.privateKeyField$.next(privateKeyField);
  }

  get privateKey$() {
    return this.privateKeyField$;
  }

  get privateKey(): CryptoKey {
    return this.privateKeyField$.value;
  }

  async getPrivateKey() {
    try {
      if (this.privateKeyField$.value == null) {
        this.privateKeyField$.next(await this.importPrivateKey());
      }
      return this.privateKeyField$.value;
    } catch (error) {
      console.error('getPrivateKey error', error);
    }
  }

  receivePrivateKey(key: string) {
    return key;
  }

  private async importPrivateKey() {
    return this.loadPrivateKey().then((x) =>
      x.value ? importPrivateKey(x.value) : null
    );
  }

  public async savePrivateKey(key: string) {
    await Storage.set({
      key: privateKeyStorgageKey + this.authService.user.uid,
      value: key,
    });
  }

  private async loadPrivateKey() {
    if (!this.authService.user) return null;
    return await Storage.get({
      key: privateKeyStorgageKey + this.authService.user.uid,
    });
  }
}
