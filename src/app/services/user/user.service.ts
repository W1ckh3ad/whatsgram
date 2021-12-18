import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  getDoc,
  setDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { UserEdit } from 'src/app/settings/profile/user-edit.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, public auth: Auth) {
  }
  private userRef;
  private userInstance;

  async saveUser(
    { displayName, description, phoneNumber, photoURL }: UserEdit,
    userId: string
  ) {
    const userRef = this.getRef(userId);

    const prevData: any = (await getDoc(userRef)).data();

    return await updateDoc(userRef, {
      ...prevData,
      displayName,
      description,
      phoneNumber,
      photoURL,
    });
  }

  async create(user: User) {
    const doc = this.getRef(user.uid);
    return await setDoc(doc, { ...user });
  }

  async exists(userId: string) {
    return (await getDoc(this.getRef(userId))).exists();
  }

  async load(userId: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    return await getDoc(userRef);
  }

  private getRef(userId: string) {
    if (!this.userRef) {
      this.userRef = doc(this.firestore, `users/${userId}`);
    }
    return this.userRef;
  }


}
