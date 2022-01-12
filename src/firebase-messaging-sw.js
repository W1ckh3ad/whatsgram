// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// // const firebaseApp = initializeApp({
// //   apiKey: 'AIzaSyCxpcqNhankArn3k-QkrEEA1dtjv6Fg2KI',
// //   authDomain: 'whatsgram-105c9.firebaseapp.com',
// //   databaseURL:
// //     'https://whatsgram-105c9-default-rtdb.europe-west1.firebasedatabase.app',
// //   projectId: 'whatsgram-105c9',
// //   storageBucket: 'whatsgram-105c9.appspot.com',
// //   messagingSenderId: '1007817643967',
// //   appId: '1:1007817643967:web:ecbf91ad4657937e0fb30a',
// //   measurementId: '${config.measurementId}',
// // });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.


import { onBackgroundMessage } from 'firebase/messaging/sw';
import { initializeApp } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging/sw';
console.log("SWSW")
const app = initializeApp({
  apiKey: 'AIzaSyCxpcqNhankArn3k-QkrEEA1dtjv6Fg2KI',
  authDomain: 'whatsgram-105c9.firebaseapp.com',
  databaseURL:
    'https://whatsgram-105c9-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'whatsgram-105c9',
  storageBucket: 'whatsgram-105c9.appspot.com',
  messagingSenderId: '1007817643967',
  appId: '1:1007817643967:web:ecbf91ad4657937e0fb30a',
  measurementId: '${config.measurementId}',
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

isSupported()
  .then(() => {
    const messaging = getMessaging(app);
    console.log("registered", messaging);
    onBackgroundMessage(messaging, ({ notification }) => {
      const { title, body, image } = notification ?? {};

      if (!title) {
        return;
      }

      self.registration.showNotification(title, {
        body,
        icon: image,
      });
    });
  })
  .catch(/* error */);

// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging/sw";

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// const firebaseApp = initializeApp({
//   apiKey: 'AIzaSyCxpcqNhankArn3k-QkrEEA1dtjv6Fg2KI',
//   authDomain: 'whatsgram-105c9.firebaseapp.com',
//   databaseURL:
//     'https://whatsgram-105c9-default-rtdb.europe-west1.firebasedatabase.app',
//   projectId: 'whatsgram-105c9',
//   storageBucket: 'whatsgram-105c9.appspot.com',
//   messagingSenderId: '1007817643967',
//   appId: '1:1007817643967:web:ecbf91ad4657937e0fb30a',
//   measurementId: '${config.measurementId}',
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = getMessaging(firebaseApp);
// import { getMessaging } from "firebase/messaging";
// import { onBackgroundMessage } from "firebase/messaging/sw";

// const messaging = getMessaging();
// onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
