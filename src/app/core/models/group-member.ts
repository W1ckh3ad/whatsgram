import { WhatsgramUser } from "./whatsgram.user.model";

export interface GroupMember extends WhatsgramUser {
  isAdmin?: boolean;
}
