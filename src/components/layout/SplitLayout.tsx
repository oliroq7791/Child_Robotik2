import { useState, useRef, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useAssemblyStore } from '../../store/assemblyStore';
import type { RoboComponent } from '../../data/components';
import ComponentPalette from '../assembly/ComponentPalette';
import AssemblyCanvas from '../assembly/AssemblyCanvas';
import BlockEditor from '../assembly/BlockEditor';
import SimulatorView from '../simulator/SimulatorView';
import MissionGuide from './MissionGuide';
import XPBar from '../gamification/XPBar';

type MobileTab = 'montagem' | 'blocos' | 'simulador';

const MOBILE_TABS: { id: MobileTab; label: string; emoji: string }[] = [
  { id: 'montagem',  label: 'Montagem',  emoji: '🔧' },
  { id: 'blocos',    label: 'Blocos',    emoji: '🧩' },
  { id: 'simulador', label: 'Simular',   emoji: '▶️' },
];

export default function SplitLayout() {
  const { addComponent } = useAssemblyStore();
  const [splitPos, setSplitPos]           = useState(52);
  const [draggingDivider, setDraggingDivider] = useState(false);
  const [activeComponent, setActiveComponent] = useState<RoboComponent | null>(null);
  const [mobileTab, setMobileTab]         = useState<MobileTab>('montagem');
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === 'palette-component') {
      setActiveComponent(event.active.data.current.component);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveComponent(null);
    const { over, active } = event;
    if (over?.id === 'assembly-canvas' && active.data.current?.type === 'palette-component') {
      const component = active.data.current.component as RoboComponent;
      const canvasEl = document.querySelector('[data-canvas="true"]');
      const rect = canvasEl?.getBoundingClientRect();
      const x = rect ? Math.max(10, (event.delta.x + (rect.width / 2)) % (rect.width - 100)) : 80;
      const y = rect ? Math.max(10, (event.delta.y + (rect.height / 2)) % (rect.height - 80)) : 80;
      addComponent(component, Math.abs(x), Math.abs(y));
    }
  }, [addComponent]);

  // Divider drag (desktop only)
  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingDivider(true);
  }, []);

  useEffect(() => {
    if (!draggingDivider) return;
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.max(30, Math.min(70, pct)));
    };
    const onUp = () => setDraggingDivider(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [draggingDivider]);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

      {/* ───────────── DESKTOP (md+) ───────────── */}
      <div
        ref={containerRef}
        className="hidden md:flex flex-1 min-h-0 overflow-hidden"
        style={{ cursor: draggingDivider ? 'col-resize' : 'default' }}
      >
        {/* LEFT PANEL */}
        <div className="flex flex-col min-h-0 overflow-hidden" style={{ width: `${splitPos}%`, flexShrink: 0 }}>
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="w-44 flex-shrink-0 p-2 border-r border-slate-700">
              <ComponentPalette />
            </div>
            <div className="flex-1 flex flex-col min-h-0 min-w-0">
              <div className="p-2 border-b border-slate-700 flex-shrink-0">
                <MissionGuide />
              </div>
              <div className="flex-1 min-h-0" data-canvas="true">
                <AssemblyCanvas />
              </div>
              <div style={{ height: '200px', flexShrink: 0 }}>
                <BlockEditor />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          onMouseDown={onDividerMouseDown}
          className={`w-1.5 flex-shrink-0 cursor-col-resize transition-colors ${
            draggingDivider ? 'bg-blue-500' : 'bg-slate-700 hover:bg-blue-500/50'
          }`}
        />

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col min-h-0 p-3 gap-3 overflow-hidden">
          <XPBar />
          <div className="flex-1 min-h-0">
            <SimulatorView />
          </div>
        </div>
      </div>

      {/* ───────────── MOBILE (< md) ───────────── */}
      <div className="flex md:hidden flex-col flex-1 min-h-0 overflow-hidden">

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === 'montagem' && (
            <div className="flex flex-col h-full">
              {/* Mission guide collapsed on mobile */}
              <div className="px-2 pt-2 flex-shrink-0">
                <MissionGuide />
              </div>
              {/* Palette horizontal scroll */}
              <div className="px-2 pt-2 flex-shrink-0">
                <ComponentPalette mobile />
              </div>
              {/* Canvas */}
              <div className="flex-1 min-h-0 mx-2 mb-2 mt-2" data-canvas="true">
                <AssemblyCanvas />
              </div>
            </div>
          )}

          {mobileTab === 'blocos' && (
            <div className="h-full">
              <BlockEditor />
            </div>
          )}

          {mobileTab === 'simulador' && (
            <div className="flex flex-col h-full p-2 gap-2">
              <XPBar />
              <div className="flex-1 min-h-0">
                <SimulatorView />
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <div className="flex-shrink-0 flex border-t border-slate-700 bg-slate-900">
          {MOBILE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
                mobileTab === tab.id
                  ? 'text-blue-400 bg-blue-500/10 border-t-2 border-blue-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <span className="text-lg leading-none">{tab.emoji}</span>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeComponent && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-blue-400 shadow-xl shadow-blue-500/30 opacity-90"
            style={{ backgroundColor: activeComponent.bgColor + '90' }}
          >
            <span className="text-xl">{activeComponent.emoji}</span>
            <span className="text-sm font-bold text-white">{activeComponent.name}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
