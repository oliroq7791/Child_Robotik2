import { create } from 'zustand';
import type { RoboComponent } from '../data/components';

export interface PlacedComponent {
  instanceId: string;
  componentId: string;
  component: RoboComponent;
  x: number;
  y: number;
}

export interface Wire {
  id: string;
  fromInstanceId: string;
  fromPinId: string;
  toInstanceId: string;
  toPinId: string;
  valid: boolean;
}

interface AssemblyStore {
  placed: PlacedComponent[];
  wires: Wire[];
  selectedInstanceId: string | null;
  history: { placed: PlacedComponent[]; wires: Wire[] }[];
  historyIndex: number;

  addComponent: (component: RoboComponent, x: number, y: number) => void;
  moveComponent: (instanceId: string, x: number, y: number) => void;
  removeComponent: (instanceId: string) => void;
  selectComponent: (instanceId: string | null) => void;
  addWire: (wire: Omit<Wire, 'id' | 'valid'>) => void;
  removeWire: (id: string) => void;
  clearAll: () => void;
  undo: () => void;
  redo: () => void;
  loadProject: (placed: PlacedComponent[], wires: Wire[]) => void;
}

let instanceCounter = 0;

export const useAssemblyStore = create<AssemblyStore>((set, get) => ({
  placed: [],
  wires: [],
  selectedInstanceId: null,
  history: [{ placed: [], wires: [] }],
  historyIndex: 0,

  addComponent: (component, x, y) => {
    const instanceId = `${component.id}-${++instanceCounter}`;
    const newPlaced = [...get().placed, { instanceId, componentId: component.id, component, x, y }];
    const snapshot = { placed: newPlaced, wires: get().wires };
    const history = get().history.slice(0, get().historyIndex + 1);
    set({ placed: newPlaced, history: [...history, snapshot], historyIndex: history.length });
  },

  moveComponent: (instanceId, x, y) => {
    set(s => ({
      placed: s.placed.map(p => p.instanceId === instanceId ? { ...p, x, y } : p),
    }));
  },

  removeComponent: (instanceId) => {
    const newPlaced = get().placed.filter(p => p.instanceId !== instanceId);
    const newWires = get().wires.filter(w => w.fromInstanceId !== instanceId && w.toInstanceId !== instanceId);
    const snapshot = { placed: newPlaced, wires: newWires };
    const history = get().history.slice(0, get().historyIndex + 1);
    set({ placed: newPlaced, wires: newWires, selectedInstanceId: null, history: [...history, snapshot], historyIndex: history.length });
  },

  selectComponent: (instanceId) => set({ selectedInstanceId: instanceId }),

  addWire: (wireData) => {
    // Validate: no duplicate connections
    const existing = get().wires.find(
      w => w.fromInstanceId === wireData.fromInstanceId && w.fromPinId === wireData.fromPinId
    );
    if (existing) return;

    // Basic validation: power pins connect to power, etc.
    const fromComp = get().placed.find(p => p.instanceId === wireData.fromInstanceId);
    const toComp = get().placed.find(p => p.instanceId === wireData.toInstanceId);
    let valid = true;
    if (fromComp && toComp) {
      const fromPin = fromComp.component.pins.find(p => p.id === wireData.fromPinId);
      const toPin = toComp.component.pins.find(p => p.id === wireData.toPinId);
      if (fromPin && toPin) {
        // Power to ground = invalid
        if ((fromPin.type === 'power' && toPin.type === 'power') ||
            (fromPin.type === 'ground' && toPin.type === 'ground')) {
          valid = false;
        }
      }
    }

    const wire: Wire = { ...wireData, id: `wire-${Date.now()}`, valid };
    const newWires = [...get().wires, wire];
    set({ wires: newWires });
  },

  removeWire: (id) => set(s => ({ wires: s.wires.filter(w => w.id !== id) })),

  clearAll: () => set({ placed: [], wires: [], selectedInstanceId: null }),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set({ placed: prev.placed, wires: prev.wires, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({ placed: next.placed, wires: next.wires, historyIndex: historyIndex + 1 });
  },

  loadProject: (placed, wires) => set({ placed, wires, selectedInstanceId: null }),
}));
