import { Pipe, PipeTransform } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { Message } from 'src/app/services/chat/message.model';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

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
