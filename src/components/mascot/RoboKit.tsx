import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulatorStore } from '../../store/simulatorStore';

const FACES = {
  happy: { eyes: '◕◕', mouth: '⌣', color: '#2563EB' },
  excited: { eyes: '★★', mouth: '⌣', color: '#16A34A' },
  surprised: { eyes: 'OO', mouth: '○', color: '#CA8A04' },
  thinking: { eyes: '•—•', mouth: '—', color: '#7C3AED' },
  sad: { eyes: '╥╥', mouth: '⌢', color: '#DC2626' },
};

const TIPS = [
  'Você está indo muito bem! Continue assim! 🌟',
  'Boa montagem! Que tal tentar a próxima missão?',
  'Lembre-se: sempre use resistores com os LEDs!',
  'Dica: verifique a polaridade dos componentes!',
  'Você é incrível! A robótica precisa de mentes como a sua!',
  'Experimente conectar mais componentes!',
  'Sabia que os melhores engenheiros também cometeram erros?',
  'Continue explorando! Cada erro é um aprendizado!',
];

export default function RoboKit() {
  const { mascotEmotion, mascotAnimation } = useSimulatorStore();
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [autoTip, setAutoTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoTip(i => (i + 1) % TIPS.length);
      setSpeechBubble(TIPS[autoTip]);
      setTimeout(() => setSpeechBubble(null), 4000);
    }, 12000);
    return () => clearInterval(interval);
  }, [autoTip]);

  const face = FACES[mascotEmotion];

  const bounceAnim = mascotAnimation === 'bounce'
    ? { y: [0, -15, 0, -10, 0], transition: { duration: 0.6, times: [0, 0.2, 0.5, 0.7, 1] } }
    : mascotAnimation === 'shake'
    ? { x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.5 } }
    : {};

  return (
    <div className="relative flex flex-col items-center select-none">
      <AnimatePresence>
        {speechBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full mb-2 bg-white rounded-2xl px-3 py-2 text-xs font-bold text-gray-800 shadow-lg border-2 border-blue-200 max-w-[160px] text-center z-10"
          >
            {speechBubble}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={bounceAnim}
        whileHover={{ scale: 1.1 }}
        onClick={() => {
          setSpeechBubble(TIPS[Math.floor(Math.random() * TIPS.length)]);
          setTimeout(() => setSpeechBubble(null), 4000);
        }}
        className="cursor-pointer"
      >
        {/* Robot body */}
        <svg width="72" height="88" viewBox="0 0 72 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Antenna */}
          <line x1="36" y1="0" x2="36" y2="12" stroke={face.color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="36" cy="0" r="4" fill={face.color} />

          {/* Head */}
          <rect x="12" y="12" width="48" height="36" rx="8" fill={face.color} />

          {/* Face screen */}
          <rect x="16" y="16" width="40" height="28" rx="5" fill="#0f172a" />

          {/* Eyes */}
          <text x="36" y="34" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">
            {face.eyes}
          </text>

          {/* Mouth */}
          <text x="36" y="42" textAnchor="middle" fill={mascotEmotion === 'sad' ? '#EF4444' : '#22C55E'} fontSize="10" fontFamily="monospace">
            {face.mouth}
          </text>

          {/* Ear bolts */}
          <circle cx="12" cy="30" r="5" fill="#1e3a8a" />
          <circle cx="60" cy="30" r="5" fill="#1e3a8a" />

          {/* Body */}
          <rect x="16" y="52" width="40" height="28" rx="6" fill={face.color} opacity="0.9" />

          {/* Chest panel */}
          <rect x="22" y="57" width="28" height="16" rx="4" fill="#0f172a" />
          <circle cx="28" cy="65" r="3" fill={mascotEmotion === 'happy' || mascotEmotion === 'excited' ? '#22C55E' : '#EF4444'} />
          <circle cx="36" cy="65" r="3" fill="#CA8A04" />
          <circle cx="44" cy="65" r="3" fill="#2563EB" />

          {/* Arms */}
          <rect x="2" y="54" width="12" height="22" rx="6" fill={face.color} opacity="0.8" />
          <rect x="58" y="54" width="12" height="22" rx="6" fill={face.color} opacity="0.8" />

          {/* Legs */}
          <rect x="20" y="80" width="12" height="8" rx="4" fill={face.color} opacity="0.7" />
          <rect x="40" y="80" width="12" height="8" rx="4" fill={face.color} opacity="0.7" />
        </svg>
      </motion.div>

      <p className="text-xs text-slate-400 mt-1 font-bold">RoboKit</p>
    </div>
  );
}
