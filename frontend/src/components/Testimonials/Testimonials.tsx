import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from 'react-icons/fi';

import { testimonials } from '@/constants/landing';

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = testimonials[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }

  return (
    <section className="py-20" id="about">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            Trusted signal
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
            Built for teams who care about every hiring interaction.
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
          <AnimatePresence mode="wait">
            <motion.figure
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              initial={{ opacity: 0, x: 28 }}
              key={testimonial.name}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <FiMessageSquare aria-hidden="true" className="size-8 text-cyan-600 dark:text-cyan-300" />
              <blockquote className="mt-6 text-2xl font-semibold leading-10 tracking-normal text-slate-950 dark:text-white">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <div className="font-bold text-slate-950 dark:text-white">{testimonial.name}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {testimonial.role}
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {testimonials.map((item, index) => (
                <button
                  aria-label={`Show testimonial from ${item.name}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? 'w-8 bg-cyan-600 dark:bg-cyan-300'
                      : 'w-2.5 bg-slate-300 dark:bg-white/20'
                  }`}
                  key={item.name}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                aria-label="Previous testimonial"
                className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-100"
                onClick={showPrevious}
                type="button"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button
                aria-label="Next testimonial"
                className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-100"
                onClick={showNext}
                type="button"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

