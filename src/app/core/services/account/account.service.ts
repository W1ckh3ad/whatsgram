import { Injectable, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DocumentReference } from '@angular/fire/firestore';
import { AuthAction } from '@models/auth-action.type';
import { Device } from '@models/device.model';
import { DocumentBase } from '@models/document-base.model';
import { PrivateData } from '@models/private-data.model';
import { UserEdit } from '@models/user-edit.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AuthService } from '@services/auth/auth.service';
import { exportKeys, generateKeys } from '@utils/crypto.utils';
import {
  getContactDocPath,
  getContactsColPath,
  getDevicesColPath,
  getPrivateDataDocPath,
  getUserDocPath
} from '@utils/db.utils';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap
} from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnDestroy {
  uid$ = new BehaviorSubject<string>(null);
  contacts$: Observable<(DocumentBase & WhatsgramUser)[]> = null;
  userStore$ = new BehaviorSubject<WhatsgramUser>(null);
  privateData$: Observable<PrivateData> = null;
  devices$: Observable<(Device & DocumentBase)[]> = null;
  private sub: Subscription;
  constructor(private authService: AuthService, private db: FirestoreService) {
    this.authService.user$
      .pipe(
        map((x) => (x ? x.uid : null))
      )
      .subscribe((x) => (x !== this.uid$.value ? this.uid$.next(x) : null));

    this.contacts$ = this.uid$.pipe(
      switchMap((x) =>
        this.db.collection$<WhatsgramUser & DocumentBase>(getContactsColPath(x))
      ),
      shareReplay(1)
    );

    this.devices$ = this.uid$.pipe(
      switchMap((x) =>
        x
          ? this.db.collection$<Device & DocumentBase>(getDevicesColPath(x))
          : of([] as (Device & DocumentBase)[])
      )
    );

    this.sub = this.uid$
      .pipe(
        switchMap((x) =>
          x !== null
            ? this.db.docWithMetaData$<WhatsgramUser>(getUserDocPath(x))
            : of(null)
        )
      )
      .subscribe((x) => this.userStore$.next(x));

    this.privateData$ = this.uid$.pipe(
      switchMap((x) =>
        this.db.docWithMetaData$<PrivateData>(getPrivateDataDocPath(x))
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
    return this.db.getUserDoc(id);
  }

  get privateDataRef(): DocumentReference<PrivateData> {
    const id = this.uid$.value;
    if (!id) throw new Error('User Id is null');
    return this.db.getPrivateDataDoc(id);
  }

  get user$() {
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

  async exists() {
    return this.db.exists(this.userRef);
  }

  async hasContact(userId: string) {
    return await this.db.exists(getContactDocPath(this.uid, userId));
  }

  async add(user: WhatsgramUser) {
    if (user.id === this.uid) {
      throw new Error("You can't add yourself as contact");
    }
    const doc = this.db.doc(getContactDocPath(this.uid, user.id));
    return this.db.addWithDocumentReference(doc, user);
  }

  async deleteContact(userToRemoveId: string) {
    const doc = this.db.doc(getContactDocPath(this.uid, userToRemoveId));
    return this.db.remove(doc);
  }

  async createIfDoesntExistsAndGiveAction(
    user: User
  ): Promise<AuthAction> {
    const { emailVerified } = user;
    if (this.uid$.value === null) {
      this.uid$.next(user.uid);
    }
    if (!(await this.exists())) {
      if (emailVerified) {
        this.create(user);
        return 'set-up-profile';
      }
      return 'verify-email';
    }
    return 'go';
  }

  // public async readMessagesForPrivateChat(
  //   messageId: string,
  //   receiverId: string
  // ) {
  // const refString = getChatDocPath(this.uid, receiverId);
  //   const chatRef = this.db.doc<Chat>(refString);
  //   return this.db.setUpdate(chatRef, { lastReadMessage: messageId } as any, {
  //     merge: true,
  //   });
  // }

  private async create({ displayName, email, photoURL, uid }: User) {
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

  private get uid() {
    return this.uid$.value;
  }
}
