import { Message } from "./message.model";

export interface Chat {
  name?: string;
  description?: string;
  messages?: Message[];
}
