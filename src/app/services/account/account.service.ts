import { Injectable } from '@angular/core';
import { Auth, User as AuthUser } from '@angular/fire/auth';
import { DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatService } from '../chat/chat.service';
import { Message } from '../chat/message.model';
import { CryptoService } from '../crypto/crypto.service';
import { FirestoreService } from '../firestore/firestore.service';
import { Account } from './account.model';
import { Chat } from './chat-model';
import { PrivateData } from './private-data.model';
import { UserEdit } from './user-edit.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private storage: {
    uid: string;
    usersRef: DocumentReference<User>;
    privateDataRef: DocumentReference<PrivateData>;
  } = {
    privateDataRef: null,
    uid: null,
    usersRef: null,
  };

  constructor(
    private auth: Auth,
    private db: FirestoreService,
    private crypto: CryptoService,
    private chat: ChatService
  ) {
    if (auth.currentUser) {
      this.uid = auth.currentUser.uid;
    }
    this.authEventlistener();
  }

  load(): Observable<User> {
    return this.db.doc$(this.usersRef);
  }

  async loadSnap(): Promise<Account> {
    const data = await this.db.docSnap(this.usersRef);
    const privateData = await this.db.docSnap(this.privateDataRef);
    return { ...data, privateData };
  }

  async updateProfile({
    displayName,
    description,
    phoneNumber,
    photoURL,
  }: UserEdit) {
    const { privateData, ...rest } = await this.loadSnap();
    return this.update({
      ...rest,
      displayName,
      phoneNumber: phoneNumber ?? null,
      description: description ?? null,
      photoURL: photoURL ?? null,
      privateData: this.db.getPrivateDataDoc(this.uid),
    });
  }

  async create({ displayName, email, photoURL, uid }: AuthUser) {
    this.uid = uid;
    const { privateKey, publicKey } = await this.crypto.exportKeys(
      await this.crypto.generateKeys()
    );
    this.db.set(this.privateDataRef, {
      contacts: [],
      privateKey,
      chats: {},
      groupChats: [],
    });
    const data = {
      displayName,
      email,
      photoURL,
      uid,
      publicKey,
      privateData: this.privateDataRef,
    };
    return this.db.set(this.usersRef, data);
  }

  async exists() {
    return this.db.exists(this.usersRef);
  }

  async add(uid: string) {
    const {
      privateData: { contacts, ...rest },
    } = await this.loadSnap();

    const doc = this.db.getUsersDoc(uid);
    if (contacts.includes(doc)) {
      throw new Error('User already in Contacts');
    }
    return this.updatePrivate({
      ...rest,
      contacts: [...contacts, doc],
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
    if (chats && chats[receiverUid] === undefined) {
      chats = {
        ...chats,
        [receiverUid]: {
          createdAt: this.db.timestamp,
          updatedAt: this.db.timestamp,
          messages: [],
        } as Chat,
      };
    } else {
      chats[receiverUid].updatedAt = this.db.timestamp;
    }
    try {
      const ownMessage = await this.chat.createMessageForSender(
        msg,
        receiverUid,
        responseTo,
        groupId,
        rest.publicKey,
        this.uid
      );
      // if (groupId) {
      //   await this.chat.createMessageForEveryGroupMember(
      //     msg,
      //     responseTo,
      //     groupId,
      //     rest.uid
      //   );
      // } else {
      //   await this.chat.createMessageForSingleReceiver(
      //     msg,
      //     receiverUid,
      //     responseTo,
      //     groupId,
      //     rest.uid
      //   );
      // }

      chats[receiverUid].messages.push(ownMessage);
      this.updatePrivate({
        ...restPrivate,
        chats,
      });
    } catch (error) {
      console.error(error);
    }
  }

  private authEventlistener() {
    this.auth.onAuthStateChanged((credential) => {
      if (credential) {
        this.uid = credential.uid;
      } else {
        this.uid = null;
      }
    });
  }

  private update(data: User) {
    return this.db.update(this.usersRef, data);
  }

  private updatePrivate(data: PrivateData) {
    return this.db.update(this.privateDataRef, data);
  }

  private get uid() {
    return this.storage.uid;
  }

  private set uid(val) {
    this.storage = {
      uid: val,
      privateDataRef: this.db.getPrivateDataDoc(val),
      usersRef: this.db.getUsersDoc(val),
    };
  }

  private get usersRef() {
    return this.storage.usersRef;
  }

  private get privateDataRef() {
    return this.storage.privateDataRef;
  }
}
