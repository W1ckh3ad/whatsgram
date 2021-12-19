export class Account {
  constructor(
    public uid: string,
    public displayName: string,
    public phoneNumber?: string,
    public photoURL?: string,
    public description?: string,
    public contacts?: string[]
  ) {}
}
