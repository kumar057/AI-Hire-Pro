import type { MouseEvent } from 'react';
import { useRef } from 'react';

export function useTiltCard(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const element = ref.current;

    if (!element || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const rotateY = ((offsetX / rect.width) - 0.5) * maxTilt;
    const rotateX = ((offsetY / rect.height) - 0.5) * -maxTilt;

    element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  }

  function handleMouseLeave() {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
  }

  return {
    ref,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
  };
}

