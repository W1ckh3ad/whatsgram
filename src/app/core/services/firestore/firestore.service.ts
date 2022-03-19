import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDoc,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  SetOptions,
  Timestamp,
  updateDoc,
  getDocs,
} from '@angular/fire/firestore';
import { Device } from '@models/device.model';
import { DocumentBase } from '@models/document-base.model';
import { Group } from '@models/group.model';
import { Message } from '@models/message.model';
import { PrivateData } from '@models/private-data.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import {
  getDevicesColPath,
  getGroupDocPath,
  getMessageColPath,
  getMessageDocPath,
  getPrivateDataDocPath,
  getUserDocPath,
  getUsersColPath,
} from '@utils/db.utils';
import { Observable } from 'rxjs';

type CollectionPredicate<T> = string | CollectionReference<T & DocumentBase>;
type DocumentPredicate<T> = string | DocumentReference<T>;

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private fs: Firestore) {}
  private readonly options = { idField: 'id' };
  docRef<T>(ref: DocumentPredicate<T>): DocumentReference<T> {
    return typeof ref === 'string'
      ? (doc(this.fs, ref) as DocumentReference<T>)
      : ref;
  }

  collectionRef<T>(ref: CollectionPredicate<T>): CollectionReference<T> {
    return typeof ref === 'string'
      ? (collection(this.fs, ref) as CollectionReference<T>)
      : ref;
  }

  collectionQueryRef<T>(ref: string, ...queryConstriant: QueryConstraint[]) {
    return query<T>(this.collectionRef<T>(ref), ...queryConstriant);
  }

  // query

  doc$<T>(ref: DocumentPredicate<T>): Observable<T> {
    return docData(this.docRef(ref));
  }

  docWithMetaData$<T>(
    ref: DocumentPredicate<T & DocumentBase>
  ): Observable<T & DocumentBase> {
    return docData(this.docRef(ref), this.options);
  }

  async docSnap<T>(ref: DocumentPredicate<T>): Promise<T> {
    try {
      const doc = await getDoc(this.docRef(ref));
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
      const doc = await getDoc(this.docRef(ref));
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
      this.collectionRef<T & DocumentBase>(ref),
      this.options
    );
  }

  collectionQuery$<T>(
    ref: string,
    ...queryContraints: QueryConstraint[]
  ): Observable<(T & DocumentBase)[]> {
    return collectionData<T & DocumentBase>(
      this.collectionQueryRef<T & DocumentBase>(ref, ...queryContraints),
      this.options
    );
  }

  collection<T>(ref: CollectionPredicate<T>) {
    return getDocs<T & DocumentBase>(this.collectionRef<T & DocumentBase>(ref));
  }

  get timestamp() {
    return serverTimestamp() as Timestamp;
  }

  async exists<T>(ref: DocumentPredicate<T>) {
    try {
      const doc = await getDoc(this.docRef(ref));
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
    return addDoc(this.collectionRef(collection), {
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
    return setDoc(this.docRef<T>(ref), {
      ...data,
      updatedAt: ts,
      createdAt: ts,
    });
  }

  async setUpdate<T>(
    ref: DocumentPredicate<T>,
    data: any,
    options?: SetOptions
  ): Promise<void> {
    const ts = this.timestamp;
    return setDoc(this.docRef<T>(ref), { ...data, updatedAt: ts }, options);
  }

  async update<T>(ref: DocumentPredicate<T>, data: T): Promise<void> {
    const ts = this.timestamp;
    return updateDoc(this.docRef<T>(ref), { ...data, updatedAt: ts } as any);
  }

  async remove<T>(ref: DocumentPredicate<T>) {
    return deleteDoc(this.docRef(ref));
  }

  getUserDoc(uid: string) {
    return this.docRef<WhatsgramUser & DocumentBase>(getUserDocPath(uid));
  }
  getPrivateDataDoc(uid: string) {
    return this.docRef<PrivateData & DocumentBase>(getPrivateDataDocPath(uid));
  }
  getMessageDoc(userId: string, groupdOrChatID: string, messageId: string) {
    return this.docRef<Message>(
      getMessageDocPath(userId, groupdOrChatID, messageId)
    );
  }

  getGroupDoc(groupId: string) {
    return this.doc$<Group>(getGroupDocPath(groupId));
  }

  getUsersCol() {
    return this.collectionRef<WhatsgramUser>(getUsersColPath());
  }

  getMessageCol(userId: string, groupdOrChatID: string) {
    return this.collectionRef<Message>(
      getMessageColPath(userId, groupdOrChatID)
    );
  }

  getDevicesCol(userId: string) {
    return this.collectionRef<Device & DocumentBase>(getDevicesColPath(userId));
  }
}
