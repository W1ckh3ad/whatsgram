import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import {
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Account } from './account.model';
import { UserEdit } from './user-edit.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private uid = new BehaviorSubject<string>(null);
  private docRef = new BehaviorSubject<DocumentReference>(null);
  constructor(private auth: Auth, private firestore: Firestore) {
    if (auth.currentUser) {
      this.uid.next(auth.currentUser.uid);
      this.docRef.next(this.getDoc(auth.currentUser.uid));
    }
    this.authEventlistener();
  }

  async load(): Promise<Account> {
    const snap = await getDoc(this.docRef.value);
    return snap.data() as Account;
  }

  async updateProfile({
    displayName,
    description,
    phoneNumber,
    photoURL,
  }: UserEdit) {
    const prev = await this.load();
    return await this.update({
      ...prev,
      displayName,
      phoneNumber: phoneNumber ?? null,
      description: description ?? null,
      photoURL: photoURL ?? null,
    });
  }

  async create({ displayName, email, photoURL, uid }: User) {
    // this.docRef.next(doc(this.firestore, `users/${this.uid.value}`));
    this.docRef.next(this.getDoc(uid));
    return await setDoc(this.docRef.value, {
      displayName,
      email,
      photoURL,
      uid,
    });
  }

  async exists() {
    return (await getDoc(this.docRef.value)).exists();
  }

  private authEventlistener() {
    this.auth.onAuthStateChanged((credential) => {
      if (credential) {
        this.uid.next(credential.uid);
        this.docRef.next(this.getDoc(credential.uid));
      } else {
        this.uid.next(null);
        this.docRef.next(null);
      }
    });
  }

  private async update(data) {
    return await updateDoc(this.docRef.value, data);
  }

  getDoc(uid: string): DocumentReference {
    return doc(this.firestore, `users/${uid}`);
  }
}
