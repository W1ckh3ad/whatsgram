import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { WhatsgramUser } from '../account/whatsgram.user.model';

export class Message {
  constructor(
    public guid: string,
    public text: string,
    public sender: DocumentReference<WhatsgramUser>,
    public receiver: DocumentReference<WhatsgramUser>,
    public createdAt: Timestamp,
    public responseTo?: DocumentReference<Message>,
    public groupId?: string
  ) {}
}
