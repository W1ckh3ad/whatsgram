import { Injectable } from '@angular/core';
import { AccountService } from '@services/account/account.service';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { importKeys } from '@utils/crypto.utils';
import { Storage } from '@capacitor/storage';

type KeyStorage = {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

const privateKeyStorgageKey = 'dsadsadasdsa';

@Injectable({
  providedIn: 'root',
})
export class CryptoKeysService {
  private keyStorage$ = new BehaviorSubject<KeyStorage>(null);
  constructor(private account: AccountService) {
    combineLatest([this.account.user$, this.loadPrivateKey()])
      .pipe(
        map(([user, privateKeyRes]) =>
          user && privateKeyRes.value
            ? [privateKeyRes.value, user.publicKey]
            : null
        ),
        switchMap(async (x) => (x ? await importKeys(x[0], x[1]) : null))
      )
      .subscribe((x) => this.keyStorage$.next(x));
  }

  async getPublicKey() {
    try {
      if (this.keyStorage$.value == null) {
        this.keyStorage$.next(await this.loadKeys());
      }
      return this.keyStorage$.value.publicKey;
    } catch (error) {
      console.error('getPublicKey error', error);
    }
  }

  async getPrivateKey() {
    try {
      if (this.keyStorage$.value == null) {
        this.keyStorage$.next(await this.loadKeys());
      }
      return this.keyStorage$.value.privateKey;
    } catch (error) {
      console.error('getPrivateKey error', error);
    }
  }

  receivePrivateKey(key: string) {
    return key;
  }

  private async loadKeys() {
    try {
      const [{ publicKey }, { value }] = await Promise.all([
        this.account.loadSnapUser(),
        this.loadPrivateKey(),
      ]);
      const res = await importKeys(value, publicKey);
      return {
        privateKey: res.privateKey,
        publicKey: res.publicKey,
      };
    } catch (error) {
      console.error('loadKeys error', error);
      throw error;
    }
  }

  public async savePrivateKey(key: string) {
    await Storage.set({
      key: privateKeyStorgageKey,
      value: key,
    });
  }

  private async loadPrivateKey() {
    return await Storage.get({
      key: privateKeyStorgageKey,
    });
  }
}
