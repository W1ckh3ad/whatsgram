import { Pipe, PipeTransform } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { Message } from '@models/message.model';
import { decryptMessage } from 'src/app/core/utls/crypto.utils';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';

@Pipe({
  name: 'decrypt',
})
export class DecryptPipe implements PipeTransform {
  constructor(private cryptoKeys: CryptoKeysService) {}

  transform(message: Message, ...args: unknown[]): Observable<string> {
    const promise = from(this.cryptoKeys.getPrivateKey()).pipe(
      switchMap((x) => from(decryptMessage(message.text, x)))
    );
    return promise;
  }
}
