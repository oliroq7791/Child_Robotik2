import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useProgressStore, getLevelFromXP } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';
import { MISSIONS, WORLDS } from '../../data/missions';
import BadgeGrid from '../gamification/BadgeGrid';
import MissionTrail from '../gamification/MissionTrail';
import ProfileModal from '../ui/ProfileModal';
import TemplatesModal from '../ui/TemplatesModal';
import AuthModal from '../ui/AuthModal';

export default function Header() {
  const { xp, currentMissionId, completedMissions } = useProgressStore();
  const { user, logout } = useAuthStore();
  const level = getLevelFromXP(xp);

  const [showMissions,  setShowMissions]  = useState(false);
  const [showProfile,   setShowProfile]   = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAuth,      setShowAuth]      = useState(false);

  const currentMission = MISSIONS.find(m => m.id === currentMissionId);
  const currentWorld   = currentMission ? WORLDS.find(w => w.id === currentMission.world) : null;

  // Avatar initials from displayName
  const initials = user?.displayName
    ? user.displayName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0].toUpperCase() ?? '?';

  return (
    <>
      <header className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-700 flex-shrink-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xl">🤖</span>
          <div className="hidden sm:block">
            <p className="text-sm font-black text-white leading-tight">RoboKids</p>
            <p className="text-[9px] text-blue-400 font-bold leading-tight">Academy</p>
          </div>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-700" />

        {/* Current mission */}
        <button
          onClick={() => setShowMissions(true)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl px-2 py-1.5 transition-colors flex-shrink-0 min-w-0"
        >
          <span className="text-sm">{currentWorld?.emoji ?? '🗺️'}</span>
          <div className="text-left hidden sm:block min-w-0">
            <p className="text-[9px] text-slate-400 font-bold">MISSÃO ATUAL</p>
            <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">{currentMission?.title ?? 'Escolher Missão'}</p>
          </div>
          <span className="text-slate-500 text-xs">▼</span>
        </button>

        {/* Progress pills - desktop only */}
        <div className="hidden lg:flex items-center gap-2">
          {WORLDS.map(world => {
            const worldMissions = MISSIONS.filter(m => m.world === world.id);
            const done = worldMissions.filter(m => completedMissions.includes(m.id)).length;
            const isActive = currentMission?.world === world.id;
            return (
              <div
                key={world.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  isActive ? 'text-white' : 'text-slate-500 bg-slate-800'
                }`}
                style={isActive ? { backgroundColor: world.color + '33', color: world.color } : {}}
              >
                <span>{world.emoji}</span>
                <span>{done}/{worldMissions.length}</span>
              </div>
            );
          })}
        </div>

        {/* Templates button */}
        <button
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-1 bg-purple-700/40 hover:bg-purple-700/60 border border-purple-600/50 text-purple-300 rounded-xl px-2 py-1.5 text-xs font-bold transition-colors flex-shrink-0"
        >
          🗂️ <span className="hidden sm:inline">Exemplos</span>
        </button>

        <div className="flex-1" />

        {/* Badges compact - desktop only */}
        <div className="hidden lg:block">
          <BadgeGrid compact />
        </div>

        {/* XP Level */}
        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 flex-shrink-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
            style={{ backgroundColor: level.color }}
          >
            {level.level}
          </div>
          <div className="hidden sm:block">
            <p className="text-[9px] text-slate-400">{level.name}</p>
            <p className="text-xs font-black text-white">{xp} XP</p>
          </div>
        </div>

        {/* Auth area */}
        {user ? (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-2 py-1.5 transition-colors"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                style={{ backgroundColor: level.color }}
              >
                {initials}
              </div>
              <span className="text-xs font-bold text-white hidden md:block max-w-[80px] truncate">
                {user.displayName ?? user.email}
              </span>
            </button>
            <button
              onClick={() => void logout()}
              title="Sair da conta"
              className="w-8 h-8 bg-slate-800 hover:bg-red-900/40 border border-slate-700 hover:border-red-700/50 rounded-xl flex items-center justify-center text-sm text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
            >
              ↩
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-2.5 py-1.5 text-xs font-black transition-colors shadow-lg shadow-blue-500/20 flex-shrink-0"
          >
            🔑 <span className="hidden sm:inline">Entrar</span>
          </button>
        )}
      </header>

      <AnimatePresence>
        {showMissions  && <MissionTrail  onClose={() => setShowMissions(false)}  />}
        {showProfile   && <ProfileModal  onClose={() => setShowProfile(false)}   />}
        {showTemplates && <TemplatesModal onClose={() => setShowTemplates(false)} />}
        {showAuth      && <AuthModal     onClose={() => setShowAuth(false)}      />}
      </AnimatePresence>
    </>
  );
}
