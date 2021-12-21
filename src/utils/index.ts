export function getPhotoURL(url: string, email: string) {
  return url && url !== ''
    ? url
    : `https://avatars.dicebear.com/api/identicon/${this.user.email}.svg`;
}
