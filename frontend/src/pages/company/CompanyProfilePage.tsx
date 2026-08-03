import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiCamera, FiSave } from 'react-icons/fi';
import { z } from 'zod';

import { CompanyPageHeader } from '@/components/CompanyDashboard/CompanyPageHeader';
import { CompanySkeleton } from '@/components/CompanyDashboard/CompanySkeleton';
import { companyService } from '@/services/companyService';
import type { CompanyProfile } from '@/types/company';

const schema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  company_size: z.string().min(1),
  website: z.url('Enter a valid website'),
  location: z.string().min(2, 'Location is required'),
  founded_year: z.number().min(1800).max(2100),
  description: z.string().min(20, 'Add at least 20 characters'),
  linkedin_url: z.union([z.literal(''), z.url()]),
  twitter_url: z.union([z.literal(''), z.url()]),
  benefits: z.string(),
  culture: z.string(),
});
type FormValues = z.infer<typeof schema>;

const inputClass = 'mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-cyan-500 dark:border-white/15 dark:bg-white/5';

export function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  useEffect(() => { void companyService.getProfile().then((profile) => { reset({ ...profile, linkedin_url: profile.linkedin_url ?? '', twitter_url: profile.twitter_url ?? '', benefits: profile.benefits.join(', '), culture: profile.culture.join(', ') }); setLogo(profile.logo_url ?? null); setLoading(false); }); }, [reset]);
  if (loading) return <CompanySkeleton />;
  async function submit(values: FormValues) {
    const payload: CompanyProfile = { ...values, linkedin_url: values.linkedin_url || null, twitter_url: values.twitter_url || null, benefits: values.benefits.split(',').map((item) => item.trim()).filter(Boolean), culture: values.culture.split(',').map((item) => item.trim()).filter(Boolean), logo_url: logo };
    await companyService.updateProfile(payload); toast.success('Company profile updated.'); reset(values);
  }
  return <div className="mt-6 space-y-6"><CompanyPageHeader description="Keep your employer brand, company story, and candidate-facing information accurate." title="Company Profile" />
    <form className="space-y-6" onSubmit={handleSubmit(submit)}>
      <motion.section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-lg font-bold">Brand identity</h2><div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center"><div className="grid size-24 place-items-center overflow-hidden rounded-lg bg-slate-100 text-2xl font-bold text-cyan-700 dark:bg-white/10">{logo ? <img alt="Company logo preview" className="size-full object-cover" src={logo} /> : 'NL'}</div><div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold dark:border-white/15"><FiCamera />Upload Logo<input accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) setLogo(URL.createObjectURL(file)); }} type="file" /></label><p className="mt-2 text-xs text-slate-500">PNG or JPG preview. Placeholder upload only.</p></div></div>
      </motion.section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"><h2 className="text-lg font-bold">Company information</h2><div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field error={errors.company_name?.message} label="Company Name"><input className={inputClass} {...register('company_name')} /></Field>
        <Field error={errors.industry?.message} label="Industry"><input className={inputClass} {...register('industry')} /></Field>
        <Field label="Company Size"><select className={inputClass} {...register('company_size')}><option>1-50</option><option>51-200</option><option>201-500</option><option>501-1000</option><option>1000+</option></select></Field>
        <Field error={errors.website?.message} label="Website"><input className={inputClass} {...register('website')} /></Field>
        <Field error={errors.location?.message} label="Location"><input className={inputClass} {...register('location')} /></Field>
        <Field error={errors.founded_year?.message} label="Founded Year"><input className={inputClass} type="number" {...register('founded_year', { valueAsNumber: true })} /></Field>
        <Field error={errors.linkedin_url?.message} label="LinkedIn"><input className={inputClass} {...register('linkedin_url')} /></Field>
        <Field error={errors.twitter_url?.message} label="X / Twitter"><input className={inputClass} {...register('twitter_url')} /></Field>
      </div><div className="mt-5"><Field error={errors.description?.message} label="Description"><textarea className="mt-2 min-h-32 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-cyan-500 dark:border-white/15 dark:bg-white/5" {...register('description')} /></Field></div>
      <div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Benefits"><input className={inputClass} {...register('benefits')} /><p className="mt-1 text-xs text-slate-500">Comma separated</p></Field><Field label="Culture"><input className={inputClass} {...register('culture')} /><p className="mt-1 text-xs text-slate-500">Comma separated</p></Field></div>
      </section>
      <div className="flex justify-end"><button className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 font-bold text-white disabled:opacity-50" disabled={!isDirty || isSubmitting} type="submit"><FiSave />{isSubmitting ? 'Saving...' : 'Save Changes'}</button></div>
    </form>
  </div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}{children}{error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}</label>; }
