export class GroupCreate {
  constructor(
    public displayName: string,
    public photoURL: string,
    public description: string,
    public members: {
      displayName: string;
      photoURL?: string;
      id: string;
      publicKey: string;
      email: string;
    }[]
  ) {}
}
