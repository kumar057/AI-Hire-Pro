import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { IconType } from 'react-icons';
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCheck,
  FiEdit3,
  FiGlobe,
  FiLink,
  FiLoader,
  FiMapPin,
  FiSave,
  FiUser,
  FiX,
} from 'react-icons/fi';

import { AvatarUploadPreview } from '@/components/CandidateProfile/AvatarUploadPreview';
import { ProfileCompletionPanel } from '@/components/CandidateProfile/ProfileCompletionPanel';
import { ProfileField } from '@/components/CandidateProfile/ProfileField';
import { ProfileFormSection } from '@/components/CandidateProfile/ProfileFormSection';
import { ProfileTextarea } from '@/components/CandidateProfile/ProfileTextarea';
import { candidateService } from '@/services/candidateService';
import {
  formValuesToProfilePayload,
  profileResponseToFormValues,
} from '@/utils/candidateProfile';
import {
  calculateCandidateProfileCompletion,
  candidateProfileSchema,
  EMPTY_CANDIDATE_PROFILE_FORM,
  type CandidateProfileFormValues,
} from '@/validation/candidateProfileSchema';

const PROFILE_CHECKLIST: Array<{ icon: IconType; label: string }> = [
  { icon: FiUser, label: 'Personal details' },
  { icon: FiBriefcase, label: 'Career history' },
  { icon: FiBookOpen, label: 'Education' },
  { icon: FiAward, label: 'Certifications' },
  { icon: FiGlobe, label: 'Professional links' },
];

export function MyProfilePage() {
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedValues, setSavedValues] = useState<CandidateProfileFormValues>(
    EMPTY_CANDIDATE_PROFILE_FORM,
  );
  const [savedAvatarPreview, setSavedAvatarPreview] = useState('');

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
    control,
  } = useForm<CandidateProfileFormValues>({
    defaultValues: EMPTY_CANDIDATE_PROFILE_FORM,
    resolver: zodResolver(candidateProfileSchema),
  });

  const watchedValues = useWatch({ control });
  const profileCompletion = useMemo(
    () => calculateCandidateProfileCompletion(watchedValues),
    [watchedValues],
  );
  const fullName = `${watchedValues.first_name ?? ''} ${watchedValues.last_name ?? ''}`.trim();

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const profile = await candidateService.getProfile();
        const values = profileResponseToFormValues(profile);

        if (isMounted) {
          reset(values);
          setSavedValues(values);
          setAvatarPreview(values.avatar_url ?? '');
          setSavedAvatarPreview(values.avatar_url ?? '');
        }
      } catch {
        toast.error('Unable to load candidate profile.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, [reset]);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    let context: { revert: () => void } | undefined;

    async function animateSections() {
      const { default: gsap } = await import('gsap');
      context = gsap.context(() => {
        gsap.fromTo(
          '.profile-form-section',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
        );
      });
    }

    void animateSections();
    return () => context?.revert();
  }, [isLoading]);

  function handleCancel() {
    reset(savedValues);
    setAvatarPreview(savedAvatarPreview);
    setIsAvatarDirty(false);
    setIsEditing(false);
  }

  function handleAvatarPreviewChange(preview: string) {
    setAvatarPreview(preview);
    setIsAvatarDirty(true);
  }

  async function handleProfileSave(values: CandidateProfileFormValues) {
    setIsSaving(true);
    try {
      const payload = formValuesToProfilePayload(values, profileCompletion);
      const profile = await candidateService.updateProfile(payload);
      const updatedValues = profileResponseToFormValues(profile);

      reset(updatedValues);
      setSavedValues(updatedValues);
      setSavedAvatarPreview(avatarPreview || updatedValues.avatar_url || '');
      setIsEditing(false);
      setIsAvatarDirty(false);
      toast.success('Candidate profile saved.');
    } catch {
      toast.error('Unable to save candidate profile.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              className="h-56 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70"
              key={index}
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70" />
      </div>
    );
  }

  return (
    <form className="mt-6" onSubmit={handleSubmit(handleProfileSave)}>
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            Candidate Profile
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 dark:text-white">
            Profile Management
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Manage your candidate identity, professional links, career story, and profile strength
            foundation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/10 dark:text-white"
                disabled={isSaving}
                onClick={handleCancel}
                type="button"
              >
                <FiX aria-hidden="true" />
                Cancel Changes
              </button>
              <button
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-lg shadow-cyan-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                disabled={isSaving || (!isDirty && !isAvatarDirty)}
                type="submit"
              >
                {isSaving ? <FiLoader aria-hidden="true" className="animate-spin" /> : <FiSave aria-hidden="true" />}
                Save Changes
              </button>
            </>
          ) : (
            <button
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white shadow-lg shadow-cyan-950/15 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              <FiEdit3 aria-hidden="true" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <ProfileFormSection
            description="Core candidate identity and profile photo preview."
            icon={FiUser}
            title="Personal Information"
          >
            <AvatarUploadPreview
              disabled={!isEditing}
              fullName={fullName || 'AIHire Pro'}
              onPreviewChange={handleAvatarPreviewChange}
              preview={avatarPreview}
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ProfileField
                disabled={!isEditing}
                error={errors.first_name?.message}
                label="First Name"
                placeholder="Ava"
                registration={register('first_name')}
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.last_name?.message}
                label="Last Name"
                placeholder="Stone"
                registration={register('last_name')}
              />
              <div className="md:col-span-2">
                <ProfileField
                  disabled={!isEditing}
                  error={errors.headline?.message}
                  label="Professional Headline"
                  placeholder="Senior Frontend Engineer"
                  registration={register('headline')}
                />
              </div>
              <ProfileField
                disabled={!isEditing}
                error={errors.date_of_birth?.message}
                label="Date of Birth"
                registration={register('date_of_birth')}
                type="date"
              />
              <label className="block">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Gender
                </span>
                <select
                  className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:disabled:bg-white/10"
                  disabled={!isEditing}
                  {...register('gender')}
                >
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>
            </div>

            <div className="mt-4">
              <ProfileTextarea
                disabled={!isEditing}
                error={errors.bio?.message}
                label="Bio"
                placeholder="Share a concise professional summary."
                registration={register('bio')}
              />
            </div>
          </ProfileFormSection>

          <ProfileFormSection
            description="Email, phone, and candidate location information."
            icon={FiMapPin}
            title="Contact Information and Address"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField
                disabled={!isEditing}
                error={errors.email?.message}
                label="Email"
                placeholder="ava@example.com"
                registration={register('email')}
                type="email"
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.phone?.message}
                label="Phone"
                placeholder="+1 555 123 4567"
                registration={register('phone')}
                type="tel"
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.address_line?.message}
                label="Address"
                placeholder="100 Market Street"
                registration={register('address_line')}
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.city?.message}
                label="City"
                placeholder="San Francisco"
                registration={register('city')}
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.state?.message}
                label="State"
                placeholder="California"
                registration={register('state')}
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.country?.message}
                label="Country"
                placeholder="United States"
                registration={register('country')}
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.postal_code?.message}
                label="Postal Code"
                placeholder="94105"
                registration={register('postal_code')}
              />
            </div>
          </ProfileFormSection>

          <ProfileFormSection
            description="Skills, education, experience, certifications, and languages."
            icon={FiBriefcase}
            title="Career Profile"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <ProfileTextarea
                disabled={!isEditing}
                error={errors.skills?.message}
                helper="Separate skills with commas or new lines."
                label="Skills"
                placeholder="React, TypeScript, FastAPI"
                registration={register('skills')}
              />
              <ProfileTextarea
                disabled={!isEditing}
                error={errors.languages?.message}
                helper="Separate languages with commas or new lines."
                label="Languages"
                placeholder="English, Hindi"
                registration={register('languages')}
              />
              <ProfileTextarea
                disabled={!isEditing}
                error={errors.education?.message}
                helper="Add one education item per line."
                label="Education"
                placeholder="B.S. Computer Science - State University"
                registration={register('education')}
              />
              <ProfileTextarea
                disabled={!isEditing}
                error={errors.work_experience?.message}
                helper="Add one role or experience item per line."
                label="Work Experience"
                placeholder="Frontend Engineer - SignalWorks"
                registration={register('work_experience')}
              />
              <div className="lg:col-span-2">
                <ProfileTextarea
                  disabled={!isEditing}
                  error={errors.certifications?.message}
                  helper="Add one certification per line."
                  label="Certifications"
                  placeholder="AWS Cloud Practitioner"
                  registration={register('certifications')}
                />
              </div>
            </div>
          </ProfileFormSection>

          <ProfileFormSection
            description="Professional links for portfolio, GitHub, LinkedIn, and website."
            icon={FiLink}
            title="Portfolio and Social Links"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ProfileField
                disabled={!isEditing}
                error={errors.portfolio_url?.message}
                label="Portfolio"
                placeholder="https://portfolio.example.com"
                registration={register('portfolio_url')}
                type="url"
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.github_url?.message}
                label="GitHub"
                placeholder="https://github.com/username"
                registration={register('github_url')}
                type="url"
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.linkedin_url?.message}
                label="LinkedIn"
                placeholder="https://www.linkedin.com/in/username"
                registration={register('linkedin_url')}
                type="url"
              />
              <ProfileField
                disabled={!isEditing}
                error={errors.website_url?.message}
                label="Website"
                placeholder="https://example.com"
                registration={register('website_url')}
                type="url"
              />
            </div>
          </ProfileFormSection>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <ProfileCompletionPanel completion={profileCompletion} />
          <motion.aside
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20"
            initial={{ opacity: 0, y: 16 }}
          >
            <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
              Profile Checklist
            </p>
            <div className="mt-4 space-y-3">
              {PROFILE_CHECKLIST.map(({ icon: Icon, label }) => (
                <div
                  className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-white/5"
                  key={label}
                >
                  <span className="grid size-8 place-items-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200">
                    <FiCheck aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </form>
  );
}
