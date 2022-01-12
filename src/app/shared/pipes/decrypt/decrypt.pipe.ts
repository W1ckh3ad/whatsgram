import { Pipe, PipeTransform } from '@angular/core';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { from, Observable, switchMap } from 'rxjs';
import { decryptMessage } from 'src/app/core/utls/crypto.utils';

@Pipe({
  name: 'decrypt',
})
export class DecryptPipe implements PipeTransform {
  constructor(private cryptoKeys: CryptoKeysService) {}

  transform(message: string): Observable<string> {
    const promise = from(this.cryptoKeys.getPrivateKey()).pipe(
      switchMap((x) => from(decryptMessage(message, x)))
    );
    return promise;
  }
}
