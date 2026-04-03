import { motion } from 'framer-motion';
import { useProgressStore, getLevelFromXP } from '../../store/progressStore';
import BadgeGrid from '../gamification/BadgeGrid';
import { MISSIONS } from '../../data/missions';

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { xp, completedMissions, totalCircuits, earnedBadges } = useProgressStore();
  const level = getLevelFromXP(xp);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-black text-white">👤 Meu Perfil</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar & level */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2"
              style={{ backgroundColor: level.color + '22', borderColor: level.color }}
            >
              🤖
            </div>
            <div>
              <p className="text-xl font-black text-white">Inventor(a)</p>
              <p className="font-bold" style={{ color: level.color }}>Nível {level.level} — {level.name}</p>
              <p className="text-sm text-slate-400">{xp} XP acumulados</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Missões', value: completedMissions.length, emoji: '✅', color: '#22c55e' },
              { label: 'Circuitos', value: totalCircuits, emoji: '🔌', color: '#3b82f6' },
              { label: 'Badges', value: earnedBadges.length, emoji: '🏅', color: '#eab308' },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
                <p className="text-2xl">{stat.emoji}</p>
                <p className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Completed missions */}
          {completedMissions.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-2">✅ Missões Completas</h3>
              <div className="space-y-1">
                {completedMissions.map(id => {
                  const mission = MISSIONS.find(m => m.id === id);
                  if (!mission) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800 rounded-lg px-3 py-1.5">
                      <span>{mission.emoji}</span>
                      <span>{mission.title}</span>
                      <span className="ml-auto text-yellow-400">+{mission.xpReward} XP</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Badges */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">🏅 Badges</h3>
            <BadgeGrid />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
