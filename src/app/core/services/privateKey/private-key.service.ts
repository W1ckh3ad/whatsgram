import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { AccountService } from '@services/account/account.service';
import { importPrivateKey } from '@utils/crypto.utils';
import { BehaviorSubject } from 'rxjs';

const privateKeyStorgageKey = 'dsadsadasdsa';

@Injectable({
  providedIn: 'root',
})
export class PrivateKeyService {
  private keyStorage$ = new BehaviorSubject<CryptoKey>(null);

  constructor(private accountService: AccountService) {}

  public async savePrivateKey(key: string) {
    const [pkey] = await Promise.all([
      importPrivateKey(key),
      Storage.set({
        key: privateKeyStorgageKey + this.accountService.uid$.value,
        value: key,
      }),
    ]);
    this.keyStorage$.next(pkey);
  }

  async getKey() {
    try {
      if (this.keyStorage$.value == null) {
        await this.loadPrivateKey();
      }
      return this.keyStorage$.value;
    } catch (error) {
      console.error('getPrivateKey error', error);
    }
  }

  private async loadPrivateKey() {
    const val = (
      await Storage.get({
        key: privateKeyStorgageKey + this.accountService.uid$.value,
      })
    ).value;
    if (!val) {
      throw new Error('No private key');
    }
    this.keyStorage$.next(await importPrivateKey(val));
  }
}
