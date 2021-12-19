export class UserEdit {
  constructor(
    public displayName: string,
    public phoneNumber?: string,
    public photoURL?: string,
    public description?: string
  ) {}
}
