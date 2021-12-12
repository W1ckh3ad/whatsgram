export interface Message {
  uid: string;
  text: string;
  userId: string;
  createdAt: Date;
  responseTo?: string;
}
