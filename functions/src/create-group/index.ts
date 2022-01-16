import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GroupCreate } from '@shared/models/group-create.model';
import { WhatsgramUser } from '@shared/models/whatsgram.user.model';
import { Chat } from '@shared/models/chat.model';
import {
  getGroupsColPath,
  getGroupMemberDoc,
  getChatDocPath,
} from '@shared/utils/db.utils';

export const createGroup = functions.https.onCall(
  async (data: { model: GroupCreate; creator: WhatsgramUser }, context) => {
    if (!context.auth?.uid) {
      throw new Error('User isnt authenticated');
    }

    const {
      model: { description, displayName, members, photoURL },
      creator,
    } = data;
    const db = admin.firestore();
    const promises = [];
    const groupColRef = db.collection(getGroupsColPath());
    const groupDocRef = await groupColRef.add({
      photoURL,
      description,
      displayName,
    });

    {
      promises.push(
        db.doc(getGroupMemberDoc(groupDocRef.id, creator.id)).set({
          displayName: creator.displayName,
          email: creator.email,
          id: creator.id,
          publicKey: creator.publicKey,
          description: creator.description ?? null,
          photoURL: creator.photoURL ?? null,
          isAdmin: true,
        })
      );
    }
    for (const member of members) {
      promises.push(
        db.doc(getGroupMemberDoc(groupDocRef.id, member.id)).set({
          photoURL: member.photoURL ?? null,
          description: member.description ?? null,
          displayName: member.displayName,
          id: member.id,
          publicKey: member.publicKey,
          email: member.email,
          isAdmin: false,
        })
      );
      const data: Chat = {
        info: {
          displayName,
          photoURL,
        },
        isGroupChat: true,
      };
      promises.push(
        db.doc(getChatDocPath(groupDocRef.id, groupDocRef.id)).set(data)
      );
    }

    await Promise.all(promises);

    return 'Hello World';
  }
);
