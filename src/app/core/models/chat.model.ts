import { DocumentBase } from "./document-base.model";
import { Message } from "./message.model";

export interface Chat {
  lastReadMessage: string;
  unread?: number;
  isGroupChat?: boolean;
  lastMessage: Message | DocumentBase
  photoURL: string;
  
}
