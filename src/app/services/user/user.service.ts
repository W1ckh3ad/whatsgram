import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDoc,
  setDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async saveUser({ phoneNumber, ...user }: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const docSnap = await getDoc(userRef);
    console.log(docSnap.data());
    try {
      if (docSnap.exists()) {
        return await updateDoc(userRef, { ...user, ...docSnap.data() });
      }

      return await setDoc(userRef, { ...user, phoneNumber });
    } catch (error) {
      console.error(error);
    }
  }

  async loadUser(userId: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    return await getDoc(userRef);
  }
}
