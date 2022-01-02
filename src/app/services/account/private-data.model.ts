import { DocumentReference } from '@angular/fire/firestore';
import { Chat } from './chat-model';
import { User } from './user.model';

export class PrivateData {
  constructor(
    public contacts: DocumentReference<User>[],
    public privateKey: string,
    public chats: {
      [uid: string]: Chat;
    },
    public groupChats: string[]
  ) {}
}
