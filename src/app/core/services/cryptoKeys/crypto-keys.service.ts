import { Injectable } from '@angular/core';
import { AccountService } from '@services/account/account.service';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { importKeys } from '../../utls/crypto.utils';

type KeyStorage = {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

@Injectable({
  providedIn: 'root',
})
export class CryptoKeysService {
  private keyStorage$ = new BehaviorSubject<KeyStorage>(null);
  constructor(private account: AccountService) {
    combineLatest([this.account.user$, this.account.privateData$])
      .pipe(
        map(([user, privateData]) =>
          user && privateData ? [privateData.privateKey, user.publicKey] : null
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

  private async loadKeys() {
    try {
      const [{ publicKey }, { privateKey }] = await Promise.all([
        this.account.loadSnapUser(),
        this.account.loadSnapPrivate(),
      ]);
      const res = await importKeys(privateKey, publicKey);
      return {
        privateKey: res.privateKey,
        publicKey: res.publicKey,
      };
    } catch (error) {
      console.error('loadKeys error', error);
      throw error;
    }
  }
}
