import { Timestamp } from '@google-cloud/firestore';
export interface DocumentBase {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
