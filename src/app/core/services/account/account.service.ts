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
import { UserService } from '@services/user/user.service';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
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
  user$: Observable<WhatsgramUser & DocumentBase> = null;
  privateData$: Observable<PrivateData> = null;
  constructor(
    private auth: AuthService,
    private db: FirestoreService,
    private userService: UserService
  ) {
    this.auth.user$
      .pipe(
        map((x) => (x ? x.uid : null)),
        tap((x) => console.log(x))
      )
      .subscribe((x) => this.uid$.next(x));

    this.contacts$ = this.auth.user$.pipe(
      switchMap((x) => this.db.collection$(`${users}/${x.uid}/${contacts}`)),
      switchMap((x) => this.userService.loadList(x.map((y) => y.id))),
      shareReplay(1)
    );

    this.user$ = this.auth.user$.pipe(
      switchMap((x) =>
        this.db.docWithMetaData$<WhatsgramUser>(`${users}/${x}`)
      ),
      shareReplay(1)
    );

    this.privateData$ = this.auth.user$.pipe(
      switchMap((x) =>
        this.db.docWithMetaData$<PrivateData>(`${privateData}/${x}`)
      ),
      shareReplay(1)
    );
  }

  ngOnDestroy(): void {}

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

  async add(userToAddId: string) {
    if (userToAddId === this.uid) {
      throw new Error("You can't add yourself as contact");
    }
    const doc = this.db.doc(`${users}/${this.uid}/${contacts}/${userToAddId}`);
    return this.db.addWithDocumentReference(doc, {});
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
