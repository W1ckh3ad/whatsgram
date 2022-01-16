import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photoUrl',
})
export class PhotoUrlPipe implements PipeTransform {
  transform({ photoURL }: { photoURL?: string }, seed: string): unknown {
    return photoURL && photoURL !== ''
      ? photoURL
      : `https://avatars.dicebear.com/api/identicon/${seed}.svg`;
  }
}
