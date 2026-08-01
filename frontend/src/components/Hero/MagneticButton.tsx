import gsap from 'gsap';
import type { MouseEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';

type Ripple = {
  id: number;
  left: number;
  size: number;
  top: number;
};

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'quiet';
};

const variantClasses = {
  primary:
    'border-transparent bg-slate-950 text-white shadow-xl shadow-cyan-900/20 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100',
  quiet:
    'border-slate-200 bg-white/70 text-slate-900 shadow-lg shadow-slate-900/5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15',
  secondary:
    'border-cyan-300/60 bg-cyan-50 text-cyan-950 shadow-lg shadow-cyan-900/10 hover:bg-cyan-100 dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-100 dark:hover:bg-cyan-300/15',
};

export function MagneticButton({
  children,
  className = '',
  href,
  icon,
  variant = 'primary',
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    const element = buttonRef.current;

    if (!element || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.28;

    gsap.to(element, { duration: 0.35, ease: 'power3.out', x, y });
  }

  function handleMouseLeave() {
    const element = buttonRef.current;

    if (element) {
      gsap.to(element, { duration: 0.45, ease: 'elastic.out(1, 0.35)', x: 0, y: 0 });
    }
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;
    const id = Date.now();

    setRipples((current) => [
      ...current,
      {
        id,
        left: event.clientX - rect.left - size / 2,
        size,
        top: event.clientY - rect.top - size / 2,
      },
    ]);

    window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
    }, 650);
  }

  return (
    <a
      className={`relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md border px-5 text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      data-cursor="magnetic"
      href={href}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={buttonRef}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
      {ripples.map((ripple) => (
        <span
          className="pointer-events-none absolute rounded-full bg-white/40 ripple"
          key={ripple.id}
          style={{
            height: ripple.size,
            left: ripple.left,
            top: ripple.top,
            width: ripple.size,
          }}
        />
      ))}
    </a>
  );
}

