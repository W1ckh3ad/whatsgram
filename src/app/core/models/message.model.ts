export interface Message {
  text: string;
  senderId: string;
  receiverId: string;
  groupId?: string;
  receiverMessagePath?: string | string[];
  mediaPath?: string;
}
