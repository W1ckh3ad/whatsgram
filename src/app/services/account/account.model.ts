import { DocumentReference } from 'firebase/firestore';
import { Chat } from '../chat/chat.model';
import { Message } from '../chat/message.model';

export class Account {
  constructor(
    public uid: string,
    public displayName: string,
    public email: string,
    public publicKey: string,
    public phoneNumber?: string,
    public photoURL?: string,
    public description?: string,
    public privateData?: {
      contacts: DocumentReference<Account>[];
      privateKey: string;
      chats: {
        [uid: string]: Chat;
      };
      groupChats: string[];
    }
  ) {}
}
