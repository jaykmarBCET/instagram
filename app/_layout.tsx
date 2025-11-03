import { Stack } from 'expo-router';
import '../global.css';
import AuthProvider from '@/app/providers/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}