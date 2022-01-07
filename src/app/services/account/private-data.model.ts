import { DocumentReference } from '@angular/fire/firestore';
import { Chat } from './chat-model';
import { WhatsgramUser } from './whatsgram.user.model';

export class PrivateData {
  constructor(
    public contactRefs: DocumentReference<WhatsgramUser>[],
    public privateKey: string,
    public chats: {
      [uid: string]: Chat;
    },
    public groupChats: string[]
  ) {}
}
