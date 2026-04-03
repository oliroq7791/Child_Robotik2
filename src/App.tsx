import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useProgressStore } from './store/progressStore';
import { useAuthStore, initAuthListener } from './store/authStore';
import Header from './components/layout/Header';
import SplitLayout from './components/layout/SplitLayout';
import OnboardingTutorial from './components/ui/OnboardingTutorial';
import CelebrationOverlay from './components/gamification/CelebrationOverlay';
import './index.css';

export default function App() {
  const { showOnboarding, loadFromFirestore } = useProgressStore();
  const { user, loading } = useAuthStore();

  // Start Firebase Auth listener once on mount
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return unsubscribe;
  }, []);

  // When user logs in, load their progress from Firestore
  useEffect(() => {
    if (user) {
      void loadFromFirestore(user.uid);
    }
  }, [user, loadFromFirestore]);

  // Show spinner while Firebase resolves the initial auth state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-4xl animate-bounce">🤖</p>
          <p className="text-slate-500 text-sm mt-3 font-bold">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-white">
      <Header />
      <SplitLayout />

      <AnimatePresence>
        {showOnboarding && <OnboardingTutorial />}
      </AnimatePresence>

      <CelebrationOverlay />
    </div>
  );
}
