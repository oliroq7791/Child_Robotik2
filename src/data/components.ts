export type ComponentCategory = 'controllers' | 'sensors' | 'actuators' | 'power';

export interface PinDefinition {
  id: string;
  label: string;
  type: 'power' | 'ground' | 'digital' | 'analog' | 'pwm' | 'input' | 'output';
  x: number; // relative % position
  y: number;
}

export interface RoboComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  funFact: string;
  width: number;
  height: number;
  pins: PinDefinition[];
  requiresResistor?: boolean;
}

export const COMPONENTS: RoboComponent[] = [
  // Controllers
  {
    id: 'arduino',
    name: 'Arduino Uno',
    category: 'controllers',
    emoji: '🟦',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    description: 'O cérebro do seu robô! Processa todas as instruções.',
    funFact: 'O Arduino foi criado na Itália em 2005 para ajudar estudantes!',
    width: 120,
    height: 90,
    pins: [
      { id: 'gnd', label: 'GND', type: 'ground', x: 10, y: 100 },
      { id: '5v', label: '5V', type: 'power', x: 25, y: 100 },
      { id: 'd13', label: 'D13', type: 'digital', x: 40, y: 0 },
      { id: 'd12', label: 'D12', type: 'digital', x: 55, y: 0 },
      { id: 'd11', label: 'D11', type: 'pwm', x: 70, y: 0 },
      { id: 'd9', label: 'D9', type: 'pwm', x: 85, y: 0 },
      { id: 'a0', label: 'A0', type: 'analog', x: 40, y: 100 },
      { id: 'a1', label: 'A1', type: 'analog', x: 55, y: 100 },
    ],
  },
  {
    id: 'robokid',
    name: 'Placa RoboKid',
    category: 'controllers',
    emoji: '🤖',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    description: 'A placa especial para iniciantes! Super fácil de usar.',
    funFact: 'A placa RoboKid foi criada especialmente para você aprender!',
    width: 110,
    height: 80,
    pins: [
      { id: 'gnd', label: 'GND', type: 'ground', x: 10, y: 100 },
      { id: '5v', label: '5V', type: 'power', x: 25, y: 100 },
      { id: 'led1', label: 'LED1', type: 'digital', x: 50, y: 0 },
      { id: 'led2', label: 'LED2', type: 'digital', x: 70, y: 0 },
      { id: 'btn', label: 'BTN', type: 'input', x: 90, y: 0 },
    ],
  },
  // Sensors
  {
    id: 'ldr',
    name: 'Sensor de Luz',
    category: 'sensors',
    emoji: '☀️',
    color: '#CA8A04',
    bgColor: '#FEF9C3',
    description: 'Detecta se está claro ou escuro. Como os olhos do robô!',
    funFact: 'LDR significa Resistor Dependente de Luz!',
    width: 60,
    height: 60,
    pins: [
      { id: 'vcc', label: 'VCC', type: 'power', x: 20, y: 0 },
      { id: 'gnd', label: 'GND', type: 'ground', x: 50, y: 0 },
      { id: 'out', label: 'OUT', type: 'analog', x: 80, y: 0 },
    ],
  },
  {
    id: 'ultrasonic',
    name: 'Sensor Ultrassônico',
    category: 'sensors',
    emoji: '📡',
    color: '#0891B2',
    bgColor: '#CFFAFE',
    description: 'Mede distâncias como um morcego! Usa ondas sonoras.',
    funFact: 'Igual ao sonar dos submarinos, mas em miniatura!',
    width: 70,
    height: 55,
    pins: [
      { id: 'vcc', label: 'VCC', type: 'power', x: 10, y: 100 },
      { id: 'trig', label: 'TRIG', type: 'digital', x: 35, y: 100 },
      { id: 'echo', label: 'ECHO', type: 'digital', x: 65, y: 100 },
      { id: 'gnd', label: 'GND', type: 'ground', x: 90, y: 100 },
    ],
  },
  {
    id: 'button',
    name: 'Botão Push',
    category: 'sensors',
    emoji: '🔘',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    description: 'Aperte para mandar um sinal ao Arduino!',
    funFact: 'Cada vez que você aperta, fecha um circuito elétrico!',
    width: 50,
    height: 50,
    pins: [
      { id: 'in', label: 'IN', type: 'input', x: 20, y: 50 },
      { id: 'gnd', label: 'GND', type: 'ground', x: 80, y: 50 },
    ],
  },
  {
    id: 'temp',
    name: 'Sensor de Temperatura',
    category: 'sensors',
    emoji: '🌡️',
    color: '#EA580C',
    bgColor: '#FFEDD5',
    description: 'Mede a temperatura do ambiente. Termômetro digital!',
    funFact: 'Pode medir de -55°C até 125°C!',
    width: 55,
    height: 65,
    pins: [
      { id: 'vcc', label: 'VCC', type: 'power', x: 10, y: 50 },
      { id: 'out', label: 'OUT', type: 'analog', x: 50, y: 50 },
      { id: 'gnd', label: 'GND', type: 'ground', x: 90, y: 50 },
    ],
  },
  // Actuators
  {
    id: 'led-red',
    name: 'LED Vermelho',
    category: 'actuators',
    emoji: '🔴',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    description: 'Acende uma luz vermelha. Simples e poderoso!',
    funFact: 'LED significa Diodo Emissor de Luz, inventado em 1962!',
    width: 45,
    height: 55,
    requiresResistor: true,
    pins: [
      { id: 'anode', label: '+', type: 'digital', x: 30, y: 0 },
      { id: 'cathode', label: '-', type: 'ground', x: 70, y: 0 },
    ],
  },
  {
    id: 'led-green',
    name: 'LED Verde',
    category: 'actuators',
    emoji: '🟢',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    description: 'Acende uma luz verde. Ideal para sinalizar "OK"!',
    funFact: 'LEDs verdes são usados em semáforos e telas de celular!',
    width: 45,
    height: 55,
    requiresResistor: true,
    pins: [
      { id: 'anode', label: '+', type: 'digital', x: 30, y: 0 },
      { id: 'cathode', label: '-', type: 'ground', x: 70, y: 0 },
    ],
  },
  {
    id: 'led-blue',
    name: 'LED Azul',
    category: 'actuators',
    emoji: '🔵',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    description: 'Acende uma luz azul. Muito usado em eletrônicos modernos!',
    funFact: 'O LED azul foi inventado em 1994 e ganhou o Nobel de Física!',
    width: 45,
    height: 55,
    requiresResistor: true,
    pins: [
      { id: 'anode', label: '+', type: 'digital', x: 30, y: 0 },
      { id: 'cathode', label: '-', type: 'ground', x: 70, y: 0 },
    ],
  },
  {
    id: 'led-yellow',
    name: 'LED Amarelo',
    category: 'actuators',
    emoji: '🟡',
    color: '#CA8A04',
    bgColor: '#FEF9C3',
    description: 'Acende uma luz amarela. Perfeito para semáforos!',
    funFact: 'LEDs amarelos são feitos de arseneto de gálio!',
    width: 45,
    height: 55,
    requiresResistor: true,
    pins: [
      { id: 'anode', label: '+', type: 'digital', x: 30, y: 0 },
      { id: 'cathode', label: '-', type: 'ground', x: 70, y: 0 },
    ],
  },
  {
    id: 'motor',
    name: 'Motor DC',
    category: 'actuators',
    emoji: '⚙️',
    color: '#475569',
    bgColor: '#F1F5F9',
    description: 'Faz as rodas do robô girar! Motor elétrico simples.',
    funFact: 'Motores DC convertem eletricidade em movimento rotativo!',
    width: 65,
    height: 65,
    pins: [
      { id: 'vcc', label: '+', type: 'power', x: 20, y: 0 },
      { id: 'gnd', label: '-', type: 'ground', x: 80, y: 0 },
    ],
  },
  {
    id: 'servo',
    name: 'Servo Motor',
    category: 'actuators',
    emoji: '🔧',
    color: '#0891B2',
    bgColor: '#CFFAFE',
    description: 'Gira em ângulos precisos. Ideal para braços robóticos!',
    funFact: 'Servos são usados em aeromodelos e robôs industriais!',
    width: 65,
    height: 55,
    pins: [
      { id: 'vcc', label: 'VCC', type: 'power', x: 20, y: 100 },
      { id: 'gnd', label: 'GND', type: 'ground', x: 50, y: 100 },
      { id: 'sig', label: 'SIG', type: 'pwm', x: 80, y: 100 },
    ],
  },
  {
    id: 'buzzer',
    name: 'Buzzer',
    category: 'actuators',
    emoji: '🔊',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    description: 'Faz sons e alarmes! A voz do seu robô.',
    funFact: 'Buzzers usam vibrações elétricas para criar som!',
    width: 55,
    height: 55,
    pins: [
      { id: 'vcc', label: '+', type: 'digital', x: 30, y: 0 },
      { id: 'gnd', label: '-', type: 'ground', x: 70, y: 0 },
    ],
  },
  // Power
  {
    id: 'battery',
    name: 'Bateria 9V',
    category: 'power',
    emoji: '🔋',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    description: 'Fornece energia para seu circuito funcionar!',
    funFact: 'A pilha 9V foi inventada em 1956 para rádios portáteis!',
    width: 55,
    height: 75,
    pins: [
      { id: 'pos', label: '+', type: 'power', x: 30, y: 0 },
      { id: 'neg', label: '-', type: 'ground', x: 70, y: 0 },
    ],
  },
  {
    id: 'resistor',
    name: 'Resistor 220Ω',
    category: 'power',
    emoji: '〰️',
    color: '#CA8A04',
    bgColor: '#FEF9C3',
    description: 'Protege os LEDs de queimar. Muito importante!',
    funFact: 'As faixas coloridas no resistor indicam seu valor!',
    width: 60,
    height: 30,
    pins: [
      { id: 'in', label: 'IN', type: 'input', x: 0, y: 50 },
      { id: 'out', label: 'OUT', type: 'output', x: 100, y: 50 },
    ],
  },
];

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  controllers: '🖥️ Controladores',
  sensors: '👁️ Sensores',
  actuators: '⚡ Atuadores',
  power: '🔋 Alimentação',
};
