import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';

import { BrandLogo } from '@/components/BrandLogo';
import { APP_NAME } from '@/constants/app';
import { navItems } from '@/constants/landing';

const socialLinks = [
  { href: '#contact', icon: FiLinkedin, label: 'LinkedIn' },
  { href: '#contact', icon: FiTwitter, label: 'Twitter' },
  { href: '#contact', icon: FiGithub, label: 'GitHub' },
  { href: 'mailto:hello@aihirepro.example', icon: FiMail, label: 'Email' },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <a className="inline-flex items-center gap-3" href="#home">
            <BrandLogo />
            <span className="text-lg font-bold text-slate-950 dark:text-white">{APP_NAME}</span>
          </a>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            A premium AI hiring foundation for talent discovery, company storytelling, and scalable
            product development.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-normal text-slate-500 dark:text-slate-400">
              Explore
            </h3>
            <div className="mt-4 grid gap-3">
              {navItems.map((item) => (
                <a
                  className="text-sm font-medium text-slate-600 transition hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-200"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div id="contact">
            <h3 className="text-sm font-bold uppercase tracking-normal text-slate-500 dark:text-slate-400">
              Contact
            </h3>
            <div className="mt-4 flex gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    aria-label={item.label}
                    className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-200 dark:hover:text-cyan-200"
                    href={item.href}
                    key={item.label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-slate-200 px-4 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:border-white/10 dark:text-slate-400">
        <span>© 2026 AIHire Pro. All rights reserved.</span>
        <span>Built for enterprise hiring teams.</span>
      </div>
    </footer>
  );
}
