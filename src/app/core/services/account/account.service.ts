import { Injectable, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DocumentReference } from '@angular/fire/firestore';
import {
  chats,
  contacts,
  users,
  privateData,
} from '@constants/collection-names';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { PrivateData } from '@models/private-data.model';
import { UserEdit } from '@models/user-edit.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AuthService } from '@services/auth/auth.service';

import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { exportKeys, generateKeys } from '../../utls/crypto.utils';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnDestroy {
  uid$ = new BehaviorSubject<string>(null);
  contacts$: Observable<(DocumentBase & WhatsgramUser)[]> = null;
  user$ = new BehaviorSubject<WhatsgramUser>(null);
  privateData$: Observable<PrivateData> = null;
  private sub: Subscription;
  constructor(private auth: AuthService, private db: FirestoreService) {
    this.auth.user$
      .pipe(
        map((x) => (x ? x.uid : null)),
        tap((x) => console.log(x))
      )
      .subscribe((x) => (x !== this.uid$.value ? this.uid$.next(x) : null));

    this.contacts$ = this.auth.user$.pipe(
      switchMap((x) =>
        this.db.collection$<WhatsgramUser & DocumentBase>(
          `${users}/${x.uid}/${contacts}`
        )
      ),
      shareReplay(1)
    );

    this.sub = this.uid$
      .pipe(
        switchMap((x) =>
          x !== null
            ? this.db.docWithMetaData$<WhatsgramUser>(`${users}/${x}`)
            : of(null)
        )
      )
      .subscribe((x) => this.user$.next(x));

    this.privateData$ = this.auth.user$.pipe(
      switchMap((x) =>
        this.db.docWithMetaData$<PrivateData>(`${privateData}/${x}`)
      ),
      shareReplay(1)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get userRef(): DocumentReference<WhatsgramUser & DocumentBase> {
    const id = this.uid$.value;
    if (!id) throw new Error('User Id is null');
    return this.db.getUsersDoc(id);
  }

  get privateDataRef(): DocumentReference<PrivateData> {
    const id = this.uid$.value;
    if (!id) throw new Error('User Id is null');
    return this.db.getPrivateDataDoc(id);
  }

  get user() {
    return this.db.doc$(this.userRef);
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

    const data: any = {
      displayName: displayName ?? uid,
      email,
      photoURL,
      publicKey,
      id: uid,
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

  async add(user: WhatsgramUser) {
    if (user.id === this.uid) {
      throw new Error("You can't add yourself as contact");
    }
    const doc = this.db.doc(`${users}/${this.uid}/${contacts}/${user.id}`);
    return this.db.addWithDocumentReference(doc, user);
  }

  async deleteContact(userToRemoveId: string) {
    const doc = this.db.doc(
      `${users}/${this.uid}/${contacts}/${userToRemoveId}`
    );
    return this.db.remove(doc);
  }

  public async readMessagesForPrivateChat(
    messageId: string,
    receiverId: string
  ) {
    const refString = `${users}/${this.uid}/${chats}/${receiverId}`;
    const chatRef = this.db.doc<Chat>(refString);
    return this.db.setUpdate(chatRef, { lastReadMessage: messageId } as any, {
      merge: true,
    });
  }

  private get uid() {
    return this.uid$.value;
  }
}
