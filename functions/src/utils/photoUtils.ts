export const getPhotoUrl = (photoUrl?: string, alt = "") =>
  photoUrl ?? `https://avatars.dicebear.com/api/identicon/${alt}.svg`;
