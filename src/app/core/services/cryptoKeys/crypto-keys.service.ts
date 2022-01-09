import { Injectable } from '@angular/core';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

type KeyStorage = {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

@Injectable({
  providedIn: 'root'
})
export class CryptoKeysService {
  private keyStorage = new BehaviorSubject<KeyStorage>(null);
  constructor(private auth: AuthService, private account: AccountService) {
    auth.user$.pipe(
      switchMap(async () => {
        const [user, private] = await Promise.all([account.loadSnapUser])
      })
    )

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
    const {
      publicKey,
      privateData: { privateKey },
    } = await this.loadSnapComplete();
    const res = await this.crypto.importKeys(privateKey, publicKey);
    return {
      privateKey: res.privateKey,
      publicKey: res.publicKey,
    };
  }
}
