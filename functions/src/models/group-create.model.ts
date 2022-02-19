import {WhatsgramUser} from "./whatsgram.user.model";

export class GroupCreate {
  constructor(
    public displayName: string,
    public photoURL: string,
    public description: string,
    public members: WhatsgramUser[]
  ) {}
}
