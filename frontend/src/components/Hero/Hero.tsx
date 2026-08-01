import gsap from 'gsap';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiArrowRight, FiBriefcase, FiMapPin, FiSearch, FiStar } from 'react-icons/fi';

import { AnimatedBackground } from '@/components/AnimatedBackground/AnimatedBackground';
import { MagneticButton } from '@/components/Hero/MagneticButton';
import { floatingIcons, heroSignals } from '@/constants/landing';

type SearchFormValues = {
  keyword: string;
  location: string;
};

export function Hero() {
  const floatingRef = useRef<HTMLDivElement>(null);
  const [searchMessage, setSearchMessage] = useState('AI-ranked roles are ready to explore.');
  const { handleSubmit, register } = useForm<SearchFormValues>({
    defaultValues: {
      keyword: '',
      location: '',
    },
  });

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.to('.floating-object', {
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        stagger: 0.22,
        y: -16,
        yoyo: true,
      });
    }, floatingRef);

    return () => context.revert();
  }, []);

  function submitSearch(values: SearchFormValues) {
    const hasIntent = values.keyword.trim().length > 0 || values.location.trim().length > 0;
    setSearchMessage(hasIntent ? 'Smart matches are being curated.' : 'Start with a role or city.');
  }

  return (
    <section
      className="relative isolate flex min-h-screen items-center overflow-hidden pt-24 text-slate-950 dark:text-white"
      id="home"
    >
      <AnimatedBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-20">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 rounded-md border border-white/60 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-cyan-100">
            <FiStar aria-hidden="true" className="text-cyan-600 dark:text-cyan-300" />
            AI-powered hiring intelligence
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            Find the role where your next chapter accelerates.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-200">
            AIHire Pro connects ambitious talent with high-signal opportunities through smart
            matching, crisp discovery, and a premium search experience.
          </p>

          <form
            className="mt-8 grid gap-3 rounded-lg border border-white/70 bg-white/80 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:grid-cols-[1fr_1fr_auto] dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20"
            onSubmit={handleSubmit(submitSearch)}
          >
            <label className="flex min-h-14 items-center gap-3 rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <FiBriefcase aria-hidden="true" className="size-5 text-cyan-600 dark:text-cyan-300" />
              <input
                className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder="Job title or keyword"
                type="text"
                {...register('keyword')}
              />
            </label>
            <label className="flex min-h-14 items-center gap-3 rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <FiMapPin aria-hidden="true" className="size-5 text-emerald-600 dark:text-emerald-300" />
              <input
                className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder="Location"
                type="text"
                {...register('location')}
              />
            </label>
            <button
              className="inline-flex min-h-14 items-center justify-center gap-2 overflow-hidden rounded-md bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/20 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              data-cursor="magnetic"
              type="submit"
            >
              <FiSearch aria-hidden="true" />
              Search Jobs
            </button>
          </form>

          <div className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            {searchMessage}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticButton href="#jobs" icon={<FiSearch aria-hidden="true" />}>
              Explore jobs
            </MagneticButton>
            <MagneticButton href="#companies" icon={<FiArrowRight aria-hidden="true" />} variant="quiet">
              Meet companies
            </MagneticButton>
          </div>
        </motion.div>

        <div className="relative min-h-[32rem]" ref={floatingRef}>
          <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/30 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5" />
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative mx-auto mt-6 max-w-md rounded-lg border border-white/70 bg-white/85 p-5 shadow-2xl shadow-slate-900/15 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/30"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
                  Match preview
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
                  Senior Product Engineer
                </h2>
              </div>
              <span className="rounded-md bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-300/15 dark:text-emerald-200">
                97%
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              {heroSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                    key={signal.label}
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <Icon aria-hidden="true" className="text-cyan-600 dark:text-cyan-300" />
                      {signal.label}
                    </span>
                    <span className="text-sm font-bold text-slate-950 dark:text-white">{signal.value}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {floatingIcons.map((Icon, index) => {
            const positions = [
              'left-2 top-8',
              'right-3 top-16',
              'left-8 bottom-24',
              'right-10 bottom-12',
              'left-1/2 top-0',
            ];

            return (
              <div
                className={`floating-object absolute ${positions[index]} grid size-14 place-items-center rounded-lg border border-white/60 bg-white/80 text-slate-900 shadow-xl shadow-slate-900/10 backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-white`}
                key={index}
              >
                <Icon aria-hidden="true" className="size-6" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
