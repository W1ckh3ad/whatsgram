import { Injectable } from '@angular/core';
import { groups, users } from '@constants/collection-names';
import { DocumentBase } from '@models/document-base.model';
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
    creator: WhatsgramUser & DocumentBase
  ) {
    const promises = [];
    const doc = await this.db.add(groups, {
      photoURL,
      description,
      displayName,
    });
    promises.push(
      this.db.addWithDocumentReference(
        `${groups}/${doc.id}/${users}/${creator.id}`,
        {
          photoURL,
          description,
          displayName,
          id: creator.id,
          isAdmin: false,
        }
      )
    );
    for (const { displayName, id, photoURL } of members) {
      promises.push(
        this.db.addWithDocumentReference(`${groups}/${doc.id}/${users}/${id}`, {
          photoURL,
          description,
          displayName,
          id,
          isAdmin: false,
        })
      );
    }

    await Promise.all(promises);
  }
}
