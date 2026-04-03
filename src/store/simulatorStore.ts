import { create } from 'zustand';

export interface ConsoleMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'tip';
  text: string;
  timestamp: number;
}

export type SimulationMode = 'idle' | 'running' | 'paused' | 'error';

export interface ComponentState {
  instanceId: string;
  active: boolean;
  value?: number; // 0-100 for brightness, speed, angle
  blinking?: boolean;
  blinkRate?: number; // ms
  spinning?: boolean;
  error?: string;
}

// Blockly-generated program representation
export interface SimProgram {
  blocks: SimBlock[];
}

export interface SimBlock {
  type: string;
  params: Record<string, unknown>;
}

interface SimulatorStore {
  mode: SimulationMode;
  componentStates: Record<string, ComponentState>;
  consoleMessages: ConsoleMessage[];
  speed: number; // 0.5 - 3
  program: SimProgram;
  mascotEmotion: 'happy' | 'sad' | 'surprised' | 'thinking' | 'excited';
  mascotAnimation: 'idle' | 'bounce' | 'shake' | 'spin';
  xpFloat: { id: string; amount: number; x: number; y: number } | null;

  setMode: (mode: SimulationMode) => void;
  setComponentState: (instanceId: string, state: Partial<ComponentState>) => void;
  addMessage: (type: ConsoleMessage['type'], text: string) => void;
  clearMessages: () => void;
  setSpeed: (speed: number) => void;
  setProgram: (program: SimProgram) => void;
  setMascot: (emotion: SimulatorStore['mascotEmotion'], animation?: SimulatorStore['mascotAnimation']) => void;
  showXPFloat: (amount: number) => void;
  reset: () => void;
}

export const useSimulatorStore = create<SimulatorStore>((set) => ({
  mode: 'idle',
  componentStates: {},
  consoleMessages: [],
  speed: 1,
  program: { blocks: [] },
  mascotEmotion: 'happy',
  mascotAnimation: 'idle',
  xpFloat: null,

  setMode: (mode) => set({ mode }),

  setComponentState: (instanceId, state) => set(s => ({
    componentStates: {
      ...s.componentStates,
      [instanceId]: { ...s.componentStates[instanceId], instanceId, ...state },
    },
  })),

  addMessage: (type, text) => {
    const msg: ConsoleMessage = { id: `msg-${Date.now()}-${Math.random()}`, type, text, timestamp: Date.now() };
    set(s => ({ consoleMessages: [...s.consoleMessages.slice(-49), msg] }));
  },

  clearMessages: () => set({ consoleMessages: [] }),

  setSpeed: (speed) => set({ speed }),

  setProgram: (program) => set({ program }),

  setMascot: (emotion, animation = 'idle') => set({ mascotEmotion: emotion, mascotAnimation: animation }),

  showXPFloat: (amount) => {
    const id = `xp-${Date.now()}`;
    set({ xpFloat: { id, amount, x: Math.random() * 200 + 100, y: 100 } });
    setTimeout(() => set(s => s.xpFloat?.id === id ? { xpFloat: null } : {}), 2000);
  },

  reset: () => set({
    mode: 'idle',
    componentStates: {},
    consoleMessages: [],
    mascotEmotion: 'happy',
    mascotAnimation: 'idle',
    xpFloat: null,
  }),
}));
