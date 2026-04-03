import { motion } from 'framer-motion';
import { BADGES } from '../../data/badges';
import { useProgressStore } from '../../store/progressStore';

export default function BadgeGrid({ compact = false }: { compact?: boolean }) {
  const { earnedBadges } = useProgressStore();

  if (compact) {
    const earned = BADGES.filter(b => earnedBadges.includes(b.id));
    return (
      <div className="flex gap-1 flex-wrap">
        {earned.slice(0, 5).map(b => (
          <span key={b.id} title={b.name} className="text-lg cursor-help">{b.emoji}</span>
        ))}
        {earned.length > 5 && <span className="text-xs text-slate-400 self-center">+{earned.length - 5}</span>}
        {earned.length === 0 && <span className="text-xs text-slate-500">Nenhuma badge ainda!</span>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-3">
      {BADGES.map((badge, i) => {
        const earned = earnedBadges.includes(badge.id);
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            title={`${badge.name}: ${badge.description}`}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all cursor-help ${
              earned
                ? 'border-yellow-500/50 bg-yellow-500/10'
                : 'border-slate-700 bg-slate-800/50 opacity-40 grayscale'
            }`}
          >
            <span className="text-2xl">{badge.emoji}</span>
            <p className="text-[8px] font-bold text-center text-white leading-tight">{badge.name}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
