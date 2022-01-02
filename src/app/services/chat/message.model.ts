import { DocumentReference, Timestamp } from '@angular/fire/firestore';
import { User } from '../account/user.model';

export class Message {
  constructor(
    public guid: string,
    public text: string,
    public senderId: DocumentReference<User>,
    public receiverId: DocumentReference<User>,
    public createdAt: Timestamp,
    public responseTo?: DocumentReference<Message>,
    public groupId?: string
  ) {}
}
