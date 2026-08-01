import { motion } from 'framer-motion';
import { useMemo } from 'react';

type Particle = {
  delay: number;
  duration: number;
  left: string;
  opacity: number;
  size: number;
  top: string;
};

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 913.17 + salt * 37.91) * 10000;
  return value - Math.floor(value);
}

export function Particles() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        delay: seededValue(index, 2) * 2,
        duration: 4 + seededValue(index, 3) * 5,
        left: `${seededValue(index, 5) * 100}%`,
        opacity: 0.28 + seededValue(index, 7) * 0.42,
        size: 3 + seededValue(index, 11) * 5,
        top: `${seededValue(index, 13) * 100}%`,
      })),
    [],
  );

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <motion.span
          animate={{
            opacity: [particle.opacity * 0.35, particle.opacity, particle.opacity * 0.35],
            scale: [0.8, 1.35, 0.8],
            y: [-12, 18, -12],
          }}
          className="absolute rounded-full bg-slate-900/30 shadow-[0_0_18px_rgba(20,184,166,0.45)] dark:bg-white/60"
          key={`${particle.left}-${particle.top}-${index}`}
          style={{
            height: particle.size,
            left: particle.left,
            top: particle.top,
            width: particle.size,
          }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

