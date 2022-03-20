import {DocumentBase} from "./document-base.model";
import {Message} from "./message.model";
import {WhatsgramUser} from "./whatsgram.user.model";

export interface Chat {
  info: {
    photoURL?: WhatsgramUser["photoURL"];
    displayName: WhatsgramUser["displayName"];
    publicKey?: WhatsgramUser["publicKey"];
    description?: WhatsgramUser["description"];
    alt: string;
  };

  lastReadMessage?: string;
  unread?: number;
  isGroupChat?: boolean;
  lastMessage?: Message & DocumentBase;
}
