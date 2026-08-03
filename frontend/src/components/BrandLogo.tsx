import logo from '@/assets/aihire-pro-logo.jpg';

export function BrandLogo({ className = 'size-10' }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-lg bg-white ${className}`}
    >
      <img
        alt="AIHire Pro"
        className="h-full w-full scale-[1.8] object-cover dark:invert"
        src={logo}
      />
    </span>
  );
}
