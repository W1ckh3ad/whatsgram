import { FieldValue } from 'firebase/firestore';
import { Message } from '../chat/message.model';

export class Chat {
  createdAt: FieldValue;
  updatedAt: FieldValue;
  messages: Message[];
}
