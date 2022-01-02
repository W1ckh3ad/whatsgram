import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { Message } from '../chat/message.model';

export class Chat {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  messages: DocumentReference<Message>[];
}
