import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { DocumentReference } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { guid } from 'src/utils';
import { Message } from '../chat/message.model';
import { CryptoService } from '../crypto/crypto.service';
import { FirestoreService } from '../firestore/firestore.service';
import { Account } from './account.model';
import { Chat } from './chat-model';
import { UserEdit } from './user-edit.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private uid = new BehaviorSubject<string>(null);
  private docRef = new BehaviorSubject<DocumentReference<Account>>(null);

  constructor(
    private auth: Auth,
    private db: FirestoreService,
    private crypto: CryptoService
  ) {
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

  async create({ displayName, email, photoURL, uid }: User) {
    this.docRef.next(this.getDoc(uid));
    const { privateKey, publicKey } = await this.crypto.exportKeys(
      await this.crypto.generateKeys()
    );
    return this.db.set(this.docRef.value, {
      displayName,
      email,
      photoURL,
      uid,
      publicKey,
      privateData: {
        contacts: [],
        privateKey,
        chats: [],
        groupChats: [],
      },
    });
  }

  async exists() {
    return this.db.exists(this.docRef.value);
  }

  async add(uid: string) {
    const {
      privateData: { contacts, ...restPrivate },
      ...rest
    } = await this.loadSnap();
    const doc = this.getDoc(uid);
    if (contacts.includes(doc)) {
      throw new Error('User already in Contacts');
    }
    return this.update({
      ...rest,
      privateData: {
        ...restPrivate,
        contacts: [...contacts, doc],
      },
    });
  }

  async sendMessage(
    msg: string,
    receiverUid: string,
    responseTo: string = null,
    groupId: string = null
  ) {
    let {
      privateData: { chats, ...restPrivate },
      ...rest
    } = await this.loadSnap();
    try {
      chats[receiverUid];
    } catch (error) {
      chats = {
        ...chats,
        [receiverUid]: {
          createdAt: this.db.timestamp,
          updatedAt: this.db.timestamp,
          messages: [],
        } as Chat,
      };
    }
    const publicKey = await this.crypto.importPublicKey(rest.publicKey);
    const obj = {
      createdAt: this.db.timestamp,
      guid: guid(),
      receiverId: receiverUid,
      senderId: rest.uid,
      text: await this.crypto.encryptMessage(msg, publicKey),
      responseTo,
      groupId,
    };
    chats[receiverUid].messages.push(obj);
    this.update({
      ...rest,
      privateData: {
        ...restPrivate,
        chats,
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
