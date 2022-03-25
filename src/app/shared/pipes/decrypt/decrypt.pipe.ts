import { Pipe, PipeTransform } from '@angular/core';
import { PrivateKeyService } from '@services/privateKey/private-key.service';
import { decryptMessage } from '@utils/crypto.utils';
import { from, Observable, switchMap } from 'rxjs';

@Pipe({
  name: 'decrypt',
})
export class DecryptPipe implements PipeTransform {
  constructor(private privateKeyService: PrivateKeyService) {}

  transform(message: string): Observable<string> {
    const promise = from(this.privateKeyService.getKey()).pipe(
      switchMap((x) => from(decryptMessage(message, x)))
    );
    return promise;
  }
}
