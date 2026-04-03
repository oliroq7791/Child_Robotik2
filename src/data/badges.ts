export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  condition: string;
}

export const BADGES: Badge[] = [
  { id: 'first-circuit', name: 'Primeiro Circuito', description: 'Monte seu primeiro circuito completo!', emoji: '🔌', color: '#2563EB', condition: 'complete_mission_1' },
  { id: 'light-genius', name: 'Gênio da Luz', description: 'Complete todas as missões do Mundo 1!', emoji: '💡', color: '#CA8A04', condition: 'complete_world_1' },
  { id: 'builder', name: 'Construtor', description: 'Complete todas as missões do Mundo 2!', emoji: '🤖', color: '#16A34A', condition: 'complete_world_2' },
  { id: 'engineer', name: 'Engenheiro', description: 'Complete todas as missões do Mundo 3!', emoji: '⚡', color: '#EA580C', condition: 'complete_world_3' },
  { id: 'master', name: 'Mestre Robótico', description: 'Complete todas as missões!', emoji: '🏆', color: '#7C3AED', condition: 'complete_all' },
  { id: 'streak-7', name: 'Sequência Incrível', description: 'Entre por 7 dias seguidos!', emoji: '🔥', color: '#DC2626', condition: 'streak_7' },
  { id: 'speedster', name: 'Velocista', description: 'Complete uma missão em menos de 3 minutos!', emoji: '⚡', color: '#CA8A04', condition: 'speed_3min' },
  { id: 'no-errors', name: 'Sem Erros', description: 'Complete uma missão sem nenhum erro!', emoji: '🧠', color: '#16A34A', condition: 'no_errors' },
  { id: 'sensor-master', name: 'Mestre dos Sensores', description: 'Use 5 tipos diferentes de sensores!', emoji: '📡', color: '#0891B2', condition: 'use_5_sensors' },
  { id: 'curious', name: 'Curioso Nato', description: 'Leia 10 curiosidades sobre componentes!', emoji: '🔬', color: '#7C3AED', condition: 'read_10_facts' },
];

export const XP_LEVELS = [
  { level: 1, name: 'Aprendiz', minXP: 0, maxXP: 200, color: '#64748b' },
  { level: 2, name: 'Inventor', minXP: 200, maxXP: 500, color: '#2563EB' },
  { level: 3, name: 'Engenheiro', minXP: 500, maxXP: 1000, color: '#16A34A' },
  { level: 4, name: 'Mestre Robótico', minXP: 1000, maxXP: 2000, color: '#EA580C' },
  { level: 5, name: 'Lenda da Robótica', minXP: 2000, maxXP: Infinity, color: '#7C3AED' },
];

export function getLevelFromXP(xp: number) {
  return XP_LEVELS.findLast(l => xp >= l.minXP) ?? XP_LEVELS[0];
}
