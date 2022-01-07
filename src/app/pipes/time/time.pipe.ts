import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(ts: Timestamp): string {
    const date = ts.toDate();
    return date.getHours() + ':' + date.getMinutes();
  }
}
