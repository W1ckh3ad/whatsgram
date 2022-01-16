import { Pipe, PipeTransform } from '@angular/core';
import { DocumentBase } from 'shared/models/document-base.model';
import { WhatsgramUser } from 'shared/models/whatsgram.user.model';
import { UserService } from '@services/user/user.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'user',
})
export class UserPipe implements PipeTransform {
  constructor(private user: UserService) {}
  transform(userId: string): Observable<WhatsgramUser & DocumentBase> {
    return this.user.load(userId);
  }
}
