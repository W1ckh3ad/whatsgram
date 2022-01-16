

// import { onBackgroundMessage } from 'firebase/messaging/sw'
// import { initializeApp, FirebaseOptions } from 'firebase/app'
// import { getMessaging, isSupported } from 'firebase/messaging/sw'

// const app = initializeApp({
//   apiKey: "AIzaSyCxpcqNhankArn3k-QkrEEA1dtjv6Fg2KI",
//   authDomain: "whatsgram-105c9.firebaseapp.com",
//   databaseURL: "https://whatsgram-105c9-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "whatsgram-105c9",
//   storageBucket: "whatsgram-105c9.appspot.com",
//   messagingSenderId: "1007817643967",
//   appId: "1:1007817643967:web:ecbf91ad4657937e0fb30a",
//   measurementId: "G-TM8T1EDKB7"
// })

// self.addEventListener('activate', (event) => {
//   event.waitUntil(self.clients.claim())
// })

// isSupported()
//   .then(() => {
//     const messaging = getMessaging(app)

//     onBackgroundMessage(messaging, ({ notification }) => {
//       const { title, body, image } = notification ?? {}

//       if (!title) {
//         return
//       }

//       self.registration.showNotification(title, {
//         body,
//         icon: image
//       })
//     })
//   })
//   .catch(e => console.error("service worker onBackground failed", e))

// importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyCxpcqNhankArn3k-QkrEEA1dtjv6Fg2KI",
  authDomain: "whatsgram-105c9.firebaseapp.com",
  databaseURL: "https://whatsgram-105c9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "whatsgram-105c9",
  storageBucket: "whatsgram-105c9.appspot.com",
  messagingSenderId: "1007817643967",
  appId: "1:1007817643967:web:ecbf91ad4657937e0fb30a",
  measurementId: "G-TM8T1EDKB7"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
// const isSupported = firebase.messaging.isSupported();
// if (isSupported) {
//   const messaging = firebase.messaging();
//   messaging.onBackgroundMessage(({ notification: { title, body, image } }) => {
//     self.registration.showNotification(title, { body, icon: image || '/assets/icons/icon-72x72.png' });
//   });
// }

// messaging.onBackgroundMessage((payload) => {
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

// // self.addEventListener('activate', (event) => {
// //   event.waitUntil(self.clients.claim());
// // });

// // isSupported()
// //   .then(() => {
// //     const messaging = getMessaging(app);
// //     console.log("registered", messaging);
// //     onBackgroundMessage(messaging, ({ notification }) => {
// //       const { title, body, image } = notification ?? {};

// //       if (!title) {
// //         return;
// //       }

// //       self.registration.showNotification(title, {
// //         body,
// //         icon: image,
// //       });
// //     });
// //   })
// //   .catch(/* error */);

// // import { initializeApp } from "firebase/app";
// // import { getMessaging } from "firebase/messaging/sw";

// // // Initialize the Firebase app in the service worker by passing in
// // // your app's Firebase config object.
// // // https://firebase.google.com/docs/web/setup#config-object
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

// // // Retrieve an instance of Firebase Messaging so that it can handle background
// // // messages.
// // const messaging = getMessaging(firebaseApp);
// // import { getMessaging } from "firebase/messaging";
// // import { onBackgroundMessage } from "firebase/messaging/sw";

// // const messaging = getMessaging();
// // onBackgroundMessage(messaging, (payload) => {
// //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
// //   // Customize notification here
// //   const notificationTitle = 'Background Message Title';
// //   const notificationOptions = {
// //     body: 'Background Message body.',
// //     icon: '/firebase-logo.png'
// //   };

// //   self.registration.showNotification(notificationTitle,
// //     notificationOptions);
// // });
