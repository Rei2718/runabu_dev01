import { useAuthStore } from '@/stores/authStore';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, isInitialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const cleanup = useAuthStore.getState().initialize();

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const inAuthGroup = segments[0] === '(auth)';
    if (session && inAuthGroup) {
      router.replace('/(app)/(tabs)');
    } else if (!session && !inAuthGroup) {
      router.replace('/(auth)');
    }
  }, [session, isInitialized, segments, router]);

  if (!isInitialized) {
    return null;
  }
  SplashScreen.hideAsync();
  return <Slot />;
}