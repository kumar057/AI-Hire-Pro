import {
  FiActivity,
  FiAward,
  FiBarChart2,
  FiBriefcase,
  FiCpu,
  FiDatabase,
  FiFeather,
  FiGlobe,
  FiGrid,
  FiHeart,
  FiLayers,
  FiMessageCircle,
  FiMonitor,
  FiPenTool,
  FiSearch,
  FiShield,
  FiSliders,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

export type NavItem = {
  label: string;
  href: string;
};

export type Company = {
  accentClass: string;
  description: string;
  icon: IconType;
  name: string;
  openRoles: number;
  sector: string;
};

export type Job = {
  company: string;
  location: string;
  match: number;
  salary: string;
  skills: string[];
  title: string;
  type: string;
};

export type Category = {
  description: string;
  icon: IconType;
  name: string;
  roles: string;
};

export type Stat = {
  label: string;
  suffix: string;
  value: number;
};

export type AiFeature = {
  description: string;
  icon: IconType;
  title: string;
};

export type Testimonial = {
  name: string;
  quote: string;
  role: string;
};

export type Faq = {
  answer: string;
  question: string;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Jobs', href: '#jobs' },
  { label: 'Companies', href: '#companies' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const featuredCompanies: Company[] = [
  {
    accentClass: 'from-cyan-400 to-emerald-400',
    description: 'AI-native collaboration products for enterprise teams.',
    icon: FiGlobe,
    name: 'NovaGrid',
    openRoles: 42,
    sector: 'Enterprise SaaS',
  },
  {
    accentClass: 'from-amber-300 to-rose-400',
    description: 'Climate intelligence infrastructure at global scale.',
    icon: FiActivity,
    name: 'Solace Labs',
    openRoles: 28,
    sector: 'Climate Tech',
  },
  {
    accentClass: 'from-emerald-300 to-teal-500',
    description: 'Secure payments and risk tooling for modern commerce.',
    icon: FiShield,
    name: 'VaultPay',
    openRoles: 35,
    sector: 'Fintech',
  },
  {
    accentClass: 'from-fuchsia-400 to-sky-400',
    description: 'Personalized health operations powered by data.',
    icon: FiHeart,
    name: 'MediCore AI',
    openRoles: 19,
    sector: 'Health AI',
  },
];

export const latestJobs: Job[] = [
  {
    company: 'NovaGrid',
    location: 'Remote, US',
    match: 97,
    salary: '$165k - $210k',
    skills: ['React', 'AI UX', 'Design Systems'],
    title: 'Senior Frontend Engineer',
    type: 'Full-time',
  },
  {
    company: 'VaultPay',
    location: 'New York, NY',
    match: 94,
    salary: '$180k - $235k',
    skills: ['FastAPI', 'Security', 'PostgreSQL'],
    title: 'Platform Architect',
    type: 'Full-time',
  },
  {
    company: 'Solace Labs',
    location: 'Austin, TX',
    match: 91,
    salary: '$145k - $190k',
    skills: ['Python', 'ML Ops', 'Data Pipelines'],
    title: 'AI Infrastructure Engineer',
    type: 'Hybrid',
  },
];

export const jobCategories: Category[] = [
  {
    description: 'Interfaces, systems, and product craft.',
    icon: FiMonitor,
    name: 'Product Engineering',
    roles: '8.2k roles',
  },
  {
    description: 'Models, data platforms, and applied AI.',
    icon: FiCpu,
    name: 'AI & Machine Learning',
    roles: '5.4k roles',
  },
  {
    description: 'Growth, lifecycle, and brand systems.',
    icon: FiTrendingUp,
    name: 'Marketing',
    roles: '3.7k roles',
  },
  {
    description: 'Research, UI, content, and service design.',
    icon: FiPenTool,
    name: 'Design',
    roles: '2.9k roles',
  },
  {
    description: 'Analytics, warehousing, and business insight.',
    icon: FiDatabase,
    name: 'Data',
    roles: '4.1k roles',
  },
  {
    description: 'People systems and company operations.',
    icon: FiUsers,
    name: 'Operations',
    roles: '2.4k roles',
  },
];

export const stats: Stat[] = [
  { label: 'Curated jobs', suffix: 'k+', value: 240 },
  { label: 'Hiring partners', suffix: '+', value: 980 },
  { label: 'AI match accuracy', suffix: '%', value: 96 },
  { label: 'Avg. shortlist time', suffix: 'h', value: 18 },
];

export const aiFeatures: AiFeature[] = [
  {
    description: 'Understands skills, seniority, industry context, and career intent.',
    icon: FiTarget,
    title: 'Precision Matching',
  },
  {
    description: 'Turns noisy job data into clear recommendations and next steps.',
    icon: FiSliders,
    title: 'Adaptive Ranking',
  },
  {
    description: 'Highlights role fit, compensation signals, and company alignment.',
    icon: FiSearch,
    title: 'Explainable Discovery',
  },
  {
    description: 'Keeps sensitive candidate data protected as the platform scales.',
    icon: FiShield,
    title: 'Trust-First AI',
  },
];

export const testimonials: Testimonial[] = [
  {
    name: 'Amara Wells',
    quote:
      'AIHire Pro feels polished, focused, and genuinely useful. The matching experience makes high-signal roles surface fast.',
    role: 'VP Talent, NovaGrid',
  },
  {
    name: 'Julian Park',
    quote:
      'The interface gives candidates confidence without slowing down recruiters. It feels built for serious hiring teams.',
    role: 'Founder, Solace Labs',
  },
  {
    name: 'Priya Mehta',
    quote:
      'The product language is sharp, the flow is calm, and the AI layer makes the search experience feel personal.',
    role: 'People Ops Lead, VaultPay',
  },
];

export const faqs: Faq[] = [
  {
    question: 'Is AIHire Pro ready for production traffic?',
    answer:
      'The frontend foundation is designed for production hardening, responsive delivery, and clean integration with API services.',
  },
  {
    question: 'Does this landing page implement authentication?',
    answer:
      'No. Login and registration links are visual entry points only. Business workflows should be added as separate feature slices.',
  },
  {
    question: 'Can the design support dark mode?',
    answer:
      'Yes. The interface includes a theme toggle and dark-mode styling across sections, cards, navigation, and forms.',
  },
  {
    question: 'How should new sections be added?',
    answer:
      'Add reusable components under the frontend component tree and keep page composition inside the landing page route.',
  },
];

export const heroSignals = [
  { icon: FiBriefcase, label: 'Role fit', value: '97%' },
  { icon: FiAward, label: 'Top company', value: 'Verified' },
  { icon: FiLayers, label: 'Stack match', value: 'React + AI' },
  { icon: FiMessageCircle, label: 'Recruiter note', value: 'New' },
];

export const floatingIcons = [FiBriefcase, FiZap, FiGrid, FiFeather, FiBarChart2];
