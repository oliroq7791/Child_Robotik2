import { motion } from 'framer-motion';
import { useProgressStore, getLevelFromXP } from '../../store/progressStore';
import { XP_LEVELS } from '../../data/badges';

export default function XPBar() {
  const { xp } = useProgressStore();
  const level = getLevelFromXP(xp);
  const nextLevel = XP_LEVELS.find(l => l.level === level.level + 1);
  const progress = nextLevel
    ? ((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100
    : 100;

  return (
    <div className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-2 border border-slate-700">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
        style={{ backgroundColor: level.color }}
      >
        {level.level}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-white">{level.name}</span>
          <span className="text-[10px] text-slate-400">{xp} XP{nextLevel ? ` / ${nextLevel.minXP}` : ''}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: level.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {nextLevel && (
        <span className="text-[10px] text-slate-400 flex-shrink-0">→ {nextLevel.name}</span>
      )}
    </div>
  );
}
