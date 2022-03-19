import { Timestamp } from '@angular/fire/firestore';

export interface DocumentBase {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
