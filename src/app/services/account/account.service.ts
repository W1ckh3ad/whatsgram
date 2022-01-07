import { Injectable, OnDestroy } from '@angular/core';
import { Auth, User as AuthUser } from '@angular/fire/auth';
import { DocumentReference } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatService } from '../chat/chat.service';
import { CryptoService } from '../crypto/crypto.service';
import { FirestoreService } from '../firestore/firestore.service';
import { Account } from './account.model';
import { Chat } from './chat-model';
import { Inbox } from './inbox.model';
import { PrivateData } from './private-data.model';
import { UserEdit } from './user-edit.model';
import { WhatsgramUser } from './whatsgram.user.model';
import { Unsubscribe } from '@angular/fire/auth';

type KeyStorage = {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
};

const defaultKeyStorage = {
  privateKey: null,
  publicKey: null,
};

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnDestroy {
  private keyStorage: KeyStorage = defaultKeyStorage;
  // ToDo: Keystorage überarbeiten
  authSub: Unsubscribe;

  uid$ = new BehaviorSubject<string>(null);

  constructor(
    private auth: Auth,
    private db: FirestoreService,
    private crypto: CryptoService,
    private chat: ChatService
  ) {
    if (this.auth.currentUser) {
      this.uid$.next(this.auth.currentUser.uid);
    }
    this.authEventlistener();
  }

  ngOnDestroy(): void {
    this.authSub();
  }

  async getPublicKey() {
    if (this.keyStorage.publicKey == null) {
      this.keyStorage = await this.loadKeys();
    }
    return this.keyStorage.publicKey;
  }

  async getPrivateKey() {
    if (this.keyStorage.privateKey == null) {
      this.keyStorage = await this.loadKeys();
    }
    return this.keyStorage.privateKey;
  }

  get userRef(): DocumentReference<WhatsgramUser> {
    return this.db.getUsersDoc(this.uid$.value);
  }

  get privateDataRef(): DocumentReference<PrivateData> {
    return this.db.getPrivateDataDoc(this.uid$.value);
  }

  get inboxRef(): DocumentReference<Inbox> {
    return this.db.getInboxDoc(this.uid$.value);
  }

  get user(): Observable<WhatsgramUser> {
    return this.db.doc$(this.userRef);
  }

  get privateData(): Observable<PrivateData> {
    return this.db.doc$(this.privateDataRef);
  }

  get inbox(): Observable<Inbox> {
    return this.db.doc$(this.inboxRef);
  }

  async loadSnapComplete(): Promise<Account> {
    const [data, privateData] = await Promise.all([
      this.loadSnapUser(),
      this.loadSnapPrivate(),
    ]);
    return { ...data, privateData };
  }

  async loadSnapUser(): Promise<WhatsgramUser> {
    return await this.db.docSnap(this.userRef);
  }

  async loadSnapPrivate(): Promise<PrivateData> {
    return await this.db.docSnap(this.privateDataRef);
  }

  async loadSnapInbox(): Promise<Inbox> {
    return await this.db.docSnap(this.inboxRef);
  }

  async updateProfile({
    displayName,
    description,
    phoneNumber,
    photoURL,
  }: UserEdit) {
    const { privateDataRef: privateData, ...rest } = await this.loadSnapUser();
    return this.update({
      ...rest,
      displayName,
      phoneNumber: phoneNumber ?? null,
      description: description ?? null,
      photoURL: photoURL ?? null,
      privateDataRef: this.db.getPrivateDataDoc(this.uid),
    });
  }

  async create({ displayName, email, photoURL, uid }: AuthUser) {
    if (this.uid$.value !== uid) {
      this.uid$.next(uid);
    }
    const { privateKey, publicKey } = await this.crypto.exportKeys(
      await this.crypto.generateKeys()
    );
    this.db.set(this.privateDataRef, {
      contactRefs: [],
      privateKey,
      chats: {},
      groupChats: [],
    });
    this.db.set(this.inboxRef, {
      groups: {},
      chats: {},
    });
    const data: WhatsgramUser = {
      displayName,
      email,
      photoURL,
      uid,
      publicKey,
      privateDataRef: this.privateDataRef,
    };
    return this.db.set(this.userRef, data);
  }

  async exists() {
    return this.db.exists(this.userRef);
  }

  async add(uid: string) {
    const { contactRefs: contacts, ...rest } = await this.loadSnapPrivate();
    const doc = this.db.getUsersDoc(uid);
    if (contacts.includes(doc)) {
      throw new Error('User already in Contacts');
    }
    return this.updatePrivate({
      ...rest,
      contactRefs: [...contacts, doc],
    });
  }

  async sendMessage(
    msg: string,
    receiverUid: string,
    responseTo: string = null,
    groupId: string = null
  ) {
    let [{ chats, ...restPrivate }, publicKey] = await Promise.all([
      this.loadSnapPrivate(),
      this.getPublicKey(),
    ]);
    if (chats && chats[receiverUid] === undefined) {
      chats = {
        ...chats,
        [receiverUid]: {
          createdAt: this.db.timestamp,
          updatedAt: this.db.timestamp,
          messageRefs: [],
        } as Chat,
      };
    } else {
      chats[receiverUid].updatedAt = this.db.timestamp;
    }
    const ownMessage = await this.chat.createMessageForSender(
      msg,
      receiverUid,
      responseTo,
      groupId,
      publicKey,
      this.uid
    );

    chats[receiverUid].messageRefs.push(ownMessage);
    this.updatePrivate({
      ...restPrivate,
      chats,
    });
  }

  public async readMessagesForPrivateChat(
    messageIds: string[],
    receiverId: string
  ) {
    const [privateDate, inbox] = await Promise.all([
      this.loadSnapPrivate(),
      this.loadSnapInbox(),
    ]);
    if (!privateDate.chats[receiverId]) {
      privateDate.chats[receiverId] = {
        createdAt: this.db.timestamp,
        updatedAt: this.db.timestamp,
        messageRefs: [],
      };
    }
    for (const messageId of messageIds) {
      const messageDoc = this.db.getMessageDoc(messageId);
      privateDate.chats[receiverId].messageRefs.push(messageDoc);
      inbox.chats[receiverId].messageRefs.splice(
        inbox.chats[receiverId].messageRefs.findIndex((x) => x.id === messageId)
      );
    }
    const res = await Promise.all([
      this.updatePrivate(privateDate),
      this.updateInbox(inbox),
    ]);
    return res;
  }

  private authEventlistener() {
    this.authSub = this.auth.onAuthStateChanged(async (credential) => {
      this.uid = credential ? credential.uid : null;
    });
  }

  private update(data: WhatsgramUser) {
    return this.db.update(this.userRef, data);
  }

  private updatePrivate(data: PrivateData) {
    return this.db.update(this.privateDataRef, data);
  }

  private updateInbox(data: Inbox) {
    return this.db.update(this.inboxRef, data);
  }

  private get uid() {
    return this.uid$.value;
  }

  private set uid(val) {
    if (val !== this.uid) {
      if (val === null) {
        this.uid$.next(null);
        this.keyStorage = defaultKeyStorage;
        return;
      }
      this.uid$.next(val);
    }
  }

  private async loadKeys() {
    const {
      publicKey,
      privateData: { privateKey },
    } = await this.loadSnapComplete();
    const res = await this.crypto.importKeys(privateKey, publicKey);
    return {
      privateKey: res.privateKey,
      publicKey: res.publicKey,
    };
  }
}
