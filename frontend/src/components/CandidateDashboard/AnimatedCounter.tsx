import { useEffect, useState } from 'react';

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
};

export function AnimatedCounter({ suffix = '', value }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 36;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / 900, 1);
      const easedProgress = 1 - (1 - progress) ** 3;

      frame += 1;
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1 && frame < totalFrames) {
        requestAnimationFrame(animate);
      }
    }

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <span>
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
