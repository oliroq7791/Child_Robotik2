import { AnimatePresence } from 'framer-motion';
import { useProgressStore } from './store/progressStore';
import Header from './components/layout/Header';
import SplitLayout from './components/layout/SplitLayout';
import OnboardingTutorial from './components/ui/OnboardingTutorial';
import CelebrationOverlay from './components/gamification/CelebrationOverlay';
import './index.css';

export default function App() {
  const { showOnboarding } = useProgressStore();

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
