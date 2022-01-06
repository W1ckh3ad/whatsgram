import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { Message } from '../chat/message.model';

export class Inbox {
  constructor(
    public chats: {
      [uid: string]: {
        updatedAt: Timestamp;
        createdAt: Timestamp;
        messages: DocumentReference<Message>[];
      };
    },
    public groups: {
      [uid: string]: {
        updatedAt: Timestamp;
        createdAt: Timestamp;
        messages: DocumentReference<Message>[];
      };
    }
  ) {}
}
