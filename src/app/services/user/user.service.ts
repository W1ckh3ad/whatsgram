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
} from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  ref;
  constructor(private firestore: FirestoreService, public auth: Auth) {
    this.ref = this.firestore.collection('users');
  }

  find(emailUidOrTelephone: string) {
    return this.firestore.collectionQuery$<{}>(
      this.ref,
      where(this.getField(emailUidOrTelephone), '==', emailUidOrTelephone),
      limit(100)
    );
  }

  load(userId: string) {
    return this.firestore.doc$(this.getRef(userId));
  }

  loadList(userIds: string[]) {
    return this.firestore.collectionQuery$(
      this.ref,
      where('uid', 'in', userIds),
      orderBy('displayName')
    );
  }

  private getRef(userId: string) {
    return this.firestore.doc(`users/${userId}`);
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
