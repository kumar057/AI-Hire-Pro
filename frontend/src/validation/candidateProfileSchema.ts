import { z } from 'zod';

const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength, `Use ${maxLength} characters or fewer`).optional();

const optionalUrl = z
  .string()
  .trim()
  .max(240, 'Use 240 characters or fewer')
  .refine((value) => !value || /^https?:\/\/.+\..+/.test(value), {
    message: 'Enter a valid URL starting with http:// or https://',
  });

export const candidateProfileSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(100),
  last_name: z.string().trim().min(1, 'Last name is required').max(100),
  headline: z.string().trim().min(2, 'Headline is required').max(140),
  avatar_url: z.string().trim().optional(),
  email: z.string().trim().email('Enter a valid email'),
  phone: optionalText(32),
  address_line: optionalText(180),
  city: optionalText(100),
  state: optionalText(100),
  country: optionalText(100),
  postal_code: optionalText(32),
  date_of_birth: z.string().trim().optional(),
  gender: optionalText(40),
  bio: z.string().trim().max(800, 'Use 800 characters or fewer').optional(),
  skills: z.string().trim().min(2, 'Add at least one skill').max(800),
  education: z.string().trim().max(1200, 'Use 1200 characters or fewer').optional(),
  work_experience: z.string().trim().max(1600, 'Use 1600 characters or fewer').optional(),
  certifications: z.string().trim().max(1000, 'Use 1000 characters or fewer').optional(),
  languages: z.string().trim().max(500, 'Use 500 characters or fewer').optional(),
  portfolio_url: optionalUrl,
  github_url: optionalUrl,
  linkedin_url: optionalUrl,
  website_url: optionalUrl,
});

export type CandidateProfileFormValues = z.infer<typeof candidateProfileSchema>;

export const EMPTY_CANDIDATE_PROFILE_FORM: CandidateProfileFormValues = {
  first_name: '',
  last_name: '',
  headline: '',
  avatar_url: '',
  email: '',
  phone: '',
  address_line: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  date_of_birth: '',
  gender: '',
  bio: '',
  skills: '',
  education: '',
  work_experience: '',
  certifications: '',
  languages: '',
  portfolio_url: '',
  github_url: '',
  linkedin_url: '',
  website_url: '',
};

const COMPLETION_FIELDS: Array<keyof CandidateProfileFormValues> = [
  'first_name',
  'last_name',
  'headline',
  'email',
  'phone',
  'address_line',
  'city',
  'country',
  'date_of_birth',
  'gender',
  'bio',
  'skills',
  'education',
  'work_experience',
  'certifications',
  'languages',
  'portfolio_url',
  'github_url',
  'linkedin_url',
  'website_url',
];

export function calculateCandidateProfileCompletion(values: Partial<CandidateProfileFormValues>) {
  const completedFields = COMPLETION_FIELDS.filter((field) => {
    const value = values[field];
    return typeof value === 'string' && value.trim().length > 0;
  }).length;

  return Math.round((completedFields / COMPLETION_FIELDS.length) * 100);
}
