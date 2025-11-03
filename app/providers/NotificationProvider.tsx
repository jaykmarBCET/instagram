import { supabase } from '@/lib/supabase';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useAuth } from './AuthProvider';


// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const { user } = useAuth();

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        Alert.alert(
          notification.request.content.title || 'Notification',
          notification.request.content.body || 'No message content'
        );
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
    };
  }, []);

  // Save token to Supabase when both user and token are ready
  useEffect(() => {
    if (user && expoPushToken) saveUserPushToken();
  }, [user, expoPushToken]);

  const saveUserPushToken = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ push_token: expoPushToken })
        .eq('id', user.id); // ✅ fixed wrong update syntax

      if (error) console.error('Error saving push token:', error);
    } catch (e) {
      console.error('Unexpected error saving push token:', e);
    }
  };

  return children;
}

function handleRegistrationError(errorMessage: string) {
  Alert.alert('Notification Error', errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.warn('Push notifications require a physical device');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted for push notifications.');
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('EAS project ID not found.');
    return;
  }

  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    console.log('Expo Push Token:', data);
    return data;
  } catch (error) {
    handleRegistrationError(`Push token error: ${error}`);
  }
}
