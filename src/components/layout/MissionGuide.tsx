import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MISSIONS } from '../../data/missions';
import { useProgressStore } from '../../store/progressStore';
import { useAssemblyStore } from '../../store/assemblyStore';

export default function MissionGuide() {
  const { currentMissionId } = useProgressStore();
  const { placed } = useAssemblyStore();
  const [collapsed, setCollapsed] = useState(false);

  const mission = MISSIONS.find(m => m.id === currentMissionId);
  if (!mission) return null;

  // Determine step completion
  const stepsDone = mission.steps.filter(step => {
    if (step.requiresComponent) return placed.some(p => p.componentId === step.requiresComponent);
    return false;
  }).length;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex-shrink-0">
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 transition-colors"
      >
        <span className="text-lg">{mission.emoji}</span>
        <div className="flex-1 text-left">
          <p className="text-xs font-black text-white leading-tight">{mission.title}</p>
          <p className="text-[9px] text-slate-400">{stepsDone}/{mission.steps.length} passos</p>
        </div>
        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden flex-shrink-0">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${(stepsDone / mission.steps.length) * 100}%` }}
          />
        </div>
        <span className="text-slate-400 text-xs">{collapsed ? '▼' : '▲'}</span>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1.5">
              {mission.steps.map((step, i) => {
                const done = step.requiresComponent ? placed.some(p => p.componentId === step.requiresComponent) : false;
                const isCurrent = i === stepsDone;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-2 rounded-lg text-xs transition-all ${
                      done ? 'opacity-60' : isCurrent ? 'bg-blue-500/20 border border-blue-500/40' : 'opacity-50'
                    }`}
                  >
                    <span className="flex-shrink-0 mt-0.5">
                      {done ? '✅' : isCurrent ? '👉' : `${i + 1}.`}
                    </span>
                    <div>
                      <p className={`font-bold ${isCurrent ? 'text-white' : 'text-slate-400'}`}>{step.instruction}</p>
                      {isCurrent && (
                        <p className="text-[10px] text-yellow-400 mt-0.5">💡 {step.hint}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mt-2">
                <p className="text-[10px] text-yellow-300">💡 {mission.tip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
