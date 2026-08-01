import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

import { faqs } from '@/constants/landing';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
            Clear answers before the build grows.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question}>
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  type="button"
                >
                  <span className="text-base font-bold text-slate-950 dark:text-white">
                    {item.question}
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-200">
                    {isOpen ? <FiMinus aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: 'easeOut' }}
                    >
                      <p className="px-5 pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

