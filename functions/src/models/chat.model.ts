import { DocumentBase } from './document-base.model';
import { Message } from './message.model';

export interface Chat {
  info: {
    photoURL: string;
    displayName: string;
    publicKey?: string;
  };

  lastReadMessage?: string;
  unread?: number;
  isGroupChat?: boolean;
  lastMessage?: Message & DocumentBase;
}
