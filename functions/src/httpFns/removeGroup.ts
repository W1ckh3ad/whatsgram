import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {getGroupDocPath, getGroupMemberDoc} from "../utils/db.utils";

export const removeGroup = functions
    .region("europe-west3")
    .https.onCall(async ({groupId}: { groupId: string }, context) => {
      if (!context.auth?.uid) {
        throw new Error("User isnt authenticated");
      }
      const senderId = context.auth.uid;
      const db = admin.firestore();
      const batch = db.batch();
      const user = (
        await db.doc(getGroupMemberDoc(groupId, senderId)).get()
      ).data();
      if (!user || !user.isAdmin) {
        throw new Error("User isnt authorized");
      }
      const groupDocRef = db.doc(getGroupDocPath(groupId));
      const groupData = (await groupDocRef.get()).data();
      if (!groupData) {
        throw new Error("Group doesnt exists");
      }

      const chatDocRef = await db
          .collectionGroup("chats")
          .where("id", "==", groupId)
          .get();
      for (const chat of chatDocRef.docs) {
        batch.delete(chat.ref);
      }
      await groupDocRef.delete();
      batch.commit();
      return "Hello World";
    });
