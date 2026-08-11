import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface ParsedResume {
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

interface ResumeParseResponse {
  parsed_resume: ParsedResume;
  extraction_confidence: number;
  extraction_notes: string[];
}

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ResumeParseResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (f: File): string | null => {
    const supportedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!supportedTypes.includes(f.type)) {
      return 'Only PDF and DOCX files are supported';
    }
    if (f.size > maxSize) {
      return 'File size must be less than 10 MB';
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const validationError = validateFile(files[0]);
      if (validationError) {
        setError(validationError);
        setFile(null);
      } else {
        setFile(files[0]);
        setError(null);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      const validationError = validateFile(files[0]);
      if (validationError) {
        setError(validationError);
        setFile(null);
      } else {
        setFile(files[0]);
        setError(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<ResumeParseResponse>(
        '/api/v1/resume/parse',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setParsedData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Failed to parse resume');
      } else {
        setError('An unexpected error occurred');
      }
      setParsedData(null);
    } finally {
      setLoading(false);
    }
  };

  if (parsedData) {
    return <ResumeReviewPage data={parsedData} onBack={() => setParsedData(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Upload Your Resume</h1>
          <p className="text-slate-400 mb-8">
            AI-powered parser to extract and organize your professional data
          </p>

          <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            animate={dragActive ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'
            }`}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drag and drop your resume here</p>
            <p className="text-slate-400 text-sm mb-6">or</p>

            <label className="inline-block">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition">
                Browse Files
              </span>
            </label>

            <p className="text-slate-500 text-xs mt-4">PDF or DOCX • Max 10 MB</p>
          </motion.div>

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-slate-900/50 border border-slate-700 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-slate-400 text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </motion.button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-200">{error}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={file ? { scale: 1.02 } : {}}
            whileTap={file ? { scale: 0.98 } : {}}
            onClick={handleUpload}
            disabled={!file || loading}
            className={`w-full mt-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
              file && !loading
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Parsing Resume...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Parse Resume
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

function ResumeReviewPage({
  data,
  onBack,
}: {
  data: ResumeParseResponse;
  onBack: () => void;
}) {
  const [editedData, setEditedData] = useState<ParsedResume>(data.parsed_resume);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            ← Back
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Review Your Resume</h1>

          <div className="space-y-8">
            {/* Personal Information */}
            <ReviewSection title="Personal Information">
              <EditableField
                label="Full Name"
                value={editedData.personal.name}
                onChange={(v) =>
                  setEditedData({
                    ...editedData,
                    personal: { ...editedData.personal, name: v },
                  })
                }
              />
              <EditableField
                label="Email"
                value={editedData.personal.email}
                onChange={(v) =>
                  setEditedData({
                    ...editedData,
                    personal: { ...editedData.personal, email: v },
                  })
                }
              />
              <EditableField
                label="Phone"
                value={editedData.personal.phone}
                onChange={(v) =>
                  setEditedData({
                    ...editedData,
                    personal: { ...editedData.personal, phone: v },
                  })
                }
              />
              <EditableField
                label="Location"
                value={editedData.personal.location}
                onChange={(v) =>
                  setEditedData({
                    ...editedData,
                    personal: { ...editedData.personal, location: v },
                  })
                }
              />
            </ReviewSection>

            {/* Professional Summary */}
            <ReviewSection title="Professional Summary">
              <textarea
                value={editedData.professional_summary}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    professional_summary: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                rows={4}
              />
            </ReviewSection>

            {/* Skills */}
            {editedData.skills.length > 0 && (
              <ReviewSection title="Skills">
                <div className="flex flex-wrap gap-2">
                  {editedData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-900/30 border border-blue-700/50 text-blue-200 rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </ReviewSection>
            )}

            {/* Experience */}
            {editedData.experience.length > 0 && (
              <ReviewSection title="Experience">
                {editedData.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="mb-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg"
                  >
                    <p className="text-white font-semibold">{exp.job_title}</p>
                    <p className="text-slate-400 text-sm">{exp.company}</p>
                    {exp.responsibilities.length > 0 && (
                      <ul className="mt-2 text-slate-300 text-sm space-y-1">
                        {exp.responsibilities.slice(0, 3).map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ReviewSection>
            )}

            {/* Education */}
            {editedData.education.length > 0 && (
              <ReviewSection title="Education">
                {editedData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <p className="text-white font-semibold">{edu.degree} in {edu.field_of_study}</p>
                    <p className="text-slate-400 text-sm">{edu.institution}</p>
                  </div>
                ))}
              </ReviewSection>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition"
            >
              Save Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
            >
              Re-parse Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
