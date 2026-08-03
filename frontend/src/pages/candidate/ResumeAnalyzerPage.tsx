import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiActivity,
  FiBarChart2,
  FiDownload,
  FiRefreshCw,
  FiShare2,
  FiTarget,
  FiZap,
} from 'react-icons/fi';

import { DashboardSkeleton } from '@/components/CandidateDashboard/DashboardSkeleton';
import { InsightList } from '@/components/ResumeAnalysis/InsightList';
import { MetricBar } from '@/components/ResumeAnalysis/MetricBar';
import { ResumeRadarChart } from '@/components/ResumeAnalysis/ResumeRadarChart';
import { ScoreRing } from '@/components/ResumeAnalysis/ScoreRing';
import { resumeAnalysisService } from '@/services/resumeAnalysisService';
import type { ResumeAnalysisReport } from '@/types/resumeAnalysis';

const containerAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardAnimation = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42 } },
};

export function ResumeAnalyzerPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState<ResumeAnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadReport = useCallback(async () => {
    try {
      setReport(await resumeAnalysisService.getReport());
    } catch {
      toast.error('Unable to load the resume report.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  useEffect(() => {
    if (!report || !pageRef.current) return;
    const context = gsap.context(() => {
      gsap.from('[data-score]', {
        scale: 0.88,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'back.out(1.4)',
      });
    }, pageRef);
    return () => context.revert();
  }, [report]);

  async function runAnalysis() {
    setIsAnalyzing(true);
    try {
      setReport(await resumeAnalysisService.analyze());
      toast.success('Dummy resume analysis completed.');
    } catch {
      toast.error('Unable to analyze the resume.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (isLoading) return <DashboardSkeleton />;

  if (!report) {
    return (
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-slate-900/70">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Resume report unavailable</h1>
        <button className="mt-5 rounded-lg bg-cyan-600 px-4 py-2 font-bold text-white" onClick={() => void loadReport()} type="button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      animate="visible"
      className="mt-6 space-y-6"
      initial="hidden"
      ref={pageRef}
      variants={containerAnimation}
    >
      <motion.header
        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/70"
        variants={cardAnimation}
      >
        <div className="border-b border-slate-200 p-5 dark:border-white/10 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase text-cyan-700 dark:text-cyan-300">
              <FiZap className="size-4" /> AI Resume Analyzer
            </div>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">Resume intelligence report</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {report.resume_name} / Dummy analysis generated Aug 3, 2026
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 sm:mt-0">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
              onClick={() => toast('Report download will be available with AI integration.')}
              type="button"
            >
              <FiDownload /> Download
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
              onClick={() => toast('Secure report sharing is coming soon.')}
              type="button"
            >
              <FiShare2 /> Share
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isAnalyzing}
              onClick={() => void runAnalysis()}
              type="button"
            >
              <FiRefreshCw className={isAnalyzing ? 'animate-spin' : ''} />
              {isAnalyzing ? 'Analyzing' : 'Analyze again'}
            </button>
          </div>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-3" data-score>
          <ScoreRing label="ATS Score" score={report.ats_score} />
          <ScoreRing label="Job Match" score={report.job_match} tone="#10b981" />
          <div className="flex flex-col justify-center rounded-lg bg-slate-50 p-5 dark:bg-white/5">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Resume Strength</span>
            <strong className="mt-2 text-3xl text-emerald-600 dark:text-emerald-300">{report.resume_strength}</strong>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Strong baseline with focused opportunities to improve impact and cloud relevance.
            </p>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" variants={cardAnimation}>
          <div className="flex items-center gap-3">
            <FiActivity className="size-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Quality signals</h2>
          </div>
          <div className="mt-6 space-y-6">
            {report.metrics.map((metric) => <MetricBar key={metric.label} metric={metric} />)}
          </div>
        </motion.section>
        <motion.section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" variants={cardAnimation}>
          <div className="flex items-center gap-3">
            <FiBarChart2 className="size-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Resume coverage</h2>
          </div>
          <ResumeRadarChart data={report.radar} />
        </motion.section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightList items={report.strong_sections} title="Strong sections" />
        <InsightList items={report.weak_sections} title="Weak sections" variant="warning" />
      </div>

      <motion.section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" variants={cardAnimation}>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Section analysis</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {report.sections.map((section) => (
            <article className="rounded-lg border border-slate-200 p-4 dark:border-white/10" key={section.name}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-900 dark:text-white">{section.name}</h3>
                <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{section.score}%</span>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-300">{section.status}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{section.insight}</p>
            </article>
          ))}
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-3">
        <SkillPanel skills={report.matched_skills} title="Matched skills" tone="cyan" />
        <SkillPanel skills={report.missing_skills} title="Missing skills" tone="amber" />
        <SkillPanel skills={report.suggested_skills} title="Suggested skills" tone="emerald" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" variants={cardAnimation}>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Keyword analysis</h2>
          <div className="mt-4 divide-y divide-slate-200 dark:divide-white/10">
            {report.keywords.map((item) => (
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 text-sm" key={item.keyword}>
                <span className="font-bold text-slate-800 dark:text-slate-100">{item.keyword}</span>
                <span className="text-slate-500 dark:text-slate-400">{item.count} uses</span>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">{item.relevance}</span>
              </div>
            ))}
          </div>
        </motion.section>
        <InsightList items={report.improvements} title="Priority improvements" variant="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InsightList items={report.career_suggestions} title="Career suggestions" />
        <motion.section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" variants={cardAnimation}>
          <div className="flex items-center gap-3">
            <FiTarget className="size-5 text-rose-500" />
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Suggested roles</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {report.suggested_roles.map((role) => (
              <span className="rounded-md bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 dark:bg-rose-300/10 dark:text-rose-200" key={role}>{role}</span>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

function SkillPanel({ skills, title, tone }: { skills: string[]; title: string; tone: 'amber' | 'cyan' | 'emerald' }) {
  const tones = {
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-300/10 dark:text-amber-200',
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200',
  };
  return (
    <motion.section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" variants={cardAnimation}>
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => <span className={`rounded-md px-3 py-1.5 text-sm font-bold ${tones[tone]}`} key={skill}>{skill}</span>)}
      </div>
    </motion.section>
  );
}
