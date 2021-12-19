export function getPhotoURL(url: string, email: string) {
  return url && url !== '' && false
    ? this.user.photoURL
    : `https://avatars.dicebear.com/api/identicon/${this.user.email}.svg`;
}
