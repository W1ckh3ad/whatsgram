import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

const prefixZeor = (s: number) => (s >= 10 ? s : '0' + s);

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(ts: Timestamp): string {
    const date = ts.toDate();
    return prefixZeor(date.getHours()) + ':' + prefixZeor(date.getMinutes());
  }
}
