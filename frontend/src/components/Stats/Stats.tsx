import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

import type { Stat } from '@/constants/landing';
import { stats } from '@/constants/landing';

type CounterProps = {
  stat: Stat;
};

function Counter({ stat }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        const value = { current: 0 };
        gsap.to(value, {
          current: stat.value,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => setCount(Math.round(value.current)),
        });
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <div
      className="rounded-lg border border-white/40 bg-white/70 p-5 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      ref={ref}
    >
      <div className="text-4xl font-bold tracking-normal text-slate-950 dark:text-white">
        {count}
        {stat.suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{stat.label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="relative py-16">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <Counter key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}

