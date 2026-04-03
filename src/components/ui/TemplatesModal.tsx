import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES } from '../../data/templates';
import { useAssemblyStore } from '../../store/assemblyStore';
import { useSimulatorStore } from '../../store/simulatorStore';
import type { Template } from '../../data/templates';

export default function TemplatesModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Template | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { loadProject } = useAssemblyStore();
  const { reset, setProgram } = useSimulatorStore();

  const handleLoad = (tpl: Template) => {
    // Assign unique instanceIds to each placed component
    const placed = tpl.placed.map((p, i) => ({
      ...p,
      instanceId: `${p.componentId}-tpl-${i}-${Date.now()}`,
    }));
    loadProject(placed, []);
    reset();
    setProgram({
      blocks: tpl.programBlocks.map(b => ({ type: b.type, params: b.params })),
    });
    setLoaded(true);
    setTimeout(onClose, 800);
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
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700 flex-shrink-0">
          <span className="text-2xl">🗂️</span>
          <div>
            <h2 className="text-base font-black text-white">Exemplos Prontos</h2>
            <p className="text-xs text-slate-400">Escolha um modelo para começar e modifique como quiser!</p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-white text-xl transition-colors">×</button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {TEMPLATES.map(tpl => (
            <motion.button
              key={tpl.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(selected?.id === tpl.id ? null : tpl)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                selected?.id === tpl.id
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="text-3xl mb-2">{tpl.emoji}</div>
              <p className="font-black text-white text-sm mb-1">{tpl.name}</p>
              <p className="text-[11px] text-slate-400 leading-snug mb-3">{tpl.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: tpl.difficultyColor + '33', color: tpl.difficultyColor }}
                >
                  {tpl.difficulty}
                </span>
                <span className="text-[10px] text-slate-500">{tpl.placed.length} peças</span>
                {tpl.youtubeId && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-600/20 text-red-400">
                    ▶ vídeo
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Preview & Load */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700 bg-slate-800/60 overflow-hidden flex-shrink-0"
            >
              <div className="px-5 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white mb-1">
                    {selected.emoji} {selected.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-2">{selected.description}</p>

                  {/* Components list */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selected.placed.map((p, i) => (
                      <span key={i} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                        {p.component.emoji} {p.component.name}
                      </span>
                    ))}
                  </div>

                  {/* Tip */}
                  <p className="text-[11px] text-yellow-400">
                    💡 <span className="font-bold">Dica para adaptar:</span> {selected.tip}
                  </p>
                </div>

                {/* YouTube thumbnail + load button */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  {selected.youtubeId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${selected.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver vídeo relacionado no YouTube"
                      className="relative group block rounded-lg overflow-hidden border border-slate-600 hover:border-red-500 transition-colors"
                      style={{ width: 140 }}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${selected.youtubeId}/hqdefault.jpg`}
                        alt={`Vídeo relacionado: ${selected.name}`}
                        className="w-full object-cover"
                        style={{ height: 79 }}
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-0.5">
                        <p className="text-[9px] text-white font-bold truncate">▶ Ver no YouTube</p>
                      </div>
                    </a>
                  )}

                  <button
                    onClick={() => handleLoad(selected)}
                    className={`px-5 py-3 rounded-xl font-black text-sm transition-all ${
                      loaded
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    }`}
                  >
                    {loaded ? '✅ Carregado!' : '🚀 Usar este modelo'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
