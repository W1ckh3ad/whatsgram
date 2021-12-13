export interface Message {
  uid: string;
  senderText: string;
  receiverText: string;
  userId: string;
  createdAt: Date;
  responseTo?: string;
}
