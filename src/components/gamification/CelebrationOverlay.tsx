import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../store/progressStore';
import { BADGES } from '../../data/badges';

function Confetti() {
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899', '#f97316'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti absolute w-2 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${2 + Math.random() * 1.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function CelebrationOverlay() {
  const { showCelebration, celebrationBadge, dismissCelebration } = useProgressStore();
  const audioCtx = useRef<AudioContext | null>(null);

  const badge = BADGES.find(b => b.id === celebrationBadge);

  useEffect(() => {
    if (!showCelebration) return;

    // Play victory sound via Web Audio API
    try {
      audioCtx.current = new AudioContext();
      const ctx = audioCtx.current;
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.4);
      });
    } catch {
      // Audio not supported, ignore
    }

    const timer = setTimeout(dismissCelebration, 5000);
    return () => clearTimeout(timer);
  }, [showCelebration, dismissCelebration]);

  return (
    <AnimatePresence>
      {showCelebration && (
        <>
          <Confetti />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={dismissCelebration}
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="bg-slate-900 border-2 border-yellow-500 rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl shadow-yellow-500/20"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-6xl mb-4"
              >
                {badge?.emoji ?? '🎉'}
              </motion.div>

              <h2 className="text-2xl font-black text-white mb-2">Parabéns!</h2>
              <p className="text-yellow-400 font-bold text-lg mb-1">{badge?.name ?? 'Missão Completa!'}</p>
              <p className="text-slate-400 text-sm mb-6">{badge?.description ?? 'Você completou um desafio!'}</p>

              <motion.div
                className="flex justify-center gap-2 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {['⭐', '🌟', '✨', '💫', '⭐'].map((star, i) => (
                  <motion.span
                    key={i}
                    className="text-xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    {star}
                  </motion.span>
                ))}
              </motion.div>

              <button
                onClick={dismissCelebration}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-colors text-sm"
              >
                Continuar Aventura! 🚀
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
