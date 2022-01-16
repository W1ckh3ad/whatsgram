import { Injectable } from '@angular/core';
import { groups, users } from '@constants/collection-names';
import { GroupCreate } from '@models/group-create.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { FirestoreService } from '@services/firestore/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private db: FirestoreService) {}

  async create(
    { photoURL, description, displayName, members }: GroupCreate,
    creator: WhatsgramUser
  ) {
    const promises = [];
    const doc = await this.db.add(groups, {
      photoURL,
      description,
      displayName,
    });
    {
      const { displayName, email, id, publicKey, description, photoURL } =
        creator;
      promises.push(
        this.db.addWithDocumentReference(`${groups}/${doc.id}/${users}/${id}`, {
          displayName,
          email,
          id,
          publicKey,
          description: description ?? null,
          photoURL: photoURL ?? null,
          isAdmin: true,
        })
      );
    }
    for (const { displayName, id, photoURL, publicKey, email,  } of members) {
      promises.push(
        this.db.addWithDocumentReference(`${groups}/${doc.id}/${users}/${id}`, {
          photoURL: photoURL ?? null,
          description: description ?? null,
          displayName,
          id,
          publicKey,
          email,
          isAdmin: false,
        })
      );
    }

    await Promise.all(promises);
  }
}
