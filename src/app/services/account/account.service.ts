import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { DocumentReference, Firestore, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';
import { Account } from './account.model';
import { UserEdit } from './user-edit.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private uid = new BehaviorSubject<string>(null);
  private docRef = new BehaviorSubject<DocumentReference<Account>>(null);

  constructor(private auth: Auth, private db: FirestoreService) {
    if (auth.currentUser) {
      this.uid.next(auth.currentUser.uid);
      this.docRef.next(this.getDoc(auth.currentUser.uid));
    }
    this.authEventlistener();
  }

  load() {
    return this.db.doc$(this.docRef.value);
  }

  async loadSnap() {
    return this.db.docSnap(this.docRef.value);
  }

  async updateProfile({
    displayName,
    description,
    phoneNumber,
    photoURL,
  }: UserEdit) {
    const prev = await this.loadSnap();
    return this.update({
      ...prev,
      displayName,
      phoneNumber: phoneNumber ?? null,
      description: description ?? null,
      photoURL: photoURL ?? null,
    });
  }

  create({ displayName, email, photoURL, uid }: User) {
    this.docRef.next(this.getDoc(uid));
    return this.db.set(this.docRef.value, {
      displayName,
      email,
      photoURL,
      uid,
      privateData: {
        contacts: [],
      },
    });
  }

  async exists() {
    return this.db.exists(this.docRef.value);
  }

  async add(uid: string) {
    const { privateData, ...rest } = await this.loadSnap();
    const { contacts, ...restPrivate } = privateData ?? { contacts: [] };
    if (contacts.includes(uid)) {
      throw new Error('User already in Contacts');
    }
    return this.update({
      ...rest,
      privateData: {
        ...restPrivate,
        contacts: [...contacts, uid],
      },
    });
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

  private update(data) {
    return this.db.update(this.docRef.value, data);
  }

  getDoc(uid: string): DocumentReference<Account> {
    return this.db.doc<Account>(`users/${uid}`);
  }
}
