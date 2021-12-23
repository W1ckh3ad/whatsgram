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
} from '@angular/fire/firestore';
import { deleteDoc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

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
    return collectionData(this.collection<T>(ref));
  }

  collectionQuery$<T>(
    ref: QueryPredicate<T>,
    ...queryFn: QueryConstraint[]
  ): Observable<T[]> {
    return collectionData(this.collectionQuery(ref, ...queryFn));
  }

  get timestamp() {
    return serverTimestamp();
  }

  async exists<T>(ref: DocumentPredicate<T>) {
    const snap = await getDoc(this.doc(ref));
    return snap.exists();
  }

  // write

  set<T>(ref: DocumentPredicate<T>, data: any) {
    const ts = this.timestamp;
    return setDoc(this.doc(ref), { ...data, updatedAt: ts, createdAt: ts });
  }

  update<T>(ref: DocumentPredicate<T>, data: any) {
    const ts = this.timestamp;
    return updateDoc(this.doc(ref), { ...data, updatedAt: ts });
  }

  remove<T>(ref: DocumentPredicate<T>) {
    return deleteDoc(this.doc(ref));
  }
}
