export type CandidateResumeFile = {
  id: string;
  file_name: string;
  file_type: 'DOCX' | 'PDF';
  file_size: number;
  upload_date: string;
  status: string;
  preview_url: string | null;
  download_url: string | null;
};

export type CandidateResumeHistoryItem = {
  id: string;
  file_name: string;
  file_size: number;
  upload_date: string;
  action: string;
};

export type CandidateResumeResponse = {
  current_resume: CandidateResumeFile | null;
  history: CandidateResumeHistoryItem[];
  supported_formats: string[];
};

export type LocalResumePreview = {
  fileName: string;
  fileType: 'DOCX' | 'PDF';
  objectUrl: string;
};
