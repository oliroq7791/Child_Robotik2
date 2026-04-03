import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulatorStore } from '../../store/simulatorStore';
import type { ConsoleMessage } from '../../store/simulatorStore';

const TYPE_STYLES: Record<ConsoleMessage['type'], { icon: string; color: string }> = {
  success: { icon: '✅', color: 'text-green-400' },
  error: { icon: '❌', color: 'text-red-400' },
  warning: { icon: '⚠️', color: 'text-yellow-400' },
  info: { icon: 'ℹ️', color: 'text-blue-400' },
  tip: { icon: '💡', color: 'text-yellow-300' },
};

export default function ConsolePanel() {
  const { consoleMessages, clearMessages, mode } = useSimulatorStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleMessages]);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-700 overflow-hidden">
      <div className="flex items-center px-3 py-2 bg-slate-900 border-b border-slate-700 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs font-bold text-slate-400 ml-2">Console</span>
        <div className="flex-1" />
        {mode === 'running' && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-green-400 font-bold">SIMULANDO</span>
          </div>
        )}
        <button
          onClick={clearMessages}
          className="ml-2 text-[10px] text-slate-500 hover:text-white transition-colors"
        >
          Limpar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono">
        {consoleMessages.length === 0 ? (
          <p className="text-[11px] text-slate-600">{'>'} Aguardando simulação...</p>
        ) : (
          <AnimatePresence initial={false}>
            {consoleMessages.map(msg => {
              const style = TYPE_STYLES[msg.type];
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 ${style.color}`}
                >
                  <span className="text-xs flex-shrink-0">{style.icon}</span>
                  <span className="text-[11px] leading-relaxed">{msg.text}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
