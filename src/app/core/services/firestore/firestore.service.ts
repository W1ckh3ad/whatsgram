import { Injectable } from '@angular/core';
import {
  addDoc, collection,
  collectionData,
  CollectionReference, deleteDoc, doc, docData, DocumentReference,
  Firestore, getDoc, query,
  QueryConstraint,
  serverTimestamp, setDoc, SetOptions, Timestamp, updateDoc
} from '@angular/fire/firestore';
import { Device } from '@models/device.model';
import { DocumentBase } from 'shared/models/document-base.model';
import { Group } from '@models/group.model';
import { Message } from 'shared/models/message.model';
import { PrivateData } from '@models/private-data.model';
import { WhatsgramUser } from 'shared/models/whatsgram.user.model';
import { getDevicesColPath, getGroupDocPath, getMessageColPath, getMessageDocPath, getPrivateDataDocPath, getUserDocPath, getUsersColPath } from 'shared/utils/db.utils';
import { Observable } from 'rxjs';

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
      const doc = await getDoc(this.doc(ref));
      return doc.exists();
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

  getUserDoc(uid: string) {
    return this.doc<WhatsgramUser & DocumentBase>(getUserDocPath(uid));
  }
  getPrivateDataDoc(uid: string) {
    return this.doc<PrivateData & DocumentBase>(getPrivateDataDocPath(uid));
  }
  getMessageDoc(
    userId: string,
    groupdOrChatID: string,
    messageId: string
  ) {
    return this.doc<Message>(
      getMessageDocPath(userId, groupdOrChatID, messageId)
    );
  }

  getGroupDoc(groupId: string) {
    return this.doc$<Group>(getGroupDocPath(groupId));
  }

  getUsersCol() {
    return this.collection<WhatsgramUser>(getUsersColPath());
  }

  getMessageCol(userId: string, groupdOrChatID: string) {
    return this.collection<Message>(getMessageColPath(userId, groupdOrChatID));
  }

  getDevicesCol(userId: string) {
    return this.collection<Device & DocumentBase>(getDevicesColPath(userId));
  }
}
