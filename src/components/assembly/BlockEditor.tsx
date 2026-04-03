import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulatorStore } from '../../store/simulatorStore';
import { useAssemblyStore } from '../../store/assemblyStore';

interface Block {
  id: string;
  type: string;
  label: string;
  color: string;
  category: string;
  params?: { key: string; label: string; type: 'number' | 'select'; options?: string[]; default: string | number }[];
}

const AVAILABLE_BLOCKS: Block[] = [
  // Structure
  { id: 'setup', type: 'setup', label: '⚙️ Configurar (uma vez)', color: '#2563EB', category: 'Estrutura' },
  { id: 'loop', type: 'loop', label: '🔄 Repetir sempre', color: '#1d4ed8', category: 'Estrutura' },
  { id: 'if', type: 'if', label: '🤔 Se... então...', color: '#1d4ed8', category: 'Estrutura' },
  // Actions
  { id: 'led-on', type: 'led-on', label: '💡 Acender LED', color: '#16A34A', category: 'Ações', params: [{ key: 'color', label: 'Cor', type: 'select', options: ['Vermelho', 'Verde', 'Azul', 'Amarelo'], default: 'Vermelho' }] },
  { id: 'led-off', type: 'led-off', label: '🔌 Apagar LED', color: '#16A34A', category: 'Ações', params: [{ key: 'color', label: 'Cor', type: 'select', options: ['Vermelho', 'Verde', 'Azul', 'Amarelo'], default: 'Vermelho' }] },
  { id: 'led-blink', type: 'led-blink', label: '✨ Piscar LED', color: '#16A34A', category: 'Ações', params: [{ key: 'interval', label: 'Intervalo (ms)', type: 'number', default: 500 }] },
  { id: 'motor-speed', type: 'motor-speed', label: '⚙️ Velocidade do Motor', color: '#16A34A', category: 'Ações', params: [{ key: 'speed', label: 'Velocidade (%)', type: 'number', default: 75 }] },
  { id: 'servo-angle', type: 'servo-angle', label: '🔧 Girar Servo', color: '#16A34A', category: 'Ações', params: [{ key: 'angle', label: 'Ângulo (0-180)', type: 'number', default: 90 }] },
  { id: 'buzzer-beep', type: 'buzzer-beep', label: '🔊 Tocar Buzzer', color: '#16A34A', category: 'Ações', params: [{ key: 'duration', label: 'Duração (ms)', type: 'number', default: 500 }] },
  // Sensors
  { id: 'read-ldr', type: 'read-ldr', label: '☀️ Ler Sensor de Luz', color: '#EA580C', category: 'Sensores' },
  { id: 'read-temp', type: 'read-temp', label: '🌡️ Ler Temperatura', color: '#EA580C', category: 'Sensores' },
  { id: 'read-distance', type: 'read-distance', label: '📡 Ler Distância', color: '#EA580C', category: 'Sensores' },
  { id: 'read-button', type: 'read-button', label: '🔘 Botão Pressionado?', color: '#EA580C', category: 'Sensores' },
  // Time
  { id: 'wait', type: 'wait', label: '⏱️ Esperar', color: '#CA8A04', category: 'Tempo', params: [{ key: 'ms', label: 'Tempo (ms)', type: 'number', default: 1000 }] },
  // Variables
  { id: 'variable', type: 'variable', label: '📦 Variável', color: '#7C3AED', category: 'Variáveis', params: [{ key: 'name', label: 'Nome', type: 'select', options: ['velocidade', 'luz', 'temperatura', 'distancia'], default: 'velocidade' }] },
];

interface ProgramBlock {
  instanceId: string;
  block: Block;
  paramValues: Record<string, string | number>;
}

const CATEGORY_ORDER = ['Estrutura', 'Ações', 'Sensores', 'Tempo', 'Variáveis'];
const CATEGORY_COLORS: Record<string, string> = {
  'Estrutura': '#2563EB',
  'Ações': '#16A34A',
  'Sensores': '#EA580C',
  'Tempo': '#CA8A04',
  'Variáveis': '#7C3AED',
};

export default function BlockEditor() {
  const [program, setProgram] = useState<ProgramBlock[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Ações');
  const { setProgram: setSimProgram } = useSimulatorStore();

  const addBlock = (block: Block) => {
    const paramValues: Record<string, string | number> = {};
    block.params?.forEach(p => { paramValues[p.key] = p.default; });
    const newBlock: ProgramBlock = {
      instanceId: `${block.id}-${Date.now()}`,
      block,
      paramValues,
    };
    const newProgram = [...program, newBlock];
    setProgram(newProgram);
    setSimProgram({ blocks: newProgram.map(b => ({ type: b.block.type, params: b.paramValues })) });
  };

  const removeBlock = (instanceId: string) => {
    const newProgram = program.filter(b => b.instanceId !== instanceId);
    setProgram(newProgram);
    setSimProgram({ blocks: newProgram.map(b => ({ type: b.block.type, params: b.paramValues })) });
  };

  const updateParam = (instanceId: string, key: string, value: string | number) => {
    const newProgram = program.map(b => b.instanceId === instanceId ? { ...b, paramValues: { ...b.paramValues, [key]: value } } : b);
    setProgram(newProgram);
    setSimProgram({ blocks: newProgram.map(b => ({ type: b.block.type, params: b.paramValues })) });
  };

  const generateCode = () => {
    const lines = ['// Código gerado pelo RoboKids Academy 🤖', 'void setup() {'];
    const setupBlocks = program.filter(b => b.block.type === 'setup');
    setupBlocks.forEach(() => lines.push('  // configuração inicial'));
    lines.push('  Serial.begin(9600);');
    lines.push('}', '', 'void loop() {');
    program.filter(b => b.block.type !== 'setup').forEach(b => {
      switch (b.block.type) {
        case 'led-on': lines.push(`  digitalWrite(LED_PIN, HIGH); // Acender LED ${b.paramValues.color}`); break;
        case 'led-off': lines.push(`  digitalWrite(LED_PIN, LOW); // Apagar LED`); break;
        case 'led-blink': lines.push(`  digitalWrite(LED_PIN, HIGH);\n  delay(${b.paramValues.interval});\n  digitalWrite(LED_PIN, LOW);\n  delay(${b.paramValues.interval}); // Piscar LED`); break;
        case 'motor-speed': lines.push(`  analogWrite(MOTOR_PIN, ${Math.round(Number(b.paramValues.speed) * 2.55)}); // Motor a ${b.paramValues.speed}%`); break;
        case 'servo-angle': lines.push(`  servo.write(${b.paramValues.angle}); // Servo a ${b.paramValues.angle}°`); break;
        case 'buzzer-beep': lines.push(`  tone(BUZZER_PIN, 440, ${b.paramValues.duration}); // Buzzer`); break;
        case 'wait': lines.push(`  delay(${b.paramValues.ms}); // Esperar ${b.paramValues.ms}ms`); break;
        case 'read-ldr': lines.push(`  int luz = analogRead(LDR_PIN); // Ler sensor de luz`); break;
        case 'read-temp': lines.push(`  float temp = sensors.getTempC(); // Ler temperatura`); break;
        case 'read-distance': lines.push(`  long dist = getDistance(); // Ler distância cm`); break;
      }
    });
    lines.push('}');
    return lines.join('\n');
  };

  const filteredBlocks = AVAILABLE_BLOCKS.filter(b => b.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-t border-slate-700">
      <div className="flex items-center px-3 py-2 border-b border-slate-700 gap-2 flex-shrink-0">
        <span className="text-xs font-bold text-white">🧩 Blocos de Código</span>
        <div className="flex-1" />
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-[10px] bg-slate-700 hover:bg-slate-600 text-blue-300 px-2 py-1 rounded-lg transition-colors"
        >
          {showCode ? '🧩 Blocos' : '</> Ver Código'}
        </button>
        <button
          onClick={() => { setProgram([]); setSimProgram({ blocks: [] }); }}
          className="text-[10px] bg-red-900/40 hover:bg-red-800/40 text-red-300 px-2 py-1 rounded-lg transition-colors"
        >
          🗑️
        </button>
      </div>

      {showCode ? (
        <div className="flex-1 overflow-auto p-3">
          <pre className="text-[10px] text-green-400 font-mono leading-relaxed whitespace-pre-wrap">{generateCode()}</pre>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0">
          {/* Block palette */}
          <div className="w-36 flex-shrink-0 border-r border-slate-700 flex flex-col">
            <div className="flex-shrink-0">
              {CATEGORY_ORDER.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-2 py-1.5 text-[10px] font-bold transition-colors border-l-2 ${
                    activeCategory === cat
                      ? 'border-l-current text-white bg-slate-800'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                  style={activeCategory === cat ? { color: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-1 space-y-1">
              {filteredBlocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => addBlock(block)}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-bold text-white transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: block.color + '44', borderLeft: `3px solid ${block.color}` }}
                >
                  {block.label}
                </button>
              ))}
            </div>
          </div>

          {/* Program area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {program.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-2xl">🧩</p>
                <p className="text-xs text-slate-500 mt-1">Clique nos blocos<br />para adicionar ao programa!</p>
              </div>
            ) : (
              <AnimatePresence>
                {program.map(pb => (
                  <motion.div
                    key={pb.instanceId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-start gap-1 p-2 rounded-lg"
                    style={{ backgroundColor: pb.block.color + '22', borderLeft: `3px solid ${pb.block.color}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-white">{pb.block.label}</p>
                      {pb.block.params?.map(param => (
                        <div key={param.key} className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] text-slate-400">{param.label}:</span>
                          {param.type === 'select' ? (
                            <select
                              value={pb.paramValues[param.key]}
                              onChange={e => updateParam(pb.instanceId, param.key, e.target.value)}
                              className="text-[9px] bg-slate-700 text-white rounded px-1 py-0.5 border-0 focus:outline-none"
                            >
                              {param.options?.map(o => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input
                              type="number"
                              value={pb.paramValues[param.key]}
                              onChange={e => updateParam(pb.instanceId, param.key, Number(e.target.value))}
                              className="text-[9px] bg-slate-700 text-white rounded px-1 py-0.5 w-14 border-0 focus:outline-none"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => removeBlock(pb.instanceId)}
                      className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
                    >×</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
