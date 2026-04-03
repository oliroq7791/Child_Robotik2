import { COMPONENTS } from './components';
import type { PlacedComponent } from '../store/assemblyStore';

export interface Template {
  id: string;
  name: string;
  description: string;
  emoji: string;
  difficulty: 'fácil' | 'médio' | 'avançado';
  difficultyColor: string;
  placed: Omit<PlacedComponent, 'instanceId'>[];
  programBlocks: { type: string; label: string; color: string; params: Record<string, string | number> }[];
  tip: string;
  youtubeId?: string;
}

const comp = (id: string) => COMPONENTS.find(c => c.id === id)!;

export const TEMPLATES: Template[] = [
  {
    id: 'tpl-led-simples',
    name: 'LED Simples',
    description: 'O circuito mais clássico da eletrônica! Um Arduino acende um LED vermelho. Perfeito para começar!',
    emoji: '💡',
    difficulty: 'fácil',
    difficultyColor: '#16A34A',
    placed: [
      { componentId: 'arduino',  component: comp('arduino'),  x: 140, y: 80 },
      { componentId: 'resistor', component: comp('resistor'), x: 60,  y: 200 },
      { componentId: 'led-red',  component: comp('led-red'),  x: 280, y: 200 },
    ],
    programBlocks: [
      { type: 'setup',  label: '⚙️ Configurar (uma vez)', color: '#2563EB', params: {} },
      { type: 'led-on', label: '💡 Acender LED',          color: '#16A34A', params: { color: 'Vermelho' } },
    ],
    tip: 'Tente trocar o LED vermelho por um verde ou azul!',
    // youtubeId not yet confirmed for this template
  },
  {
    id: 'tpl-pisca-pisca',
    name: 'Pisca-pisca',
    description: 'Faça o LED piscar como luz de Natal! Você controla a velocidade com o bloco "Esperar".',
    emoji: '✨',
    difficulty: 'fácil',
    difficultyColor: '#16A34A',
    placed: [
      { componentId: 'arduino',   component: comp('arduino'),   x: 140, y: 80 },
      { componentId: 'resistor',  component: comp('resistor'),  x: 60,  y: 200 },
      { componentId: 'led-green', component: comp('led-green'), x: 290, y: 200 },
    ],
    programBlocks: [
      { type: 'loop',      label: '🔄 Repetir sempre',  color: '#1d4ed8', params: {} },
      { type: 'led-on',    label: '💡 Acender LED',     color: '#16A34A', params: { color: 'Verde' } },
      { type: 'wait',      label: '⏱️ Esperar',         color: '#CA8A04', params: { ms: 500 } },
      { type: 'led-off',   label: '🔌 Apagar LED',      color: '#16A34A', params: { color: 'Verde' } },
      { type: 'wait',      label: '⏱️ Esperar',         color: '#CA8A04', params: { ms: 500 } },
    ],
    tip: 'Mude o tempo de espera para deixar o pisca-pisca mais rápido ou mais lento!',
    youtubeId: 'XzdBgd6Fs2o', // "PWM Arduino - Como Utilizar em LED's?" — Babos Engenharia
  },
  {
    id: 'tpl-semaforo',
    name: 'Semáforo',
    description: 'Um semáforo completo com LEDs vermelho, amarelo e verde em sequência automática!',
    emoji: '🚦',
    difficulty: 'fácil',
    difficultyColor: '#16A34A',
    placed: [
      { componentId: 'arduino',    component: comp('arduino'),    x: 160, y: 60 },
      { componentId: 'resistor',   component: comp('resistor'),   x: 40,  y: 180 },
      { componentId: 'resistor',   component: comp('resistor'),   x: 40,  y: 240 },
      { componentId: 'resistor',   component: comp('resistor'),   x: 40,  y: 300 },
      { componentId: 'led-red',    component: comp('led-red'),    x: 290, y: 150 },
      { componentId: 'led-yellow', component: comp('led-yellow'), x: 290, y: 230 },
      { componentId: 'led-green',  component: comp('led-green'),  x: 290, y: 310 },
    ],
    programBlocks: [
      { type: 'loop',     label: '🔄 Repetir sempre',  color: '#1d4ed8', params: {} },
      { type: 'led-on',   label: '💡 Acender LED',     color: '#16A34A', params: { color: 'Verde' } },
      { type: 'wait',     label: '⏱️ Esperar',         color: '#CA8A04', params: { ms: 3000 } },
      { type: 'led-off',  label: '🔌 Apagar LED',      color: '#16A34A', params: { color: 'Verde' } },
      { type: 'led-on',   label: '💡 Acender LED',     color: '#16A34A', params: { color: 'Amarelo' } },
      { type: 'wait',     label: '⏱️ Esperar',         color: '#CA8A04', params: { ms: 1000 } },
      { type: 'led-off',  label: '🔌 Apagar LED',      color: '#16A34A', params: { color: 'Amarelo' } },
      { type: 'led-on',   label: '💡 Acender LED',     color: '#16A34A', params: { color: 'Vermelho' } },
      { type: 'wait',     label: '⏱️ Esperar',         color: '#CA8A04', params: { ms: 3000 } },
      { type: 'led-off',  label: '🔌 Apagar LED',      color: '#16A34A', params: { color: 'Vermelho' } },
    ],
    tip: 'No semáforo real o verde fica mais tempo que o vermelho. Experimente mudar os tempos!',
    youtubeId: 'e9JOEy6BhrM', // "Semaforo com arduino" — Sergio Shimura
  },
  {
    id: 'tpl-alarme',
    name: 'Alarme com Botão',
    description: 'Aperte o botão e o buzzer dispara o alarme! Seu primeiro sistema de segurança.',
    emoji: '🔔',
    difficulty: 'fácil',
    difficultyColor: '#16A34A',
    placed: [
      { componentId: 'arduino', component: comp('arduino'), x: 150, y: 80 },
      { componentId: 'button',  component: comp('button'),  x: 50,  y: 220 },
      { componentId: 'buzzer',  component: comp('buzzer'),  x: 290, y: 200 },
    ],
    programBlocks: [
      { type: 'loop',         label: '🔄 Repetir sempre',        color: '#1d4ed8',  params: {} },
      { type: 'read-button',  label: '🔘 Botão Pressionado?',    color: '#EA580C',  params: {} },
      { type: 'buzzer-beep',  label: '🔊 Tocar Buzzer',          color: '#16A34A',  params: { duration: 500 } },
    ],
    tip: 'Adicione um LED vermelho para acender junto com o alarme!',
    // youtubeId not yet confirmed for this template
  },
  {
    id: 'tpl-detector-luz',
    name: 'Detector de Luz',
    description: 'O LED azul acende automaticamente quando fica escuro — como as lâmpadas de rua!',
    emoji: '☀️',
    difficulty: 'médio',
    difficultyColor: '#CA8A04',
    placed: [
      { componentId: 'arduino',  component: comp('arduino'),  x: 150, y: 80 },
      { componentId: 'ldr',      component: comp('ldr'),      x: 50,  y: 220 },
      { componentId: 'resistor', component: comp('resistor'), x: 50,  y: 300 },
      { componentId: 'led-blue', component: comp('led-blue'), x: 300, y: 200 },
    ],
    programBlocks: [
      { type: 'loop',      label: '🔄 Repetir sempre',     color: '#1d4ed8', params: {} },
      { type: 'read-ldr',  label: '☀️ Ler Sensor de Luz',  color: '#EA580C', params: {} },
      { type: 'if',        label: '🤔 Se... então...',      color: '#1d4ed8', params: {} },
      { type: 'led-on',    label: '💡 Acender LED',         color: '#16A34A', params: { color: 'Azul' } },
    ],
    tip: 'Experimente trocar o LED azul por um amarelo para simular uma lâmpada de rua!',
    youtubeId: 'pazcH1jI1qU', // "Projeto: Acionando LED com sensor de Luminosidade LDR" — InovaEdutech
  },
  {
    id: 'tpl-termometro',
    name: 'Termômetro de LEDs',
    description: 'Frio = LED azul, quente = LED vermelho! O sensor de temperatura muda a cor.',
    emoji: '🌡️',
    difficulty: 'médio',
    difficultyColor: '#CA8A04',
    placed: [
      { componentId: 'arduino',  component: comp('arduino'),  x: 150, y: 60 },
      { componentId: 'temp',     component: comp('temp'),     x: 50,  y: 200 },
      { componentId: 'resistor', component: comp('resistor'), x: 50,  y: 290 },
      { componentId: 'resistor', component: comp('resistor'), x: 50,  y: 350 },
      { componentId: 'led-red',  component: comp('led-red'),  x: 310, y: 170 },
      { componentId: 'led-blue', component: comp('led-blue'), x: 310, y: 270 },
    ],
    programBlocks: [
      { type: 'loop',      label: '🔄 Repetir sempre',      color: '#1d4ed8', params: {} },
      { type: 'read-temp', label: '🌡️ Ler Temperatura',     color: '#EA580C', params: {} },
      { type: 'if',        label: '🤔 Se... então...',       color: '#1d4ed8', params: {} },
      { type: 'led-on',    label: '💡 Acender LED Vermelho', color: '#16A34A', params: { color: 'Vermelho' } },
      { type: 'led-on',    label: '💡 Acender LED Azul',     color: '#16A34A', params: { color: 'Azul' } },
    ],
    tip: 'Adicione um LED amarelo para temperatura morna (entre frio e quente)!',
    // youtubeId not yet confirmed for this template
  },
  {
    id: 'tpl-motor',
    name: 'Motor Controlado',
    description: 'Um motor girando com velocidade ajustável. A base de qualquer robô com rodas!',
    emoji: '⚙️',
    difficulty: 'médio',
    difficultyColor: '#CA8A04',
    placed: [
      { componentId: 'arduino', component: comp('arduino'), x: 150, y: 80 },
      { componentId: 'battery', component: comp('battery'), x: 50,  y: 220 },
      { componentId: 'motor',   component: comp('motor'),   x: 300, y: 200 },
    ],
    programBlocks: [
      { type: 'setup',       label: '⚙️ Configurar (uma vez)',    color: '#2563EB', params: {} },
      { type: 'motor-speed', label: '⚙️ Velocidade do Motor',     color: '#16A34A', params: { speed: 75 } },
      { type: 'wait',        label: '⏱️ Esperar',                 color: '#CA8A04', params: { ms: 2000 } },
      { type: 'motor-speed', label: '⚙️ Velocidade do Motor',     color: '#16A34A', params: { speed: 0 } },
    ],
    tip: 'Mude o valor da velocidade de 0 a 100 e veja a diferença!',
    youtubeId: 'gQKl0bApji4', // "PWM Arduino - Como controlar rotação de um Motor DC" — Babos Engenharia
  },
  {
    id: 'tpl-robo-sensor',
    name: 'Robô Sensor',
    description: 'O sensor ultrassônico detecta obstáculos e o motor para automaticamente. Autonomia real!',
    emoji: '🤖',
    difficulty: 'avançado',
    difficultyColor: '#DC2626',
    placed: [
      { componentId: 'arduino',    component: comp('arduino'),    x: 160, y: 70 },
      { componentId: 'ultrasonic', component: comp('ultrasonic'), x: 40,  y: 200 },
      { componentId: 'battery',    component: comp('battery'),    x: 40,  y: 320 },
      { componentId: 'motor',      component: comp('motor'),      x: 310, y: 180 },
      { componentId: 'motor',      component: comp('motor'),      x: 310, y: 300 },
    ],
    programBlocks: [
      { type: 'loop',          label: '🔄 Repetir sempre',      color: '#1d4ed8', params: {} },
      { type: 'read-distance', label: '📡 Ler Distância',       color: '#EA580C', params: {} },
      { type: 'if',            label: '🤔 Se... então...',       color: '#1d4ed8', params: {} },
      { type: 'motor-speed',   label: '⚙️ Parar Motor',         color: '#16A34A', params: { speed: 0 } },
      { type: 'motor-speed',   label: '⚙️ Motor em Movimento',  color: '#16A34A', params: { speed: 80 } },
    ],
    tip: 'Tente adicionar um buzzer para apitar quando detectar obstáculo!',
    youtubeId: 'BFAWsqHiRPE', // "Sensor Ultrassônico Arduino Em Funcionamento" — Babos Engenharia
  },
];
