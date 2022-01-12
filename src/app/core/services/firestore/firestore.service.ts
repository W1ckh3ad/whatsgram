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
  serverTimestamp,
  Timestamp,
  deleteDoc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  SetOptions,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PrivateData } from '@models/private-data.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { Message } from '@models/message.model';
import { DocumentBase } from '@models/document-base.model';
import {
  devices,
  groups,
  messages,
  privateData,
  users,
} from '@constants/collection-names';
import { Group } from '@models/group.model';

type CollectionPredicate<T> = string | CollectionReference<T & DocumentBase>;
type DocumentPredicate<T> = string | DocumentReference<T>;

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private fs: Firestore) {}
  private readonly options = { idField: 'id' };
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

  collectionQuery<T>(ref: string, ...queryConstriant: QueryConstraint[]) {
    return query<T>(this.collection<T>(ref), ...queryConstriant);
  }

  // query

  doc$<T>(ref: DocumentPredicate<T>): Observable<T> {
    return docData(this.doc(ref));
  }

  docWithMetaData$<T>(
    ref: DocumentPredicate<T & DocumentBase>
  ): Observable<T & DocumentBase> {
    return docData(this.doc(ref), this.options);
  }

  async docSnap<T>(ref: DocumentPredicate<T>): Promise<T> {
    try {
      const doc = await getDoc(this.doc(ref));
      return doc.data() as T;
    } catch (error) {
      console.error('docSnap error', error, ref);
      throw error;
    }
  }

  async docSnapWithMetaData<T>(
    ref: DocumentPredicate<T>
  ): Promise<T & DocumentBase> {
    try {
      const doc = await getDoc(this.doc(ref));
      return { ...doc.data(), id: doc.id } as T & DocumentBase;
    } catch (error) {
      console.error('docSnapWithMetaData error', error, ref);
      throw error;
    }
  }

  collection$<T>(
    ref: CollectionPredicate<T>
  ): Observable<(T & DocumentBase)[]> {
    return collectionData<T & DocumentBase>(
      this.collection<T & DocumentBase>(ref),
      this.options
    );
  }

  collectionQuery$<T>(
    ref: string,
    ...queryContraints: QueryConstraint[]
  ): Observable<(T & DocumentBase)[]> {
    return collectionData<T & DocumentBase>(
      this.collectionQuery<T & DocumentBase>(ref, ...queryContraints),
      this.options
    );
  }

  get timestamp() {
    return serverTimestamp() as Timestamp;
  }

  async exists<T>(ref: DocumentPredicate<T>) {
    try {
      const { exists } = await getDoc(this.doc(ref));
      return exists();
    } catch (error) {
      console.error('exists error', error, ref);
      return false;
    }
  }

  // write

  async add<T>(
    collection: CollectionPredicate<T>,
    data: T
  ): Promise<DocumentReference<T>> {
    const ts = this.timestamp;
    return addDoc(this.collection(collection), {
      ...data,
      updatedAt: ts,
      createdAt: ts,
    } as any);
  }

  async addWithDocumentReference<T>(
    ref: DocumentPredicate<T>,
    data: T
  ): Promise<void> {
    const ts = this.timestamp;
    return setDoc(this.doc<T>(ref), { ...data, updatedAt: ts, createdAt: ts });
  }

  async setUpdate<T>(
    ref: DocumentPredicate<T>,
    data: any,
    options?: SetOptions
  ): Promise<void> {
    const ts = this.timestamp;
    return setDoc(this.doc<T>(ref), { ...data, updatedAt: ts }, options);
  }

  async update<T>(ref: DocumentPredicate<T>, data: T): Promise<void> {
    const ts = this.timestamp;
    return updateDoc(this.doc<T>(ref), { ...data, updatedAt: ts } as any);
  }

  async remove<T>(ref: DocumentPredicate<T>) {
    return deleteDoc(this.doc(ref));
  }

  getUsersDoc(uid: string) {
    return this.doc<WhatsgramUser & DocumentBase>(`${users}/${uid}`);
  }
  getPrivateDataDoc(uid: string) {
    return this.doc<PrivateData & DocumentBase>(`${privateData}/${uid}`);
  }
  getMessageDoc(
    userId: string,
    groupOrChat: 'groups' | 'chats',
    groupdOrChatID: string,
    messageId: string
  ) {
    return this.doc<Message>(
      `${users}/${userId}/${groupOrChat}/${groupdOrChatID}/${messages}/${messageId}`
    );
  }

  getGroupDoc(groupId: string) {
    return this.doc$<Group>(`${groups}/${groupId}`);
  }

  getUsersCol() {
    return this.collection<WhatsgramUser>(users);
  }

  getMessageCol(
    userId: string,
    groupOrChat: 'groups' | 'chats',
    groupdOrChatID: string
  ) {
    return this.collection<Message>(
      `${users}/${userId}/${groupOrChat}/${groupdOrChatID}/${messages}`
    );
  }

  getDevicesCol() {
    return this.collection<{}>(devices);
  }
}
