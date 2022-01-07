import { Chat } from './chat-model';

export class Inbox {
  constructor(
    public chats: {
      [uid: string]: Chat;
    },
    public groups: {
      [uid: string]: Chat;
    }
  ) {}
}
