import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../store/progressStore';

const STEPS = [
  {
    emoji: '🤖',
    title: 'Olá! Eu sou o RoboKit!',
    text: 'Vou te ensinar robótica de um jeito divertido! Juntos vamos montar circuitos, programar e criar robôs incríveis!',
    action: null,
  },
  {
    emoji: '🧩',
    title: 'Paleta de Componentes',
    text: 'Aqui na esquerda você encontra todos os componentes: Arduino, LEDs, sensores, motores e muito mais! Arraste para a área de montagem!',
    action: 'Veja a paleta ↖️',
  },
  {
    emoji: '🔧',
    title: 'Área de Montagem',
    text: 'Esta é a sua bancada de trabalho! Arraste componentes aqui, posicione-os e conecte com fios. É como montar LEGO eletrônico!',
    action: 'Arraste um componente! ↙️',
  },
  {
    emoji: '🧩',
    title: 'Blocos de Código',
    text: 'Abaixo da área de montagem você cria o programa do seu robô com blocos coloridos! Sem precisar saber programar de verdade!',
    action: 'Adicione um bloco! ↙️',
  },
  {
    emoji: '▶️',
    title: 'Simule e Veja Funcionar!',
    text: 'Quando terminar, clique em ▶ Simular no painel direito e veja seu circuito ganhar vida! Boa sorte, inventor(a)! 🚀',
    action: 'Clique em Simular! →',
  },
];

export default function OnboardingTutorial() {
  const [step, setStep] = useState(0);
  const { finishOnboarding } = useProgressStore();

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else finishOnboarding();
  };

  const current = STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-slate-900 border-2 border-blue-500 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-blue-500/20"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            {current.emoji}
          </motion.div>

          <h2 className="text-xl font-black text-white mb-3">{current.title}</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">{current.text}</p>

          {current.action && (
            <div className="bg-blue-500/20 border border-blue-500/40 rounded-xl px-4 py-2 mb-6">
              <p className="text-blue-300 text-sm font-bold">👉 {current.action}</p>
            </div>
          )}

          {/* Step dots */}
          <div className="flex justify-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-blue-400 w-5' : 'bg-slate-600'}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={finishOnboarding}
              className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-xl text-sm transition-colors"
            >
              Pular Tutorial
            </button>
            <button
              onClick={next}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-sm transition-colors"
            >
              {step === STEPS.length - 1 ? '🚀 Começar!' : 'Próximo →'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
