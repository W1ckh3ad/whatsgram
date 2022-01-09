import { Timestamp } from '@angular/fire/firestore';

export type ChatForDisplay = {
  id: string;
  displayName: string;
  photoURL: string;
  lastMessage: {
    isRead: boolean;
    createdAt: Timestamp;
    text: string;
  };
  unread?: number;
};
