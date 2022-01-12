import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@angular/fire/auth';
import { WhatsgramUser } from '@models/whatsgram.user.model';

@Pipe({
  name: 'photoUrl',
})
export class PhotoUrlPipe implements PipeTransform {
  transform({ email = 't', photoURL }: User | WhatsgramUser): unknown {
    return photoURL && photoURL !== ''
      ? photoURL
      : `https://avatars.dicebear.com/api/identicon/${email}.svg`;
  }
}
