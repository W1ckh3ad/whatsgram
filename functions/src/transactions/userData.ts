// import * as admin from 'firebase-admin';
// import * as functions from 'firebase-functions';
// import { Chat } from 'src/models/chat.model';

// export const userDataTransaction = functions.firestore
//   .document('users/{userId}')
//   .onWrite(async (change, context) => {
//     const userId = context.params.userId;
//     const newData = change.after.data();
//     const oldData = change.after.data();
//     if (!newData || !oldData) return;

//     const filterKeys = ['updatedAt', 'createdAt', 'id'];
//     const newKeys = Object.keys(newData);
//     const oldKeys = Object.keys(oldData);
//     const differentProperties: string[] = [];
//     const changes: { [s: string]: [string, string] } = {};

//     const userKeys = ["email","displayName", "photoURL", "phone"]
//     const chatInfoKeys = ["email","displayName", "photoURL"]
//     newKeys.forEach((x) =>
//       !oldKeys.includes(x) ? differentProperties.push(x) : null
//     );
//     oldKeys.forEach((x) =>
//       !newKeys.includes(x) && !differentProperties.includes(x)
//         ? differentProperties.push(x)
//         : null
//     );

//     for (const key of newKeys) {
//       if (
//         differentProperties.includes(key) ||
//         newData[key] == oldData[key] ||
//         filterKeys.includes(key)
//       )
//         continue;
//       changes[key] = [oldData[key] + '', newData[key] + ''];
//     }

//     for (const key of differentProperties) {
//       if (filterKeys.includes(key)) continue;
//       changes[key] = [oldData[key] + '', newData[key] + ''];
//     }

//     const db = admin.firestore();
//     const batch = db.batch();
//     const [chatDocSnap, memberDocSnap, contactsDocSnap] = await Promise.all([
//       db.collectionGroup('chats').where('id', '==', userId).get(),
//       db.collectionGroup('members').where('id', '==', userId).get(),
//       db.collectionGroup('contacts').where('id', '==', userId).get(),
//     ]);
//     const chatDocInfo: any = { info: {} };
//     if (newData.email) chatDocInfo.info.email = newData.info;
//     chatDocSnap.forEach((x) => {
//       db.doc(x.ref.path).set({ info: {} }, { merge: true });
//     });

//     batch.commit();
//   });
export {};
