import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const groupDataTransaction = functions.firestore
    .document("groups/{groupId}")
    .onWrite(async (change, context) => {
      const groupId = context.params.groupId;
      const newData = change.after.data();
      const oldData = change.after.data();
      if (!newData || !oldData) return;

      const importantKeys = ["description", "displayName", "photoURL"];
      const changes: any = {};

      for (const key of importantKeys) {
        if (newData[key] == oldData[key]) continue;
        changes[key] = newData[key] ?? null;
      }

      const db = admin.firestore();
      const batch = db.batch();
      const querySnap = await db
          .collectionGroup("chats")
          .where("id", "==", groupId)
          .get();
      for (const doc of querySnap.docs) {
        batch.set(doc.ref, changes, {merge: true});
      }

      batch.commit();
    });
export {};
