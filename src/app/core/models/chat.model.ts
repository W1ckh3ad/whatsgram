import { DocumentBase } from './document-base.model';
import { Message } from './message.model';
import { WhatsgramUser } from './whatsgram.user.model';

export interface Chat {
  info: {
    alt: string;
    photoURL?: WhatsgramUser['photoURL'];
    displayName: WhatsgramUser['displayName'];
    publicKey?: WhatsgramUser['publicKey'];
  };

  lastReadMessage?: string;
  unread?: number;
  isGroupChat?: boolean;
  lastMessage?: Message & DocumentBase;
}
