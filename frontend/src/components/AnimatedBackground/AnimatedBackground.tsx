import gsap from 'gsap';
import { useEffect, useRef } from 'react';

import { Particles } from '@/components/Particles/Particles';

export function AnimatedBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.to('.mesh-field-a', {
        backgroundPosition: '100% 50%',
        duration: 14,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to('.mesh-field-b', {
        rotate: 10,
        scale: 1.06,
        x: 26,
        y: -18,
        duration: 9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to('.mesh-field-c', {
        rotate: -8,
        scale: 1.08,
        x: -22,
        y: 20,
        duration: 11,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, layerRef);

    return () => context.revert();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 isolate overflow-hidden"
      ref={layerRef}
    >
      <div className="mesh-field-a absolute inset-0 bg-[length:180%_180%] opacity-95" />
      <div className="mesh-field-b absolute -left-24 top-12 h-[34rem] w-[34rem] rounded-[45%] blur-3xl" />
      <div className="mesh-field-c absolute -bottom-40 right-0 h-[38rem] w-[38rem] rounded-[42%] blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40 dark:bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-slate-50 dark:from-slate-950/40 dark:to-slate-950" />
      <Particles />
    </div>
  );
}

