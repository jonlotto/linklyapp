import { useState, useEffect, useCallback } from "react";
import OneSignal from "react-onesignal";

const ONESIGNAL_APP_ID = "1b21eaac-881b-439c-b372-4253c00d71c7";

let isInitialized = false;

export function useOneSignal() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize OneSignal
  useEffect(() => {
    const initOneSignal = async () => {
      // Only run on client-side
      if (typeof window === "undefined") return;
      
      // Check if notifications are supported
      const supported = "Notification" in window && "serviceWorker" in navigator;
      setIsSupported(supported);
      
      if (!supported) {
        setIsLoading(false);
        return;
      }

      // Prevent double initialization
      if (isInitialized) {
        setIsLoading(false);
        return;
      }

      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerParam: { scope: "/" },
          serviceWorkerPath: "/OneSignalSDKWorker.js",
        });

        isInitialized = true;

        // Check current permission state
        const currentPermission = Notification.permission;
        setPermission(currentPermission);

        // Check if user is subscribed
        const subscribed = await OneSignal.User.PushSubscription.optedIn;
        setIsSubscribed(subscribed || false);

        // Listen for subscription changes
        OneSignal.User.PushSubscription.addEventListener("change", (event) => {
          setIsSubscribed(event.current.optedIn || false);
        });

      } catch (error) {
        console.error("OneSignal initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initOneSignal();
  }, []);

  // Request notification permission manually
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported || !isInitialized) {
      console.warn("OneSignal not initialized or notifications not supported");
      return "denied";
    }

    try {
      // Request permission through OneSignal
      await OneSignal.Notifications.requestPermission();
      
      // Get the updated permission state
      const newPermission = Notification.permission;
      setPermission(newPermission);

      if (newPermission === "granted") {
        // Opt the user in to push notifications
        await OneSignal.User.PushSubscription.optIn();
        setIsSubscribed(true);
      }

      return newPermission;
    } catch (error) {
      console.error("Error requesting permission:", error);
      return "denied";
    }
  }, [isSupported]);

  // Opt out of notifications
  const unsubscribe = useCallback(async () => {
    if (!isInitialized) return;

    try {
      await OneSignal.User.PushSubscription.optOut();
      setIsSubscribed(false);
    } catch (error) {
      console.error("Error opting out:", error);
    }
  }, []);

  // Toggle subscription
  const toggleNotifications = useCallback(async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await requestPermission();
    }
  }, [isSubscribed, requestPermission, unsubscribe]);

  return {
    permission,
    isSubscribed,
    isSupported,
    isLoading,
    isInitialized,
    requestPermission,
    unsubscribe,
    toggleNotifications,
  };
}
