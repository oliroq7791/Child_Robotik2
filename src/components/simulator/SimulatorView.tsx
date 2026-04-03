import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulatorStore } from '../../store/simulatorStore';
import { useAssemblyStore } from '../../store/assemblyStore';
import { useProgressStore } from '../../store/progressStore';
import { validateCircuit, detectMissionSuccess } from '../../utils/circuitValidator';
import RoboKit from '../mascot/RoboKit';
import ConsolePanel from './ConsolePanel';

const COMPONENT_COLORS: Record<string, string> = {
  'led-red': '#ef4444', 'led-green': '#22c55e', 'led-blue': '#3b82f6', 'led-yellow': '#eab308',
};

function SimulatorCanvas() {
  const { componentStates, mode } = useSimulatorStore();
  const { placed } = useAssemblyStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 0.05;
    const t = timeRef.current;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    if (mode !== 'running') {
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 14px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('▶ Clique em Simular para ver o circuito!', canvas.width / 2, canvas.height / 2);
      return;
    }

    const activeIds = Object.entries(componentStates).filter(([, s]) => s.active).map(([id]) => id);

    // Draw each active component visualization
    let col = 0;
    placed.forEach(p => {
      const isActive = !!componentStates[p.instanceId]?.active;
      const x = 40 + (col % 4) * 90;
      const y = 40 + Math.floor(col / 4) * 90;
      col++;

      // Base circle
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      const baseColor = isActive ? (COMPONENT_COLORS[p.componentId] || '#3b82f6') : '#1e293b';
      ctx.fillStyle = baseColor;
      if (isActive) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 28);
        glow.addColorStop(0, baseColor + 'ff');
        glow.addColorStop(1, baseColor + '44');
        ctx.fillStyle = glow;
        ctx.shadowBlur = 20 + Math.sin(t * 3) * 8;
        ctx.shadowColor = baseColor;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Icon
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.component.emoji, x, y);

      // Motor animation
      if (p.componentId === 'motor' && isActive) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 5);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(22 * Math.cos(i * Math.PI / 2), 22 * Math.sin(i * Math.PI / 2));
          ctx.stroke();
        }
        ctx.restore();
      }

      // Ultrasonic waves
      if (p.componentId === 'ultrasonic' && isActive) {
        for (let r = 1; r <= 3; r++) {
          const radius = 30 + r * 15 + (t * 20 % 45);
          ctx.beginPath();
          ctx.arc(x, y - 20, radius, Math.PI * 1.2, Math.PI * 1.8);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.6 - r * 0.15})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Buzzer waves
      if (p.componentId === 'buzzer' && isActive) {
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath();
          ctx.arc(x, y, 28 + r * 10 + Math.sin(t * 8) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.5 - r * 0.12})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Label
      ctx.font = 'bold 9px Nunito, sans-serif';
      ctx.fillStyle = isActive ? '#fff' : '#475569';
      ctx.fillText(p.component.name.slice(0, 10), x, y + 38);
    });

    // Connection lines between components
    if (placed.length >= 2 && activeIds.length > 0) {
      for (let i = 0; i < Math.min(placed.length - 1, 5); i++) {
        const from = placed[i];
        const to = placed[i + 1];
        if (!from || !to) continue;
        const x1 = 40 + (i % 4) * 90;
        const y1 = 40 + Math.floor(i / 4) * 90;
        const x2 = 40 + ((i + 1) % 4) * 90;
        const y2 = 40 + Math.floor((i + 1) / 4) * 90;

        const isWireActive = componentStates[from.instanceId]?.active || componentStates[to.instanceId]?.active;
        ctx.strokeStyle = isWireActive ? '#22c55e' : '#334155';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.lineDashOffset = -t * 15;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [placed, componentStates, mode]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={380}
      height={220}
      className="w-full h-full rounded-xl"
      style={{ display: 'block' }}
    />
  );
}

export default function SimulatorView() {
  const { mode, setMode, setComponentState, addMessage, setMascot, xpFloat, reset } = useSimulatorStore();
  const { placed } = useAssemblyStore();
  const { currentMissionId, completeMission, addXP, showXPFloat } = useProgressStore();
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopSim = useCallback(() => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    if (blinkRef.current) clearInterval(blinkRef.current);
    placed.forEach(p => setComponentState(p.instanceId, { active: false }));
    setMode('idle');
    setMascot('thinking');
  }, [placed, setComponentState, setMode, setMascot]);

  const runSimulation = useCallback(() => {
    reset();
    const result = validateCircuit(placed, []);

    if (!result.valid) {
      result.errors.forEach(e => addMessage('error', e));
      result.tips.forEach(t => addMessage('tip', t));
      setMascot('sad', 'shake');
      addMessage('info', 'Ops! Verifique o circuito e tente de novo! 😊');
      return;
    }

    setMode('running');
    setMascot('excited', 'bounce');
    addMessage('success', '▶ Simulação iniciada!');
    result.warnings.forEach(w => addMessage('warning', w));
    result.tips.forEach(t => addMessage('tip', t));

    // Activate components
    result.activeComponents.forEach(instanceId => {
      const comp = placed.find(p => p.instanceId === instanceId);
      if (!comp) return;
      setComponentState(instanceId, { active: true, value: 100 });

      if (comp.componentId.startsWith('led-')) {
        addMessage('success', `💡 LED ${comp.component.name} aceso!`);
      }
      if (comp.componentId === 'motor') {
        addMessage('success', '⚙️ Motor girando a 75%!');
        setComponentState(instanceId, { active: true, spinning: true, value: 75 });
      }
      if (comp.componentId === 'buzzer') {
        addMessage('success', '🔊 Buzzer tocando!');
      }
      if (comp.componentId === 'ultrasonic') {
        addMessage('info', '📡 Sensor ultrassônico: detectando a 15cm');
      }
      if (comp.componentId === 'ldr') {
        addMessage('info', '☀️ Sensor de luz: 72% de luminosidade');
      }
      if (comp.componentId === 'temp') {
        addMessage('info', '🌡️ Temperatura: 23°C');
      }
      if (comp.componentId === 'servo') {
        addMessage('success', '🔧 Servo motor: girando para 90°');
      }
    });

    // Check blinking blocks
    const hasLed = placed.some(p => p.componentId.startsWith('led-'));
    if (hasLed) {
      let ledOn = true;
      blinkRef.current = setInterval(() => {
        placed.filter(p => p.componentId.startsWith('led-')).forEach(led => {
          setComponentState(led.instanceId, { active: ledOn });
        });
        ledOn = !ledOn;
      }, 800);
    }

    // Check mission success after 2s
    setTimeout(() => {
      if (currentMissionId && detectMissionSuccess(placed, currentMissionId)) {
        completeMission(currentMissionId);
        addXP(50);
        addMessage('success', '🎉 Missão completa! Você ganhou +150 XP!');
        setMascot('excited', 'bounce');
        showXPFloat(150);
      }
    }, 2000);
  }, [placed, currentMissionId, reset, setMode, setMascot, addMessage, setComponentState, completeMission, addXP, showXPFloat]);

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (blinkRef.current) clearInterval(blinkRef.current);
    };
  }, []);

  const speed = useSimulatorStore(s => s.speed);
  const setSpeed = useSimulatorStore(s => s.setSpeed);

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Simulator canvas */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-700 overflow-hidden" style={{ height: '220px', flexShrink: 0 }}>
        <SimulatorCanvas />

        {/* XP Float */}
        <AnimatePresence>
          {xpFloat && (
            <motion.div
              key={xpFloat.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute text-yellow-400 font-black text-lg pointer-events-none"
              style={{ left: xpFloat.x, top: xpFloat.y }}
            >
              +{xpFloat.amount} XP ✨
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2 border border-slate-700 flex-shrink-0">
        <button
          onClick={mode === 'running' ? stopSim : runSimulation}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            mode === 'running'
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
          }`}
        >
          {mode === 'running' ? '⏹ Parar' : '▶ Simular'}
        </button>

        {mode === 'running' && (
          <button
            onClick={() => { setMode('paused'); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-sm transition-colors"
          >
            ⏸
          </button>
        )}

        <button
          onClick={() => { stopSim(); reset(); }}
          className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors"
        >
          🔄
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[10px] text-slate-400">⚡</span>
          <input
            type="range"
            min="0.5" max="3" step="0.5"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-16 accent-blue-500"
          />
          <span className="text-[10px] text-slate-400">{speed}x</span>
        </div>

        <RoboKit />
      </div>

      {/* Console */}
      <div className="flex-1 min-h-0">
        <ConsolePanel />
      </div>
    </div>
  );
}
