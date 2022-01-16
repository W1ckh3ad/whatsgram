import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

// exports.fcmSend = functions.database
//   .ref('/users/{userId}/chats/{chatId}/messages/{messageId}')
//   .onCreate((snapShot, context) => {
//     const mesasge = snapShot.val();
//     const userId = context.params.userId;
//     const chatId = context.params;

//     const payload = {
//       no,
//     };

//     admin.database().
//   });
export * from './create-group';
