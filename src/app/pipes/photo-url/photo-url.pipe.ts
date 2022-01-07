import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photoUrl',
})
export class PhotoUrlPipe implements PipeTransform {
  transform({
    email = 't',
    photoURL,
  }: {
    email: string;
    photoURL: string;
  }): unknown {
    return photoURL && photoURL !== ''
      ? photoURL
      : `https://avatars.dicebear.com/api/identicon/${email}.svg`;
  }
}
