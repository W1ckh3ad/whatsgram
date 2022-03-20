import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const userDataTransaction = functions.firestore
    .document("users/{userId}")
    .onWrite(async (change, context) => {
      const userId = context.params.userId;
      const newData = change.after.data();
      const oldData = change.after.data();
      if (!newData || !oldData) return;

      const importantKeys = [
        "displayName",
        "phoneNumber",
        "photoURL",
        "description",
      ];
      const chatKeys = ["displayName", "phoneNumber", "photoURL"];
      const changes: { [s: string]: [string, string] } = {};

      for (const key of importantKeys) {
        if (newData[key] == oldData[key]) continue;
        changes[key] = newData[key] ?? null;
      }

      const db = admin.firestore();
      const batch = db.batch();
      await Promise.all(
          [
            async () => {
              if (!chatKeys.some((x) => !!changes[x])) return;
              const chatDocsSnap = await db
                  .collectionGroup("members")
                  .where("id", "==", userId)
                  .get();
              const {phoneNumber, ...update} = changes;
              for (const doc of chatDocsSnap.docs) {
                batch.set(doc.ref, update, {merge: true});
              }
            },
            async () => {
              if (Object.keys(changes).length === 0) return;
              const querySnaps = await Promise.all([
                db.collectionGroup("members").where("id", "==", userId).get(),
                db.collectionGroup("contacts").where("id", "==", userId).get(),
              ]);
              for (const querySnap of querySnaps) {
                for (const doc of querySnap.docs) {
                  batch.set(doc.ref, changes, {merge: true});
                }
              }
            },
          ].map((x) => x())
      );

      batch.commit();
    });
export {};
