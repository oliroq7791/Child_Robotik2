import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { COMPONENTS, CATEGORY_LABELS } from '../../data/components';
import type { RoboComponent, ComponentCategory } from '../../data/components';
import { motion, AnimatePresence } from 'framer-motion';

function DraggablePaletteItem({ component, compact = false }: { component: RoboComponent; compact?: boolean }) {
  const [showFact, setShowFact] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${component.id}`,
    data: { type: 'palette-component', component },
  });

  return (
    <div className="relative">
      <motion.div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`drag-component flex items-center cursor-grab transition-all rounded-xl border-2 ${
          isDragging ? 'opacity-50 border-blue-400 shadow-lg shadow-blue-500/20' : 'border-transparent hover:border-blue-400/50'
        } ${compact ? 'flex-col gap-0.5 p-2 w-16' : 'gap-2 p-2'}`}
        style={{ ...(transform ? { transform: CSS.Translate.toString(transform) } : {}), backgroundColor: component.bgColor + '40' }}
        onMouseEnter={() => setShowFact(true)}
        onMouseLeave={() => setShowFact(false)}
        onTouchStart={() => setShowFact(true)}
        onTouchEnd={() => setShowFact(false)}
      >
        <span className={compact ? 'text-2xl' : 'text-xl flex-shrink-0'}>{component.emoji}</span>
        {compact ? (
          <p className="text-[9px] font-bold text-white text-center leading-tight truncate w-full">{component.name}</p>
        ) : (
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{component.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{component.description.slice(0, 30)}...</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showFact && !compact && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            className="absolute left-full top-0 ml-2 z-50 bg-slate-800 border border-slate-600 rounded-xl p-3 w-52 shadow-xl pointer-events-none"
          >
            <p className="text-xs font-bold text-white mb-1">{component.name}</p>
            <p className="text-xs text-slate-300 mb-2">{component.description}</p>
            <p className="text-[10px] text-yellow-400">🌟 {component.funFact}</p>
            <p className="text-[10px] text-blue-400 mt-1">📌 Pinos: {component.pins.map(p => p.label).join(', ')}</p>
          </motion.div>
        )}
        {showFact && compact && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 bg-slate-800 border border-slate-600 rounded-xl p-2 w-44 shadow-xl pointer-events-none"
          >
            <p className="text-[10px] font-bold text-white mb-1">{component.name}</p>
            <p className="text-[10px] text-yellow-400">🌟 {component.funFact}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ComponentPalette({ mobile = false }: { mobile?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('controllers');
  const [search, setSearch] = useState('');

  const categories = Object.keys(CATEGORY_LABELS) as ComponentCategory[];
  const filtered = COMPONENTS.filter(c =>
    c.category === activeCategory &&
    (search === '' || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Mobile: horizontal compact layout ──
  if (mobile) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        {/* Category tabs */}
        <div className="flex overflow-x-auto border-b border-slate-700 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-2 text-[10px] font-bold transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        {/* Components horizontal scroll */}
        <div className="flex gap-2 p-2 overflow-x-auto scrollbar-hide">
          {filtered.map(component => (
            <DraggablePaletteItem key={component.id} component={component} compact />
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-slate-500 py-2 px-2">Nenhum componente</p>
          )}
        </div>
      </div>
    );
  }

  // ── Desktop: vertical layout ──
  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <div className="p-3 border-b border-slate-700">
        <h3 className="text-sm font-bold text-white mb-2">🧩 Componentes</h3>
        <input
          type="text"
          placeholder="Buscar componente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:border-blue-500 placeholder-slate-500"
        />
      </div>

      <div className="flex border-b border-slate-700 overflow-x-auto flex-shrink-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-2 py-1.5 text-[10px] font-bold transition-colors ${
              activeCategory === cat
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {CATEGORY_LABELS[cat].split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <p className="text-[10px] text-slate-500 px-1 mb-1">{CATEGORY_LABELS[activeCategory]}</p>
        {filtered.map(component => (
          <DraggablePaletteItem key={component.id} component={component} />
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-4">Nenhum componente encontrado</p>
        )}
      </div>

      <div className="p-2 border-t border-slate-700">
        <p className="text-[10px] text-slate-500 text-center">⬆️ Arraste para a área de montagem</p>
      </div>
    </div>
  );
}
