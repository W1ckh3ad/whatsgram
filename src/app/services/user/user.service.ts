import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  query,
  collection,
  where,
  orderBy,
  limit,
  CollectionReference,
} from '@angular/fire/firestore';
import { Account } from '../account/account.model';
import { FirestoreService } from '../firestore/firestore.service';

const collectionName = 'users';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  ref: CollectionReference<Account>;

  constructor(private db: FirestoreService, public auth: Auth) {
    this.ref = this.db.collection<Account>(collectionName);
  }

  find(emailUidOrTelephone: string) {
    return this.db.collectionQuery$<Account>(
      collectionName,
      where(this.getField(emailUidOrTelephone), '==', emailUidOrTelephone),
      limit(100)
    );
  }

  load(userId: string) {
    return this.db.doc$(this.getRef(userId));
  }

  loadList(userIds: string[]) {
    return this.db.collectionQuery$<Account>(
      collectionName,
      where('uid', 'in', userIds),
      orderBy('displayName')
    );
  }

  private getRef(userId: string) {
    return this.db.doc<Account>(`users/${userId}`);
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
