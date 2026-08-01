import type { PropsWithChildren } from 'react';

import { APP_NAME } from '@/constants/app';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a className="text-lg font-semibold tracking-normal" href="/">
            {APP_NAME}
          </a>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-normal text-slate-600">
            Foundation
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

