import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthStore {
  user: User | null;
  loading: boolean;
  authError: string | null;

  register:   (email: string, password: string, displayName: string) => Promise<void>;
  login:      (email: string, password: string) => Promise<void>;
  logout:     () => Promise<void>;
  clearError: () => void;
  _setUser:    (user: User | null) => void;
  _setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:      null,
  loading:   true,   // true until onAuthStateChanged fires for the first time
  authError: null,

  register: async (email, password, displayName) => {
    set({ authError: null });
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
    } catch (err) {
      set({ authError: (err as Error).message });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ authError: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      set({ authError: (err as Error).message });
      throw err;
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  clearError: () => set({ authError: null }),

  _setUser:    (user)    => set({ user }),
  _setLoading: (loading) => set({ loading }),
}));

// Call once in App.tsx to keep auth state in sync for the session lifetime.
export function initAuthListener() {
  return onAuthStateChanged(auth, (user) => {
    const store = useAuthStore.getState();
    store._setUser(user);
    store._setLoading(false);
  });
}
