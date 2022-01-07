import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  where,
  orderBy,
  limit,
  CollectionReference,
} from '@angular/fire/firestore';
import { WhatsgramUser } from '../account/whatsgram.user.model';
import { FirestoreService } from '../firestore/firestore.service';

const collectionName = 'users';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  ref: CollectionReference<WhatsgramUser>;

  constructor(private db: FirestoreService, public auth: Auth) {
    this.ref = this.db.getUsersCol();
  }

  find(emailUidOrTelephone: string) {
    return this.db.collectionQuery$<WhatsgramUser>(
      collectionName,
      where(this.getField(emailUidOrTelephone), '==', emailUidOrTelephone),
      limit(100)
    );
  }

  load(userId: string) {
    return this.db.doc$(this.db.getUsersDoc(userId));
  }

  loadSnap(userId: string) {
    return this.db.docSnap(this.db.getUsersDoc(userId));
  }

  loadList(userIds: string[]) {
    return this.db.collectionQuery$<WhatsgramUser>(
      collectionName,
      where('uid', 'in', userIds),
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
