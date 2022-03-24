import { Pipe, PipeTransform } from '@angular/core';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { decryptMessage } from '@utils/crypto.utils';
import { Observable, switchMap } from 'rxjs';

@Pipe({
  name: 'decrypt',
})
export class DecryptPipe implements PipeTransform {
  constructor(private cryptoKeys: CryptoKeysService) {}

  transform(message: string): Observable<string> {
    return this.cryptoKeys.privateKey$.pipe(
      switchMap((x) => {
        if (!x) return '';
        console.log(x, message);
        return decryptMessage(message, x);
      })
    );
  }
}
