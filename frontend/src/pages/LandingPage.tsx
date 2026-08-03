import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiArrowRight, FiBell, FiCheckCircle, FiMail } from 'react-icons/fi';

import { CompanyCard } from '@/components/CompanyCard/CompanyCard';
import { BrandLogo } from '@/components/BrandLogo';
import { CursorFollower } from '@/components/CursorFollower/CursorFollower';
import { FAQ } from '@/components/FAQ/FAQ';
import { Footer } from '@/components/Footer/Footer';
import { Hero } from '@/components/Hero/Hero';
import { JobCard } from '@/components/JobCard/JobCard';
import { MagneticButton } from '@/components/Hero/MagneticButton';
import { Navbar } from '@/components/Navbar/Navbar';
import { Stats } from '@/components/Stats/Stats';
import { Testimonials } from '@/components/Testimonials/Testimonials';
import {
  aiFeatures,
  featuredCompanies,
  jobCategories,
  latestJobs,
} from '@/constants/landing';

type NewsletterFormValues = {
  email: string;
};

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div
      className="mx-auto max-w-2xl text-center"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.35 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
    </motion.div>
  );
}

function FeaturedCompaniesSection() {
  return (
    <section className="py-20" id="companies">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          description="A polished company marketplace foundation with responsive cards, premium hover states, and room for richer employer profiles."
          eyebrow="Featured companies"
          title="Standout teams with meaningful opportunities."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCompanies.map((company, index) => (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              key={company.name}
              transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.25 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <CompanyCard company={company} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestJobsSection() {
  return (
    <section className="bg-slate-100/80 py-20 dark:bg-slate-900/50" id="jobs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            description="A professional card system for role discovery, match scores, skills, compensation, and future application actions."
            eyebrow="Latest jobs"
            title="High-signal roles, presented with clarity."
          />
          <MagneticButton href="#newsletter" icon={<FiArrowRight aria-hidden="true" />} variant="secondary">
            Get alerts
          </MagneticButton>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {latestJobs.map((job, index) => (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              key={job.title}
              transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.25 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JobCategoriesSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          description="A flexible category grid for browsing by discipline, seniority, location, or future AI-curated career paths."
          eyebrow="Categories"
          title="Explore work by the shape of your craft."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.article
                className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-300/40"
                initial={{ opacity: 0, y: 22 }}
                key={category.name}
                transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.25 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-lg bg-slate-100 text-slate-800 transition group-hover:bg-cyan-100 group-hover:text-cyan-800 dark:bg-white/10 dark:text-white dark:group-hover:bg-cyan-300/15 dark:group-hover:text-cyan-200">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {category.roles}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {category.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AIFeaturesSection() {
  return (
    <section className="relative overflow-hidden py-20" id="ai">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          description="The visual system is prepared for transparent matching, explainability, trust controls, and enterprise-scale personalization."
          eyebrow="AI features"
          title="Intelligence that feels calm, useful, and accountable."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                className="glass-card rounded-lg border border-white/50 bg-white/65 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
                initial={{ opacity: 0, y: 22 }}
                key={feature.title}
                transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.25 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <span className="grid size-12 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [message, setMessage] = useState('Join the private launch list.');
  const { handleSubmit, register, reset } = useForm<NewsletterFormValues>({
    defaultValues: { email: '' },
  });

  function submitNewsletter(values: NewsletterFormValues) {
    setMessage(`${values.email} is on the launch list.`);
    reset();
  }

  return (
    <section className="py-20" id="newsletter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-lg bg-slate-950 p-6 text-white shadow-2xl shadow-cyan-950/20 sm:p-10 dark:bg-white dark:text-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,184,166,0.28),transparent_34%),linear-gradient(300deg,rgba(251,191,36,0.24),transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold dark:bg-slate-950/10">
                <FiBell aria-hidden="true" />
                Career signal, not inbox noise
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl">
                Get early access to AI-ranked opportunities.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 dark:text-slate-700">
                Product announcements, curated roles, and launch updates for candidates and hiring
                teams.
              </p>
            </div>

            <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSubmit(submitNewsletter)}>
              <label className="flex h-14 items-center gap-3 rounded-md border border-white/15 bg-white/10 px-4 dark:border-slate-950/10 dark:bg-slate-950/5">
                <FiMail aria-hidden="true" className="shrink-0" />
                <input
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/55 dark:text-slate-950 dark:placeholder:text-slate-500"
                  placeholder="you@company.com"
                  type="email"
                  {...register('email', { required: true })}
                />
              </label>
              <button
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-100 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                type="submit"
              >
                <FiCheckCircle aria-hidden="true" />
                Notify me
              </button>
              <p className="text-sm font-medium text-white/70 sm:col-span-2 dark:text-slate-600">{message}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingOverlay() {
  return (
    <motion.div
      animate={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] grid place-items-center bg-slate-950 text-white"
      exit={{ opacity: 0 }}
      initial={{ opacity: 1 }}
      transition={{ delay: 0.55, duration: 0.4 }}
    >
      <motion.div
        animate={{ scale: [0.95, 1.04, 1], y: [8, -4, 0] }}
        className="flex items-center gap-3"
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <BrandLogo className="size-11" />
        <span className="text-xl font-bold tracking-normal">AIHire Pro</span>
      </motion.div>
    </motion.div>
  );
}

export function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      {isLoading ? <LoadingOverlay /> : null}
      <motion.div
        className="fixed left-0 top-0 z-[9997] h-1 origin-left bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300"
        style={{ scaleX: progressScale, width: '100%' }}
      />
      <CursorFollower />
      <Navbar />
      <main>
        <Hero />
        <FeaturedCompaniesSection />
        <LatestJobsSection />
        <JobCategoriesSection />
        <Stats />
        <AIFeaturesSection />
        <Testimonials />
        <FAQ />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
