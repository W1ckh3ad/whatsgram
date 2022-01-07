import { PrivateData } from './private-data.model';
import { DisplayName, PhotoURL } from './utils.types';

export class Account {
  constructor(
    public uid: string,
    public email: string,
    public publicKey: string,
    public phoneNumber?: string,
    public photoURL?: PhotoURL,
    public displayName?: DisplayName,
    public description?: string,
    public privateData?: PrivateData
  ) {}
}
