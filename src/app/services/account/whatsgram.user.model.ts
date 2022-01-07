import { DocumentReference } from '@angular/fire/firestore';
import { PrivateData } from './private-data.model';

export class WhatsgramUser {
  constructor(
    public uid: string,
    public email: string,
    public privateDataRef: DocumentReference<PrivateData>,
    public publicKey: string,
    public displayName: string,
    public photoURL?: string,
    public phoneNumber?: string,
    public description?: string
  ) {}
}
