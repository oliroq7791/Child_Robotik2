import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BADGES, getLevelFromXP } from '../data/badges';
import { db } from '../firebase';

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
  isSyncing: boolean;

  addXP: (amount: number) => void;
  completeMission: (missionId: string) => void;
  checkAndAwardBadge: (condition: string) => void;
  saveProject: (project: Omit<SavedProject, 'id' | 'savedAt'>) => void;
  deleteProject: (id: string) => void;
  setCurrentMission: (missionId: string | null) => void;
  finishOnboarding: () => void;
  dismissCelebration: () => void;
  incrementCircuits: () => void;
  loadFromFirestore: (uid: string) => Promise<void>;
}

const progressDocRef = (uid: string) => doc(db, 'users', uid, 'progress', 'data');

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => {
      // Syncs current state to Firestore if a user is logged in.
      // Uses dynamic import to avoid circular dependency with authStore.
      const syncToFirestore = async () => {
        const { useAuthStore } = await import('./authStore');
        const uid = useAuthStore.getState().user?.uid;
        if (!uid) return;
        const s = get();
        try {
          await setDoc(progressDocRef(uid), {
            xp: s.xp,
            completedMissions: s.completedMissions,
            earnedBadges: s.earnedBadges,
            savedProjects: s.savedProjects,
            streakDays: s.streakDays,
            lastVisit: s.lastVisit,
            totalCircuits: s.totalCircuits,
            showOnboarding: s.showOnboarding,
            currentMissionId: s.currentMissionId,
            updatedAt: Date.now(),
          }, { merge: true });
        } catch (err) {
          console.warn('[progressStore] Firestore sync failed:', err);
        }
      };

      return {
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
        isSyncing: false,

        addXP: (amount) => {
          set(s => ({ xp: s.xp + amount }));
          void syncToFirestore();
        },

        completeMission: (missionId) => {
          const { completedMissions } = get();
          if (completedMissions.includes(missionId)) return;

          set(s => ({ completedMissions: [...s.completedMissions, missionId] }));
          get().incrementCircuits();
          get().addXP(100);

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
          void syncToFirestore();
        },

        saveProject: (project) => {
          const saved: SavedProject = { ...project, id: `proj-${Date.now()}`, savedAt: Date.now() };
          set(s => ({ savedProjects: [...s.savedProjects, saved] }));
          void syncToFirestore();
        },

        deleteProject: (id) => {
          set(s => ({ savedProjects: s.savedProjects.filter(p => p.id !== id) }));
          void syncToFirestore();
        },

        setCurrentMission: (missionId) => {
          set({ currentMissionId: missionId });
          void syncToFirestore();
        },

        finishOnboarding: () => {
          set({ showOnboarding: false });
          void syncToFirestore();
        },

        dismissCelebration: () => set({ showCelebration: false, celebrationBadge: null }),

        incrementCircuits: () => set(s => ({ totalCircuits: s.totalCircuits + 1 })),

        loadFromFirestore: async (uid) => {
          set({ isSyncing: true });
          try {
            const snap = await getDoc(progressDocRef(uid));
            if (snap.exists()) {
              const data = snap.data();
              set({
                xp:                data['xp']                ?? 0,
                completedMissions: data['completedMissions'] ?? [],
                earnedBadges:      data['earnedBadges']      ?? [],
                savedProjects:     data['savedProjects']     ?? [],
                streakDays:        data['streakDays']        ?? 0,
                lastVisit:         data['lastVisit']         ?? null,
                totalCircuits:     data['totalCircuits']     ?? 0,
                showOnboarding:    data['showOnboarding']    ?? false,
                currentMissionId:  data['currentMissionId']  ?? 'mission-1',
              });
            } else {
              // First login ever: push local data up to Firestore
              const { useAuthStore } = await import('./authStore');
              const currentUid = useAuthStore.getState().user?.uid;
              if (currentUid) await syncToFirestore();
            }
          } catch (err) {
            console.warn('[progressStore] Failed to load from Firestore:', err);
          } finally {
            set({ isSyncing: false });
          }
        },
      };
    },
    { name: 'robokids-progress' }
  )
);

export { getLevelFromXP };
