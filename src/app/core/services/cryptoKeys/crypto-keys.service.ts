import { Injectable } from '@angular/core';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
import { BehaviorSubject, switchMap } from 'rxjs';
import { importKeys } from '../../utls/crypto.utils';

type KeyStorage = {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

@Injectable({
  providedIn: 'root',
})
export class CryptoKeysService {
  private keyStorage = new BehaviorSubject<KeyStorage>(null);
  constructor(auth: AuthService, private account: AccountService) {
    if (account.uid$.value) {
      this.loadKeys();
    }
    auth.user$
      .pipe(
        switchMap(async () => {
          const [user, privateData] = await Promise.all([
            account.loadSnapUser(),
            account.loadSnapPrivate(),
          ]);
          return user && privateData
            ? { publicKey: user.publicKey, privateKey: privateData.privateKey }
            : null;
        }),
        switchMap(async (x) => {
          if (!x) return null;
          return await importKeys(x.privateKey, x.publicKey);
        })
      )
      .subscribe((x) => this.keyStorage.next(x));
  }

  async getPublicKey() {
    if (this.keyStorage.value == null) {
      this.keyStorage.next(await this.loadKeys());
    }
    return this.keyStorage.value.publicKey;
  }

  async getPrivateKey() {
    if (this.keyStorage.value == null) {
      this.keyStorage.next(await this.loadKeys());
    }
    return this.keyStorage.value.privateKey;
  }

  private async loadKeys() {
    const [{ publicKey }, { privateKey }] = await Promise.all([
      this.account.loadSnapUser(),
      this.account.loadSnapPrivate(),
    ]);
    const res = await importKeys(privateKey, publicKey);
    return {
      privateKey: res.privateKey,
      publicKey: res.publicKey,
    };
  }
}
