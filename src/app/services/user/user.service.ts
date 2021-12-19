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

  async find(emailUidOrTelephone: string) {
    const q1 = getDocs(
      query(
        this.ref,
        where(this.getField(emailUidOrTelephone), '==', emailUidOrTelephone),
        limit(100)
      )
    );

    return q1;
  }

  async load(userId: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    return await getDoc(userRef);
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
