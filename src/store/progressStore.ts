import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BADGES, getLevelFromXP } from '../data/badges';

export interface SavedProject {
  id: string;
  name: string;
  savedAt: number;
  placed: unknown[];
  wires: unknown[];
}

interface ProgressStore {
  xp: number;
  completedMissions: string[];
  earnedBadges: string[];
  savedProjects: SavedProject[];
  streakDays: number;
  lastVisit: string | null;
  totalCircuits: number;
  showOnboarding: boolean;
  currentMissionId: string | null;
  showCelebration: boolean;
  celebrationBadge: string | null;

  addXP: (amount: number) => void;
  completeMission: (missionId: string) => void;
  checkAndAwardBadge: (condition: string) => void;
  saveProject: (project: Omit<SavedProject, 'id' | 'savedAt'>) => void;
  deleteProject: (id: string) => void;
  setCurrentMission: (missionId: string | null) => void;
  finishOnboarding: () => void;
  dismissCelebration: () => void;
  incrementCircuits: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      completedMissions: [],
      earnedBadges: [],
      savedProjects: [],
      streakDays: 0,
      lastVisit: null,
      totalCircuits: 0,
      showOnboarding: true,
      currentMissionId: 'mission-1',
      showCelebration: false,
      celebrationBadge: null,

      addXP: (amount) => {
        set(s => ({ xp: s.xp + amount }));
      },

      completeMission: (missionId) => {
        const { completedMissions } = get();
        if (completedMissions.includes(missionId)) return;

        set(s => ({ completedMissions: [...s.completedMissions, missionId] }));
        get().addXP(100);
        get().incrementCircuits();

        // Check badges
        get().checkAndAwardBadge(`complete_mission_${missionId.replace('mission-', '')}`);

        const allMissions = get().completedMissions;
        const world1 = ['mission-1','mission-2','mission-3'].every(m => allMissions.includes(m));
        const world2 = ['mission-4','mission-5','mission-6'].every(m => allMissions.includes(m));
        const world3 = ['mission-7','mission-8','mission-9'].every(m => allMissions.includes(m));
        const allDone = allMissions.length >= 12;

        if (world1) get().checkAndAwardBadge('complete_world_1');
        if (world2) get().checkAndAwardBadge('complete_world_2');
        if (world3) get().checkAndAwardBadge('complete_world_3');
        if (allDone) get().checkAndAwardBadge('complete_all');
      },

      checkAndAwardBadge: (condition) => {
        const badge = BADGES.find(b => b.condition === condition || condition.startsWith(b.condition.replace('_1', '')));
        if (!badge) return;
        const { earnedBadges } = get();
        if (earnedBadges.includes(badge.id)) return;
        set(s => ({
          earnedBadges: [...s.earnedBadges, badge.id],
          showCelebration: true,
          celebrationBadge: badge.id,
        }));
      },

      saveProject: (project) => {
        const saved: SavedProject = { ...project, id: `proj-${Date.now()}`, savedAt: Date.now() };
        set(s => ({ savedProjects: [...s.savedProjects, saved] }));
      },

      deleteProject: (id) => set(s => ({ savedProjects: s.savedProjects.filter(p => p.id !== id) })),

      setCurrentMission: (missionId) => set({ currentMissionId: missionId }),

      finishOnboarding: () => set({ showOnboarding: false }),

      dismissCelebration: () => set({ showCelebration: false, celebrationBadge: null }),

      incrementCircuits: () => set(s => ({ totalCircuits: s.totalCircuits + 1 })),
    }),
    { name: 'robokids-progress' }
  )
);

export { getLevelFromXP };
