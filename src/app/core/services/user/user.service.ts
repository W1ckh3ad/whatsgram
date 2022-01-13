import { Injectable } from '@angular/core';
import { limit, orderBy, where } from '@angular/fire/firestore';
import { DocumentBase } from '@models/document-base.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { FirestoreService } from '@services/firestore/firestore.service';

const collectionName = 'users';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: FirestoreService) {}

  find(emailUidOrTelephone: string) {
    return this.db.collectionQuery$<WhatsgramUser>(
      collectionName,
      where(this.getField(emailUidOrTelephone), '==', emailUidOrTelephone),
      limit(100)
    );
  }

  load(userId: string) {
    return this.db.docWithMetaData$(this.db.getUsersDoc(userId));
  }

  loadList(userIds: string[]) {
    return this.db.collectionQuery$<WhatsgramUser & DocumentBase>(
      collectionName,
      where('id', 'in', userIds),
      orderBy('displayName')
    );
  }

  private getField(input: string) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (input.match(regexEmail)) {
      return 'email';
    } else if (input.match(/^\d{11,12}/)) {
      return 'phoneNumber';
    }
    return 'uid';
  }
}
