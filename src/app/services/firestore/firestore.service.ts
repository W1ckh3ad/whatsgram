import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  docData,
  query,
  QueryConstraint,
  Query,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Inbox } from '../account/inbox.model';
import { PrivateData } from '../account/private-data.model';
import { WhatsgramUser } from '../account/whatsgram.user.model';
import { Message } from '../chat/message.model';

type CollectionPredicate<T> = string | CollectionReference<T>;
type DocumentPredicate<T> = string | DocumentReference<T>;
type QueryPredicate<T> = string | Query<T>;

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private fs: Firestore) {}

  doc<T>(ref: DocumentPredicate<T>): DocumentReference<T> {
    return typeof ref === 'string'
      ? (doc(this.fs, ref) as DocumentReference<T>)
      : ref;
  }

  collection<T>(ref: CollectionPredicate<T>): CollectionReference<T> {
    return typeof ref === 'string'
      ? (collection(this.fs, ref) as CollectionReference<T>)
      : ref;
  }

  collectionQuery<T>(ref: QueryPredicate<T>, ...queryFn: QueryConstraint[]) {
    return typeof ref === 'string'
      ? query<T>(this.collection<T>(ref), ...queryFn)
      : ref;
  }

  // query

  doc$<T>(ref: DocumentPredicate<T>): Observable<T> {
    return docData(this.doc(ref));
  }

  async docSnap<T>(ref: DocumentPredicate<T>): Promise<T> {
    return (await getDoc(this.doc(ref))).data() as T;
  }

  collection$<T>(ref: CollectionPredicate<T>): Observable<T[]> {
    return collectionData<T>(this.collection<T>(ref));
  }

  collectionQuery$<T>(
    ref: QueryPredicate<T>,
    ...queryFn: QueryConstraint[]
  ): Observable<T[]> {
    return collectionData<T>(this.collectionQuery(ref, ...queryFn));
  }

  get timestamp() {
    return serverTimestamp() as Timestamp;
  }

  async exists<T>(ref: DocumentPredicate<T>) {
    const snap = await getDoc(this.doc(ref));
    return snap.exists();
  }

  // write

  set<T>(ref: DocumentPredicate<T>, data: T) {
    const ts = this.timestamp;
    return setDoc(this.doc<T>(ref), { ...data, updatedAt: ts, createdAt: ts });
  }

  update<T>(ref: DocumentPredicate<T>, data: T) {
    const ts = this.timestamp;
    return updateDoc(this.doc<T>(ref), { ...data, updatedAt: ts } as any);
  }

  remove<T>(ref: DocumentPredicate<T>) {
    return deleteDoc(this.doc(ref));
  }

  getUsersDoc(uid: string): DocumentReference<WhatsgramUser> {
    return this.doc<WhatsgramUser>(`users/${uid}`);
  }
  getPrivateDataDoc(uid: string): DocumentReference<PrivateData> {
    return this.doc<PrivateData>(`privateData/${uid}`);
  }
  getMessageDoc(guid: string): DocumentReference<Message> {
    return this.doc<Message>(`messages/${guid}`);
  }

  getInboxDoc(uid: string): DocumentReference<Inbox> {
    return this.doc<Inbox>(`inbox/${uid}`);
  }

  getUsersCol(): CollectionReference<WhatsgramUser> {
    return this.collection<WhatsgramUser>(`users`);
  }
  getPrivateDataCol(): CollectionReference<PrivateData> {
    return this.collection<PrivateData>(`privateData`);
  }
  getMessageCol(): CollectionReference<Message> {
    return this.collection<Message>(`messages`);
  }

  getInboxCol(): CollectionReference<Inbox> {
    return this.collection<Inbox>(`inbox`);
  }
}
