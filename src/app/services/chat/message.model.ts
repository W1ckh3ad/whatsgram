import { FieldValue } from "firebase/firestore";

export interface Message {
  guid: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: FieldValue;
  responseTo?: string;
  groupId?: string;
}
