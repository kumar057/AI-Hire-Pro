import type {
  CandidateProfileApiPayload,
  CandidateProfileResponse,
} from '@/types/candidateProfile';
import type { CandidateProfileFormValues } from '@/validation/candidateProfileSchema';

function listToText(values: string[] | null | undefined) {
  return values?.join('\n') ?? '';
}

function textToList(value: string | null | undefined) {
  return (value ?? '')
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullable(value: string | null | undefined) {
  const normalized = value?.trim() ?? '';
  return normalized.length > 0 ? normalized : null;
}

export function profileResponseToFormValues(
  profile: CandidateProfileResponse,
): CandidateProfileFormValues {
  return {
    first_name: profile.first_name,
    last_name: profile.last_name,
    headline: profile.headline,
    avatar_url: profile.avatar_url ?? '',
    email: profile.email,
    phone: profile.phone ?? '',
    address_line: profile.address_line ?? '',
    city: profile.city ?? '',
    state: profile.state ?? '',
    country: profile.country ?? '',
    postal_code: profile.postal_code ?? '',
    date_of_birth: profile.date_of_birth ?? '',
    gender: profile.gender ?? '',
    bio: profile.bio ?? '',
    skills: listToText(profile.skills),
    education: listToText(profile.education),
    work_experience: listToText(profile.work_experience),
    certifications: listToText(profile.certifications),
    languages: listToText(profile.languages),
    portfolio_url: profile.portfolio_url ?? '',
    github_url: profile.github_url ?? '',
    linkedin_url: profile.linkedin_url ?? '',
    website_url: profile.website_url ?? '',
  };
}

export function formValuesToProfilePayload(
  values: CandidateProfileFormValues,
  profileCompletion: number,
): CandidateProfileApiPayload {
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    headline: values.headline.trim(),
    avatar_url: nullable(values.avatar_url),
    email: values.email.trim(),
    phone: nullable(values.phone),
    address_line: nullable(values.address_line),
    city: nullable(values.city),
    state: nullable(values.state),
    country: nullable(values.country),
    postal_code: nullable(values.postal_code),
    date_of_birth: nullable(values.date_of_birth),
    gender: nullable(values.gender),
    bio: nullable(values.bio),
    skills: textToList(values.skills),
    education: textToList(values.education),
    work_experience: textToList(values.work_experience),
    certifications: textToList(values.certifications),
    languages: textToList(values.languages),
    portfolio_url: nullable(values.portfolio_url),
    github_url: nullable(values.github_url),
    linkedin_url: nullable(values.linkedin_url),
    website_url: nullable(values.website_url),
    profile_completion: profileCompletion,
  };
}
