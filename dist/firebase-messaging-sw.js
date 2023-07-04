// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyC1qeR6RSfTxCp7-fsqX2KGieYU51pFHRY",
  authDomain: "web-oc.firebaseapp.com",
  projectId: "web-oc",
  storageBucket: "web-oc.appspot.com",
  messagingSenderId: "1086172118075",
  appId: "1:1086172118075:web:5ff0128719ff05fa05301e",
  measurementId: "G-HJ021FV7GF"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification?.title || payload.data.title;
  const notificationOptions = {
    body: payload.notification?.body || payload.data.message,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});