// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Helper function to request permission and get the token
export const requestForToken = async () => {
  try {
    // Manually register the service worker to handle the sub-path deployment
    const registration = await navigator.serviceWorker.register(
      "/mave-datahub/firebase-messaging-sw.js",
      {
        scope: "/mave-datahub/",
      },
    );

    const currentToken = await getToken(messaging, {
      vapidKey: "",
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      return currentToken;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

// Helper for listening to foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
