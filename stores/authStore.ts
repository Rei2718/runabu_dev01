import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { AppState, AppStateStatus } from 'react-native';
import { create } from 'zustand';

type AuthState = {
  session: Session | null;
  isInitialized: boolean;
  loading: boolean;
  initialize: () => () => void;
  signOut: () => Promise<void>;
  signInWithEmail: (credentials: { email: string; password: string }) => Promise<any>;
  signUpWithEmail: (credentials: { email: string; password: string }) => Promise<any>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isInitialized: false,
  loading: false,

  signInWithEmail: async ({ email, password }) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return { error };
  },

  signUpWithEmail: async ({ email, password }) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return { data, error };
  },

  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ loading: false });
  },

  initialize: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, isInitialized: true });
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ session });
      }
    );

    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      authListener.subscription.unsubscribe();
      appStateSubscription.remove();
    };
  },
}));

// Note: The initialization logic is called once from the RootLayout component.