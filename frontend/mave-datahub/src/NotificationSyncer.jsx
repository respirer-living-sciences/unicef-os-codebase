import React, { useEffect } from "react";
import { requestForToken, onMessageListener } from "./firebase";

const NotificationSyncer = ({ email, password }) => {
  useEffect(() => {
    let isMounted = true;

    // --- 1. Token Sync Logic ---
    const syncTokenWithBackend = async () => {
      try {
        const fcmToken = await requestForToken();

        if (!fcmToken) {
          return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("fcm_token", fcmToken);
        formData.append("device_type", "browser");

        const response = await fetch(
          "https://api.yourdomain.com/adp/v4/sync-login-token",
          {
            method: "POST",
            // DO NOT set 'Content-Type': 'multipart/form-data'.
            // The browser sets it automatically with the correct boundary when passing FormData.
            body: formData,
          },
        );

        const data = await response.json();

        if (response.ok && isMounted) {
        } else if (isMounted) {
        }
      } catch (error) {
        isMounted;
      }
    };

    // --- 2. Message Listener Logic ---
    const listenForMessages = async () => {
      try {
        const payload = await onMessageListener();
        if (isMounted) {
          // Display the notification to the user
          alert(`Air Quality Alert: ${payload.notification.body}`);
        }

        // Loop to wait for the next message
        if (isMounted) listenForMessages();
      } catch (err) {
        isMounted;
      }
    };

    // --- 3. Execute both if credentials are provided ---
    if (email && password) {
      syncTokenWithBackend();
      listenForMessages();
    }

    return () => {
      isMounted = false;
    };
  }, []); // Run exactly once on mount

  // This is a "headless" component. It renders nothing to the DOM.
  return null;
};

export default NotificationSyncer;
