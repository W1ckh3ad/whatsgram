import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '@services/firestore/firestore.service';

@Pipe({
  name: 'doc',
})
export class DocPipe implements PipeTransform {
  constructor(private db: FirestoreService) {}

  transform(value: any): Observable<any> {
    return this.db.doc$(value.path);
  }
}
