import { useState } from 'react';
import { motion } from 'framer-motion';
import { MISSIONS, WORLDS } from '../../data/missions';
import { useProgressStore } from '../../store/progressStore';
import { useAssemblyStore } from '../../store/assemblyStore';

export default function MissionTrail({ onClose }: { onClose: () => void }) {
  const { completedMissions, currentMissionId, setCurrentMission } = useProgressStore();
  const { clearAll } = useAssemblyStore();
  const [activeWorld, setActiveWorld] = useState(1);

  const worldMissions = MISSIONS.filter(m => m.world === activeWorld);

  const selectMission = (missionId: string) => {
    setCurrentMission(missionId);
    clearAll();
    onClose();
  };

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
        className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-black text-white">🗺️ Trilha de Missões</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">×</button>
        </div>

        {/* World tabs */}
        <div className="flex gap-2 p-4 border-b border-slate-700 overflow-x-auto">
          {WORLDS.map(world => {
            const worldMissionsAll = MISSIONS.filter(m => m.world === world.id);
            const completed = worldMissionsAll.filter(m => completedMissions.includes(m.id)).length;
            return (
              <button
                key={world.id}
                onClick={() => setActiveWorld(world.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  activeWorld === world.id ? 'text-white shadow-lg' : 'text-slate-400 bg-slate-800 hover:bg-slate-700'
                }`}
                style={activeWorld === world.id ? { backgroundColor: world.color } : {}}
              >
                <span>{world.emoji}</span>
                <span>{world.name}</span>
                <span className="text-[10px] opacity-70">{completed}/{worldMissionsAll.length}</span>
              </button>
            );
          })}
        </div>

        {/* Missions */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 gap-3">
          {worldMissions.map((mission, i) => {
            const isDone = completedMissions.includes(mission.id);
            const isCurrent = currentMissionId === mission.id;
            const isLocked = i > 0 && !completedMissions.includes(worldMissions[i - 1].id) && !isDone;

            return (
              <motion.button
                key={mission.id}
                whileHover={!isLocked ? { scale: 1.02 } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
                onClick={() => !isLocked && selectMission(mission.id)}
                disabled={isLocked}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  isDone
                    ? 'border-green-500/50 bg-green-500/10'
                    : isCurrent
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : isLocked
                    ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {isDone ? '✅' : isLocked ? '🔒' : mission.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{mission.title}</span>
                      {isCurrent && !isDone && (
                        <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-bold">ATUAL</span>
                      )}
                      {isDone && (
                        <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">COMPLETA</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{mission.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-yellow-400">⭐ {mission.xpReward} XP</span>
                      <span className="text-[10px] text-slate-500">👦 {mission.ageRange}</span>
                      <span className={`text-[10px] font-bold ${
                        mission.difficulty === 'beginner' ? 'text-green-400' :
                        mission.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {mission.difficulty === 'beginner' ? '⭐ Iniciante' : mission.difficulty === 'intermediate' ? '⭐⭐ Médio' : '⭐⭐⭐ Avançado'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
