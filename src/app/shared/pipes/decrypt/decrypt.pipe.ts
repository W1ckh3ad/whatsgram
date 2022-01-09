import { Pipe, PipeTransform } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { AccountService } from '@services/account/account.service';
import { Message } from '@models/message.model';
import { CryptoService } from '@services/crypto/crypto.service';

@Pipe({
  name: 'decrypt',
})
export class DecryptPipe implements PipeTransform {
  constructor(private account: AccountService, private crypto: CryptoService) {}

  transform(message: Message, ...args: unknown[]): Observable<string> {
    const promise = from(this.account.getPrivateKey()).pipe(
      switchMap((x) => from(this.crypto.decryptMessage(message.text, x)))
    );
    return promise;
  }
}
