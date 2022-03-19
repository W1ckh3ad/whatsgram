/**
 * Class for editing user
 */
export class UserEdit {
  /**
   * Create a UserEditModel
   * @param displayName
   * @param phoneNumber
   * @param photoURL
   * @param description
   */
  constructor(
    public displayName: string,
    public phoneNumber?: string,
    public photoURL?: string,
    public description?: string
  ) {}
}
