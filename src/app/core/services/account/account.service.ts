import { Injectable, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DocumentReference } from '@angular/fire/firestore';
import { chats, contacts, users } from '@constants/collection-names';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { PrivateData } from '@models/private-data.model';
import { UserEdit } from '@models/user-edit.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AuthService } from '@services/auth/auth.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { exportKeys, generateKeys } from '../../utls/crypto.utils';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnDestroy {
  uid$ = new BehaviorSubject<string>(null);

  constructor(private auth: AuthService, private db: FirestoreService) {
    this.auth.user$.pipe(tap((x) => this.uid$.next(x.uid)));
  }

  ngOnDestroy(): void {}

  get userRef(): DocumentReference<WhatsgramUser> {
    return this.db.getUsersDoc(this.uid$.value);
  }

  get privateDataRef(): DocumentReference<PrivateData> {
    return this.db.getPrivateDataDoc(this.uid$.value);
  }

  get user() {
    return this.db.doc$(this.userRef);
  }

  get privateData() {
    return this.db.doc$(this.privateDataRef);
  }

  get contacts(): Observable<DocumentBase[]> {
    return this.db.collection$(`${users}/${this.uid}/${contacts}`);
  }

  async loadSnapUser() {
    return this.db.docSnapWithMetaData(this.userRef);
  }

  async loadSnapPrivate(): Promise<PrivateData> {
    return this.db.docSnap(this.privateDataRef);
  }

  async updateProfile({
    displayName,
    description,
    phoneNumber,
    photoURL,
  }: UserEdit) {
    return this.db.setUpdate(
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
    };
    return Promise.all([
      this.db.addWithDocumentReference(this.privateDataRef, {
        privateKey,
      }),
      this.db.addWithDocumentReference(this.userRef, data),
    ]);
  }

  async exists() {
    return this.db.exists(this.userRef);
  }

  async hasContact(userId: string) {
    return await this.db.exists(`${users}/${this.uid}/${contacts}/${userId}`);
  }

  async add(userToAddId: string) {
    const doc = this.db.doc(`${users}/${this.uid}/${contacts}/${userToAddId}`);
    if (await this.db.exists(doc)) {
      throw new Error('User already in Contacts');
    }
    return this.db.addWithDocumentReference(doc, {});
  }

  public async readMessagesForPrivateChat(
    messageId: string,
    receiverId: string
  ) {
    const refString = `${users}/${this.uid}/${chats}/${receiverId}`;
    const chatRef = this.db.doc<Chat>(refString);
    return this.db.update(chatRef, { lastReadMessage: messageId });
  }

  private get uid() {
    return this.uid$.value;
  }
}
