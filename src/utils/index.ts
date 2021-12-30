import { v4 as uuidv4 } from 'uuid';

export function getPhotoURL({
  email = 't',
  photoURL,
}: {
  email: string;
  photoURL: string;
}) {
  return photoURL && photoURL !== ''
    ? photoURL
    : `https://avatars.dicebear.com/api/identicon/${email}.svg`;
}

export function guid() {
  return uuidv4();
}
