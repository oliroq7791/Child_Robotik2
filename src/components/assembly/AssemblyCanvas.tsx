import { useRef, useState, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssemblyStore } from '../../store/assemblyStore';
import type { PlacedComponent } from '../../store/assemblyStore';
import { useSimulatorStore } from '../../store/simulatorStore';

const COMPONENT_COLORS: Record<string, string> = {
  'controllers': '#2563EB',
  'sensors': '#0891B2',
  'actuators': '#16A34A',
  'power': '#CA8A04',
};

function PlacedComponentNode({
  placed,
  isActive,
  isSelected,
}: {
  placed: PlacedComponent;
  isActive: boolean;
  isSelected: boolean;
}) {
  const { moveComponent, removeComponent, selectComponent } = useAssemblyStore();
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cx: 0, cy: 0 });
  const { component } = placed;
  const color = COMPONENT_COLORS[component.category] || '#64748b';

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(placed.instanceId);
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, cx: placed.x, cy: placed.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const newX = Math.max(0, dragStart.cx + dx);
    const newY = Math.max(0, dragStart.cy + dy);
    moveComponent(placed.instanceId, newX, newY);
  }, [dragging, dragStart, placed.instanceId, moveComponent]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  // Attach/detach global listeners
  if (dragging) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp, { once: true });
  }

  const ledColors: Record<string, string> = {
    'led-red': '#ef4444',
    'led-green': '#22c55e',
    'led-blue': '#3b82f6',
    'led-yellow': '#eab308',
  };

  const isLed = placed.componentId.startsWith('led-');
  const ledColor = ledColors[placed.componentId] || '#ef4444';

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: placed.x,
        top: placed.y,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 10 : 1,
        userSelect: 'none',
      }}
      className={`group ${dragging ? 'opacity-80' : ''}`}
    >
      <div
        className={`relative flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-white shadow-lg shadow-white/20'
            : 'border-transparent hover:border-white/30'
        }`}
        style={{ backgroundColor: color + '22', minWidth: component.width, minHeight: component.height }}
      >
        {/* Component visual */}
        <div
          className={`w-full h-full flex flex-col items-center justify-center rounded-lg p-2 ${
            isLed && isActive ? 'led-on' : ''
          }`}
          style={{
            backgroundColor: color + '44',
            color: isLed && isActive ? ledColor : color,
            boxShadow: isLed && isActive ? `0 0 16px 4px ${ledColor}` : 'none',
          }}
        >
          <span className="text-2xl">{component.emoji}</span>
          {placed.componentId === 'motor' && isActive && (
            <div className="motor-spin text-lg">⚙️</div>
          )}
          {placed.componentId === 'buzzer' && isActive && (
            <div className="flex gap-0.5 items-end h-4">
              {[2,4,6,4,2].map((h, i) => (
                <div key={i} className="w-1 bg-purple-400 rounded animate-pulse" style={{ height: `${h * 2}px`, animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          )}
          {placed.componentId === 'ultrasonic' && isActive && (
            <div className="flex gap-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          )}
        </div>

        {/* Component name */}
        <p className="text-[9px] font-bold text-white mt-1 text-center leading-tight">{component.name}</p>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-slate-900 animate-pulse" />
        )}

        {/* Remove button */}
        <button
          onMouseDown={e => { e.stopPropagation(); removeComponent(placed.instanceId); }}
          className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 hover:bg-red-400 rounded-full text-white text-xs font-bold hidden group-hover:flex items-center justify-center shadow-lg transition-colors"
        >
          ×
        </button>

        {/* Pins */}
        <div className="absolute inset-0 pointer-events-none">
          {component.pins.map(pin => {
            const pinX = (pin.x / 100) * (component.width + 8);
            const pinY = pin.y === 0 ? -4 : pin.y === 100 ? (component.height + 4) : (pin.y / 100) * component.height;
            const pinColor = pin.type === 'power' ? '#ef4444' : pin.type === 'ground' ? '#1f2937' : pin.type === 'pwm' ? '#8b5cf6' : '#3b82f6';
            return (
              <div
                key={pin.id}
                title={`${pin.label} — ${pin.type}`}
                style={{
                  position: 'absolute',
                  left: pinX,
                  top: pinY,
                  width: 8,
                  height: 8,
                  backgroundColor: pinColor,
                  borderRadius: '50%',
                  border: '1.5px solid white',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function AssemblyCanvas() {
  const { placed, wires, selectedInstanceId, selectComponent, undo, redo, clearAll } = useAssemblyStore();
  const { componentStates } = useSimulatorStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver } = useDroppable({ id: 'assembly-canvas' });

  return (
    <div className="relative flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <span className="text-xs font-bold text-slate-300">🔧 Área de Montagem</span>
        <div className="flex-1" />
        <button onClick={undo} title="Desfazer (Ctrl+Z)" className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded-lg transition-colors">↩ Desfazer</button>
        <button onClick={redo} title="Refazer" className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded-lg transition-colors">↪ Refazer</button>
        <button onClick={clearAll} className="text-xs bg-red-900/50 hover:bg-red-800/50 text-red-300 px-2 py-1 rounded-lg transition-colors">🗑️ Limpar</button>
      </div>

      {/* Canvas */}
      <div
        ref={(node) => { setNodeRef(node); (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = node; }}
        onClick={() => selectComponent(null)}
        className={`flex-1 relative overflow-hidden transition-colors ${
          isOver ? 'bg-blue-900/20' : 'bg-slate-950'
        }`}
        style={{
          backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Drop hint */}
        {placed.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-4xl mb-3">🔧</p>
              <p className="text-slate-400 font-bold text-sm">Arraste componentes aqui!</p>
              <p className="text-slate-600 text-xs mt-1">Comece com um Arduino ou RoboKid</p>
            </div>
          </div>
        )}

        {/* Drop highlight */}
        {isOver && (
          <div className="absolute inset-0 border-2 border-blue-400 border-dashed rounded-xl pointer-events-none opacity-60" />
        )}

        {/* Wires SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {wires.map(wire => {
            const fromComp = placed.find(p => p.instanceId === wire.fromInstanceId);
            const toComp = placed.find(p => p.instanceId === wire.toInstanceId);
            if (!fromComp || !toComp) return null;
            const x1 = fromComp.x + fromComp.component.width / 2;
            const y1 = fromComp.y + fromComp.component.height / 2;
            const x2 = toComp.x + toComp.component.width / 2;
            const y2 = toComp.y + toComp.component.height / 2;
            return (
              <line
                key={wire.id}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={wire.valid ? '#22c55e' : '#ef4444'}
                strokeWidth="2"
                strokeDasharray={wire.valid ? '6 3' : '4 2'}
                className={wire.valid ? 'wire-flow' : 'animate-pulse'}
                opacity={0.7}
              />
            );
          })}
        </svg>

        {/* Placed components */}
        <AnimatePresence>
          {placed.map(p => (
            <PlacedComponentNode
              key={p.instanceId}
              placed={p}
              isActive={!!componentStates[p.instanceId]?.active}
              isSelected={selectedInstanceId === p.instanceId}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-800 border-t border-slate-700 flex-shrink-0">
        <span className="text-[10px] text-slate-500">
          {placed.length} componente{placed.length !== 1 ? 's' : ''} • {wires.length} conex{wires.length !== 1 ? 'ões' : 'ão'}
        </span>
        {placed.length > 0 && (
          <span className="text-[10px] text-green-400">✓ Pronto para simular</span>
        )}
      </div>
    </div>
  );
}
