import type { PlacedComponent, Wire } from '../store/assemblyStore';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  tips: string[];
  activeComponents: string[]; // instanceIds that should activate
}

export function validateCircuit(placed: PlacedComponent[], wires: Wire[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const tips: string[] = [];
  const activeComponents: string[] = [];

  if (placed.length === 0) {
    return { valid: false, errors: ['Adicione pelo menos um componente!'], warnings: [], tips: ['💡 Arraste componentes da paleta para começar!'], activeComponents: [] };
  }

  const hasController = placed.some(p => p.component.category === 'controllers');
  const hasLed = placed.some(p => p.componentId.startsWith('led-'));
  const hasResistor = placed.some(p => p.componentId === 'resistor');
  const hasMotor = placed.some(p => p.componentId === 'motor');
  const hasBuzzer = placed.some(p => p.componentId === 'buzzer');
  const hasButton = placed.some(p => p.componentId === 'button');
  const hasUltrasonic = placed.some(p => p.componentId === 'ultrasonic');
  const hasServo = placed.some(p => p.componentId === 'servo');
  const hasBattery = placed.some(p => p.componentId === 'battery');
  const hasLdr = placed.some(p => p.componentId === 'ldr');
  const hasTemp = placed.some(p => p.componentId === 'temp');

  // Check LED without resistor (pedagogical rule)
  if (hasLed && !hasResistor) {
    errors.push('❌ O LED não tem resistor! Adicione um resistor de 220Ω para protegê-lo.');
    tips.push('💡 Sempre use um resistor com LEDs para não queimá-los!');
    return { valid: false, errors, warnings, tips, activeComponents };
  }

  // Check invalid wires
  const invalidWires = wires.filter(w => !w.valid);
  if (invalidWires.length > 0) {
    errors.push('⚠️ Há conexões inválidas no circuito! Verifique os fios.');
  }

  if (!hasController && placed.length > 0) {
    warnings.push('⚠️ Adicione um Arduino ou RoboKid para controlar o circuito!');
  }

  // Determine active components based on what's placed
  if (hasController) {
    if (hasLed && hasResistor) {
      const leds = placed.filter(p => p.componentId.startsWith('led-'));
      leds.forEach(led => activeComponents.push(led.instanceId));
      tips.push('💡 Dica: O fio vermelho sempre vai para o positivo (+)!');
    }
    if (hasMotor && (hasBattery || hasController)) {
      const motors = placed.filter(p => p.componentId === 'motor');
      motors.forEach(m => activeComponents.push(m.instanceId));
    }
    if (hasBuzzer) {
      const buzzers = placed.filter(p => p.componentId === 'buzzer');
      if (hasButton) buzzers.forEach(b => activeComponents.push(b.instanceId));
    }
    if (hasServo) {
      const servos = placed.filter(p => p.componentId === 'servo');
      servos.forEach(s => activeComponents.push(s.instanceId));
    }
    if (hasUltrasonic) {
      const sonars = placed.filter(p => p.componentId === 'ultrasonic');
      sonars.forEach(s => activeComponents.push(s.instanceId));
    }
    if (hasLdr) activeComponents.push(...placed.filter(p => p.componentId === 'ldr').map(p => p.instanceId));
    if (hasTemp) activeComponents.push(...placed.filter(p => p.componentId === 'temp').map(p => p.instanceId));
  }

  const valid = errors.length === 0 && hasController;
  if (!valid && !hasController) {
    errors.push('❌ Precisa de um Arduino ou RoboKid para funcionar!');
  }

  return { valid, errors, warnings, tips, activeComponents };
}

export function detectMissionSuccess(placed: PlacedComponent[], missionId: string): boolean {
  const ids = placed.map(p => p.componentId);
  const has = (id: string) => ids.includes(id);

  switch (missionId) {
    case 'mission-1': return has('arduino') && ids.some(i => i.startsWith('led-')) && has('resistor');
    case 'mission-2': return has('arduino') && ids.some(i => i.startsWith('led-')) && has('resistor');
    case 'mission-3': return has('arduino') && has('led-red') && has('led-yellow') && has('led-green') && has('resistor');
    case 'mission-4': return has('arduino') && has('ldr') && ids.some(i => i.startsWith('led-')) && has('resistor');
    case 'mission-5': return has('arduino') && has('button') && has('buzzer');
    case 'mission-6': return has('arduino') && has('temp') && ids.some(i => i.startsWith('led-')) && has('resistor');
    case 'mission-7': return has('arduino') && has('motor');
    case 'mission-8': return has('arduino') && has('ultrasonic') && has('motor');
    case 'mission-9': return has('arduino') && has('servo');
    case 'mission-10': return has('arduino') && has('ldr') && has('motor');
    case 'mission-11': return has('arduino') && has('ultrasonic') && has('ldr') && has('temp') && has('motor');
    case 'mission-12': return placed.length >= 3;
    default: return false;
  }
}
