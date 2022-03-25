import { Injectable, OnDestroy } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DocumentReference } from '@angular/fire/firestore';
import { Device } from '@models/device.model';
import { DocumentBase } from '@models/document-base.model';
import { UserEdit } from '@models/user-edit.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AuthService } from '@services/auth/auth.service';
import { importPublicKey } from '@utils/crypto.utils';
import {
  getContactDocPath,
  getContactsColPath,
  getDevicesColPath,
  getUserDocPath,
} from '@utils/db.utils';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap,
} from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnDestroy {
  uid$ = new BehaviorSubject<string>(null);
  contacts$: Observable<(DocumentBase & WhatsgramUser)[]> = null;
  userStore$ = new BehaviorSubject<WhatsgramUser>(null);
  devices$: Observable<(Device & DocumentBase)[]> = null;
  private keyStorage$ = new BehaviorSubject<CryptoKey>(null);
  private sub: Subscription;
  constructor(
    private authService: AuthService,
    private dbService: FirestoreService
  ) {
    this.authService.user$
      .pipe(map((x) => (x ? x.uid : null)))
      .subscribe((x) => (x !== this.uid$.value ? this.uid$.next(x) : null));

    this.contacts$ = this.uid$.pipe(
      switchMap((x) =>
        this.dbService.collection$<WhatsgramUser & DocumentBase>(
          getContactsColPath(x)
        )
      ),
      shareReplay(1)
    );

    this.devices$ = this.uid$.pipe(
      switchMap((x) =>
        x
          ? this.dbService.collection$<Device & DocumentBase>(
              getDevicesColPath(x)
            )
          : of([] as (Device & DocumentBase)[])
      )
    );

    this.sub = this.uid$
      .pipe(
        switchMap((x) =>
          x !== null
            ? this.dbService.docWithMetaData$<WhatsgramUser>(getUserDocPath(x))
            : of(null)
        )
      )
      .subscribe(async (x) => {
        this.userStore$.next(x);
        if (x.publicKey) {
          console.log(x.publicKey);
          this.keyStorage$.next(await importPublicKey(x.publicKey));
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get publicKey() {
    return this.keyStorage$.value;
  }

  get userRef(): DocumentReference<WhatsgramUser & DocumentBase> {
    const id = this.uid$.value;
    if (!id) throw new Error('User Id is null');
    return this.dbService.getUserDoc(id);
  }

  get user$() {
    return this.dbService.doc$(this.userRef);
  }

  async loadSnapUser() {
    return this.dbService.docSnapWithMetaData(this.userRef);
  }

  async updateProfile({
    displayName,
    description,
    phoneNumber,
    photoURL,
  }: UserEdit) {
    return this.dbService.setUpdate(
      this.userRef,
      { displayName, description, phoneNumber, photoURL },
      { merge: true }
    );
  }

  async exists() {
    return this.dbService.exists(this.userRef);
  }

  async hasContact(userId: string) {
    return await this.dbService.exists(getContactDocPath(this.uid, userId));
  }

  async add(user: WhatsgramUser) {
    if (user.id === this.uid) {
      throw new Error("You can't add yourself as contact");
    }
    const doc = this.dbService.docRef(getContactDocPath(this.uid, user.id));
    return this.dbService.addWithDocumentReference(doc, user);
  }

  async deleteContact(userToRemoveId: string) {
    const doc = this.dbService.docRef(
      getContactDocPath(this.uid, userToRemoveId)
    );
    return this.dbService.remove(doc);
  }

  async create({ displayName, email, photoURL, uid }: User, publicKey: string) {
    if (this.uid$.value !== uid) {
      this.uid$.next(uid);
    }

    const data: any = {
      displayName: displayName ?? uid,
      email,
      photoURL,
      publicKey,
      id: uid,
    };
    return Promise.all([
      ,
      this.dbService.addWithDocumentReference(this.userRef, data),
    ]);
  }

  private get uid() {
    return this.uid$.value;
  }
}
