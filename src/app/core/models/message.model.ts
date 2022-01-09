export interface Message {
  text: string;
  senderId: string;
  receiverId: string;
  responseToId?: string;
  groupId?: string;
  receiverMessagePath?: string;
  groupReceiverMessagePath?: string;
}
