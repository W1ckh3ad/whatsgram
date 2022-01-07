import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { WhatsgramUser } from '../account/whatsgram.user.model';

export type GroupReceiverMessageRef = {
  userRef: DocumentReference<WhatsgramUser>;
  messageRef: DocumentReference<Message>;
};

export class Message {
  constructor(
    public guid: string,
    public text: string,
    public senderRef: DocumentReference<WhatsgramUser>,
    public receiverRef: DocumentReference<WhatsgramUser>,
    public createdAt: Timestamp,
    public responseToRef?: DocumentReference<Message>,
    public groupId?: string,
    public receiverMessageRef?: DocumentReference<Message>,
    public groupReceiverMessageRefs?: GroupReceiverMessageRef[]
  ) {}
}
