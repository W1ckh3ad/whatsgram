import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DocumentBase } from 'src/models/document-base.model';
import { Chat } from '../models/chat.model';
import { GroupCreate } from '../models/group-create.model';
import { WhatsgramUser } from '../models/whatsgram.user.model';
import {
  getChatDocPath,
  getDevicesColPath,
  getGroupMemberDoc,
  getGroupsColPath,
} from '../utils/db.utils';

admin.initializeApp();

export const createGroup = functions
  .region('europe-west3')
  .https.onCall(
    async (data: { model: GroupCreate; creator: WhatsgramUser }, context) => {
      if (!context.auth?.uid) {
        throw new Error('User isnt authenticated');
      }

      const {
        model: { description, displayName, members, photoURL },
        creator,
      } = data;
      const db = admin.firestore();
      const batch = db.batch();
      const fcm = admin.messaging();
      const groupColRef = db.collection(getGroupsColPath());
      const groupDocRef = await groupColRef.add({
        photoURL,
        description,
        displayName,
      });
      const ts = admin.firestore.Timestamp.now();
      const chatData: Chat & DocumentBase = {
        info: {
          displayName,
          photoURL,
          alt: groupDocRef.id,
        },
        isGroupChat: true,
        updatedAt: ts,
        createdAt: ts,
        id: groupDocRef.id,
      };
      {
        batch.set(db.doc(getGroupMemberDoc(groupDocRef.id, creator.id)), {
          displayName: creator.displayName,
          email: creator.email,
          id: creator.id,
          publicKey: creator.publicKey,
          description: creator.description ?? null,
          photoURL: creator.photoURL ?? null,
          isAdmin: true,
          updatedAt: ts,
          createdAt: ts,
        });

        batch.set(db.doc(getChatDocPath(creator.id, groupDocRef.id)), chatData);
      }

      const message: admin.messaging.MessagingPayload = {
        notification: {
          title: `'${displayName}'`,
          body: 'You were added to a new group',
          icon: photoURL,
        },
        data: {
          type: 'notification',
        },
      };
      for (const member of members) {
        batch.set(db.doc(getGroupMemberDoc(groupDocRef.id, member.id)), {
          photoURL: member.photoURL ?? null,
          description: member.description ?? null,
          displayName: member.displayName,
          id: member.id,
          publicKey: member.publicKey,
          email: member.email,
          isAdmin: false,
          updatedAt: ts,
          createdAt: ts,
        });
        batch.set(db.doc(getChatDocPath(member.id, groupDocRef.id)), chatData);

        const devices = await db.collection(getDevicesColPath(member.id)).get();
        const tokens: string[] = [];

        devices.forEach((result) => {
          const token = result.data().token;
          tokens.push(token);
        });

        fcm.sendToDevice(tokens, message);
      }

      batch.commit();

      return 'Hello World';
    }
  );
