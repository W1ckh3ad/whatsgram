import {WhatsgramUser} from "./whatsgram.user.model";

/**
 * Model to create a class
 */
export class GroupCreate {
  /**
   * Create a GroupCreate model
   * @param displayName
   * @param photoURL
   * @param description
   * @param members
   */
  constructor(
    public displayName: string,
    public photoURL: string,
    public description: string,
    public members: WhatsgramUser[]
  ) {}
}
