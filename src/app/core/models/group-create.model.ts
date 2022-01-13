export interface GroupCreate {
  displayName: string;
  photoURL: string;
  description: string;
  members: { displayName: string; photoURL: string; id: string }[];
}
