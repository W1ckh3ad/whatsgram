importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging.js');

firebase.initializeApp({
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
const mssaging = firebase.messaging();
