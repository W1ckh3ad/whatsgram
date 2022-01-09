import { Injectable, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DocumentReference } from '@angular/fire/firestore';
import { Chat } from '@models/chat-model';
import { Inbox } from '@models/inbox.model';
import { PrivateData } from '@models/private-data.model';
import { UserEdit } from '@models/user-edit.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AuthService } from '@services/auth/auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Account } from '../../models/account.model';
import { exportKeys, generateKeys } from '../../utls/crypto.utils';
import { ChatService } from '../chat/chat.service';
import { FirestoreService } from '../firestore/firestore.service';

const defaultKeyStorage = {
  privateKey: null,
  publicKey: null,
};

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnDestroy {
  uid$ = new BehaviorSubject<string>(null);

  constructor(
    private auth: AuthService,
    private db: FirestoreService,
    private chat: ChatService
  ) {
    this.auth.user$.pipe(tap((x) => this.uid$.next(x.uid)));
  }

  ngOnDestroy(): void {}

  get userRef(): DocumentReference<WhatsgramUser> {
    return this.db.getUsersDoc(this.uid$.value);
  }

  get privateDataRef(): DocumentReference<PrivateData> {
    return this.db.getPrivateDataDoc(this.uid$.value);
  }

  get inboxRef(): DocumentReference<Inbox> {
    return this.db.getInboxDoc(this.uid$.value);
  }

  get user() {
    return this.db.doc$(this.userRef);
  }

  get privateData() {
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

  async loadSnapUser() {
    return await this.db.docSnapWithMetaData(this.userRef);
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
    return this.db.set(
      this.userRef,
      { displayName, description, phoneNumber, photoURL },
      { merge: true }
    );
  }

  async create({ displayName, email, photoURL, uid }: User) {
    if (this.uid$.value !== uid) {
      this.uid$.next(uid);
    }
    const { privateKey, publicKey } = await exportKeys(await generateKeys());

    const data: WhatsgramUser = {
      displayName,
      email,
      photoURL,
      publicKey,
      privateDataRef: this.privateDataRef,
    };
    return Promise.all([
      this.db.set(this.privateDataRef, {
        contactRefs: [],
        privateKey,
        chats: {},
        groupChats: [],
      }),
      this.db.set(this.inboxRef, {
        groups: {},
        chats: {},
      }),
      this.db.set(this.userRef, data),
    ]);
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
}
