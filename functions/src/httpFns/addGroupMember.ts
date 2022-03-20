import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {WhatsgramUser} from "../models/whatsgram.user.model";
import {
  getDevicesColPath,
  getGroupDocPath,
  getGroupMemberDoc,
} from "../utils/db.utils";

export const addGroupMember = functions
    .region("europe-west3")
    .https.onCall(
        async (
            {members, groupId}: { members: WhatsgramUser[]; groupId: string },
            context
        ) => {
          if (!context.auth?.uid) {
            throw new Error("User isnt authenticated");
          }
          const senderId = context.auth.uid;
          const db = admin.firestore();
          const fcm = admin.messaging();

          const user = (
            await db.doc(getGroupMemberDoc(groupId, senderId)).get()
          ).data();
          if (!user || !user.isAdmin) {
            throw new Error("User isnt authorized");
          }

          const groupData = (await db.doc(getGroupDocPath(groupId)).get()).data();
          if (!groupData) {
            throw new Error("Group doesnt exists");
          }

          const message: admin.messaging.MessagingPayload = {
            notification: {
              title: `'${groupData.displayName}'`,
              body: "You were added to a new group",
              icon: groupData.photoURL,
            },
            data: {
              type: "notification",
            },
          };
          const ts = admin.firestore.Timestamp.now();
          const batch = db.batch();

          for (const member of members) {
            const doc = db.doc(getGroupMemberDoc(groupId, member.id));
            if ((await doc.get()).exists) {
              continue;
            }
            batch.set(doc, {
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

            const devices = await db.collection(getDevicesColPath(member.id)).get();
            const tokens: string[] = [];

            devices.forEach((result) => {
              const token = result.data().token;
              tokens.push(token);
            });

            fcm.sendToDevice(tokens, message);
          }

          batch.commit();
          return "Hello World";
        }
    );
