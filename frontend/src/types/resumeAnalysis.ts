export interface ScoreMetric {
  label: string;
  score: number;
  summary: string;
}

export interface ResumeSectionAnalysis {
  name: string;
  score: number;
  status: string;
  insight: string;
}

export interface KeywordAnalysis {
  keyword: string;
  count: number;
  relevance: 'High' | 'Medium' | 'Low';
}

export interface ResumeAnalysisReport {
  id: string;
  resume_name: string;
  analyzed_at: string;
  ats_score: number;
  job_match: number;
  resume_strength: string;
  metrics: ScoreMetric[];
  radar: Record<string, number>;
  matched_skills: string[];
  missing_skills: string[];
  suggested_skills: string[];
  keywords: KeywordAnalysis[];
  strong_sections: string[];
  weak_sections: string[];
  sections: ResumeSectionAnalysis[];
  improvements: string[];
  career_suggestions: string[];
  suggested_roles: string[];
}

