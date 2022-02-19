import {Timestamp} from "./timestamp.model";

export interface DocumentBase {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
