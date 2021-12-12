import { Injectable } from '@angular/core';
import { Firestore, doc, collection } from '@angular/fire/firestore';
import { getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  async saveUser(user: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const data = await getDoc(userRef);

    try {
      if (!data.data) {
        return await updateDoc(userRef, user as any);
      }

      return await setDoc(userRef, user as any);
    } catch (error) {
      console.error(error);
    }
  }

  async loadUser(userId: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    return await getDoc(userRef);
  }
}
