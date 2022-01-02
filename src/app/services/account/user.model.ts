import { DocumentReference } from '@angular/fire/firestore';
import { PrivateData } from './private-data.model';
import { DisplayName, PhotoURL } from './utils.types';

export class User {
  constructor(
    public uid: string,
    public email: string,
    public privateData: DocumentReference<PrivateData>,
    public publicKey: string,
    public displayName: string,
    public photoURL?: string,
    public phoneNumber?: string,
    public description?: string
  ) {}
}
