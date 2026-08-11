import axios from 'axios';

export interface ParsedResume {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  professional_summary: string;
  experience_years: number;
  skills: Array<{ name: string; category: string }>;
  experience: Array<{
    company: string;
    job_title: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    responsibilities: string[];
    technologies: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    grade: string;
  }>;
  projects: Array<{
    project_name: string;
    description: string;
    technologies: string[];
    project_url: string;
  }>;
  certifications: Array<{
    certification_name: string;
    issuing_organization: string;
    issue_date: string;
    credential_id: string;
    credential_url: string;
  }>;
  links: {
    linkedin: string;
    github: string;
    portfolio: string;
    other: string[];
  };
}

export interface ResumeParseResponse {
  parsed_resume: ParsedResume;
  extraction_confidence: number;
  extraction_notes: string[];
}

class ResumeService {
  async parseResume(file: File): Promise<ResumeParseResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<ResumeParseResponse>(
        '/api/v1/resume/parse',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.detail || 'Failed to parse resume'
        );
      }
      throw error;
    }
  }
}

export const resumeService = new ResumeService();
