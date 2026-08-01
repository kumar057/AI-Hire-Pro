import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = dotRef.current;
    const glow = glowRef.current;

    if (!dot || !glow) {
      return;
    }

    const moveDotX = gsap.quickTo(dot, 'x', { duration: 0.18, ease: 'power3.out' });
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.18, ease: 'power3.out' });
    const moveGlowX = gsap.quickTo(glow, 'x', { duration: 0.55, ease: 'power3.out' });
    const moveGlowY = gsap.quickTo(glow, 'y', { duration: 0.55, ease: 'power3.out' });

    function handleMove(event: MouseEvent) {
      moveDotX(event.clientX);
      moveDotY(event.clientY);
      moveGlowX(event.clientX);
      moveGlowY(event.clientY);
    }

    function handlePointerDown() {
      gsap.to(dot, { duration: 0.16, scale: 0.72 });
      gsap.to(glow, { duration: 0.16, scale: 0.82 });
    }

    function handlePointerUp() {
      gsap.to(dot, { duration: 0.3, ease: 'back.out(2)', scale: 1 });
      gsap.to(glow, { duration: 0.35, ease: 'back.out(1.4)', scale: 1 });
    }

    function handleInteractiveEnter() {
      gsap.to(dot, { duration: 0.22, scale: 1.8 });
      gsap.to(glow, { duration: 0.22, opacity: 0.55, scale: 1.45 });
    }

    function handleInteractiveLeave() {
      gsap.to(dot, { duration: 0.22, scale: 1 });
      gsap.to(glow, { duration: 0.22, opacity: 0.32, scale: 1 });
    }

    const interactiveElements = document.querySelectorAll(
      'a, button, input, [data-cursor="magnetic"], [data-tilt-card]',
    );

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', handleInteractiveEnter);
      element.addEventListener('mouseleave', handleInteractiveLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      interactiveElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleInteractiveEnter);
        element.removeEventListener('mouseleave', handleInteractiveLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-slate-950/80 shadow-[0_0_20px_rgba(20,184,166,0.7)] md:block dark:bg-white/80"
        ref={dotRef}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/30 blur-2xl md:block dark:bg-teal-300/20"
        ref={glowRef}
      />
    </>
  );
}

