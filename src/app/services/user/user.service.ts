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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  ref;
  constructor(private firestore: Firestore, public auth: Auth) {
    this.ref = collection(this.firestore, `users`);
  }

  find(emailUidOrTelephone: string) {
    return getDocs(
      query(
        this.ref,
        where(this.getField(emailUidOrTelephone), '==', emailUidOrTelephone),
        limit(100)
      )
    );
  }

  async load(userId: string) {
    const userRef = this.getRef(userId);
    return await getDoc(userRef);
  }

  async loadList(userIds: string[]) {
    return getDocs(
      query(this.ref, where('uid', 'in', userIds), orderBy('displayName'))
    );
  }

  private getRef(userId: string) {
    return doc(this.firestore, `users/${userId}`);
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
