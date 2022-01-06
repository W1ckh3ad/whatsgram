import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { WhatsgramUser } from '../services/account/whatsgram.user.model';
import { Message } from '../services/chat/message.model';

export type ChatForDisplay = {
  uid: string;
  updatedAt: Timestamp;
  userRef: DocumentReference<WhatsgramUser>;
  lastMessageRef: DocumentReference<Message>;
  unread?: number;
};
