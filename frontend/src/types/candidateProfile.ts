export type CandidateProfileApiPayload = {
  first_name: string;
  last_name: string;
  headline: string;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  date_of_birth: string | null;
  gender: string | null;
  bio: string | null;
  skills: string[];
  education: string[];
  work_experience: string[];
  certifications: string[];
  languages: string[];
  portfolio_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  profile_completion: number;
};

export type CandidateProfileResponse = CandidateProfileApiPayload & {
  uuid: string;
};
