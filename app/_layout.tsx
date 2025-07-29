import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false }}>
        {session && session.user ? <Stack.Screen name="(app)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  )
}