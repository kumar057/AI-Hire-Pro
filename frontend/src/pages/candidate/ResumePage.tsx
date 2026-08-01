import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { IconType } from 'react-icons';
import { FiCheckCircle, FiFileText, FiShield } from 'react-icons/fi';

import { ResumeHistoryTimeline } from '@/components/CandidateResume/ResumeHistoryTimeline';
import { ResumeInfoCard } from '@/components/CandidateResume/ResumeInfoCard';
import { ResumePreviewPanel } from '@/components/CandidateResume/ResumePreviewPanel';
import { ResumeSkeleton } from '@/components/CandidateResume/ResumeSkeleton';
import { ResumeUploadDropzone } from '@/components/CandidateResume/ResumeUploadDropzone';
import { candidateService } from '@/services/candidateService';
import type {
  CandidateResumeFile,
  CandidateResumeHistoryItem,
  LocalResumePreview,
} from '@/types/candidateResume';

const ACCEPTED_EXTENSIONS = ['pdf', 'docx'];
const RESUME_HIGHLIGHTS: Array<{ icon: IconType; label: string }> = [
  { icon: FiFileText, label: 'PDF and DOCX supported' },
  { icon: FiShield, label: 'Candidate-only protected APIs' },
  { icon: FiCheckCircle, label: 'Ready for AI review later' },
];

export function ResumePage() {
  const [currentResume, setCurrentResume] = useState<CandidateResumeFile | null>(null);
  const [history, setHistory] = useState<CandidateResumeHistoryItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<LocalResumePreview | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadResume() {
      try {
        const payload = await candidateService.getResume();
        if (isMounted) {
          setCurrentResume(payload.current_resume);
          setHistory(payload.history);
        }
      } catch {
        toast.error('Unable to load resume information.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadResume();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    let context: { revert: () => void } | undefined;

    async function animateResumePanels() {
      const { default: gsap } = await import('gsap');
      context = gsap.context(() => {
        gsap.fromTo(
          '.resume-panel',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
        );
      });
    }

    void animateResumePanels();
    return () => context?.revert();
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview.objectUrl);
      }
    };
  }, [localPreview]);

  async function handleFileSelect(file: File) {
    const fileType = getResumeFileType(file);
    if (!fileType) {
      toast.error('Only PDF and DOCX resumes are supported.');
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview.objectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview({ fileName: file.name, fileType, objectUrl });
    setUploadProgress(8);
    setIsUploading(true);

    try {
      const payload = await candidateService.uploadResume(file, (progress) => {
        setUploadProgress(Math.max(progress, 8));
      });
      setCurrentResume(payload.current_resume);
      setHistory(payload.history);
      setUploadProgress(100);
      toast.success(currentResume ? 'Resume replaced.' : 'Resume uploaded.');
    } catch {
      toast.error('Unable to upload resume.');
      setLocalPreview(null);
    } finally {
      window.setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 550);
    }
  }

  async function handleDeleteResume() {
    setIsDeleting(true);
    try {
      const payload = await candidateService.deleteResume();
      setCurrentResume(payload.current_resume);
      setHistory(payload.history);
      if (localPreview) {
        URL.revokeObjectURL(localPreview.objectUrl);
        setLocalPreview(null);
      }
      toast.success('Resume deleted.');
    } catch {
      toast.error('Unable to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDownloadResume() {
    if (!currentResume && !localPreview) {
      return;
    }

    const sourceUrl =
      localPreview?.objectUrl ??
      URL.createObjectURL(
        new Blob(['AIHire Pro resume placeholder. Real storage will be connected later.'], {
          type: 'text/plain',
        }),
      );
    const fileName = localPreview?.fileName ?? currentResume?.file_name ?? 'resume.txt';
    const anchor = document.createElement('a');
    anchor.href = sourceUrl;
    anchor.download = fileName;
    anchor.click();

    if (!localPreview) {
      URL.revokeObjectURL(sourceUrl);
    }
  }

  function scrollToUploader() {
    uploadAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (isLoading) {
    return <ResumeSkeleton />;
  }

  return (
    <div className="mt-6 space-y-6">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="resume-panel overflow-hidden rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 sm:p-6 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20"
        initial={{ opacity: 0, y: 16 }}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
              Candidate Resume
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl dark:text-white">
              Resume Management
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Upload, preview, replace, download, and manage resume history with placeholder APIs
              ready for future storage and AI parsing.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            {RESUME_HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div
                className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200"
                key={label}
              >
                <span className="grid size-9 place-items-center rounded-md bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-200">
                  <Icon aria-hidden="true" />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <div className="resume-panel" ref={uploadAreaRef}>
            <ResumeUploadDropzone
              disabled={isUploading}
              isDragging={isDragging}
              onDragStateChange={setIsDragging}
              onFileSelect={handleFileSelect}
              progress={uploadProgress}
            />
          </div>

          <div className="resume-panel">
            <ResumePreviewPanel localPreview={localPreview} resume={currentResume} />
          </div>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="resume-panel">
            <ResumeInfoCard
              isDeleting={isDeleting}
              onDelete={handleDeleteResume}
              onDownload={handleDownloadResume}
              onReplace={scrollToUploader}
              resume={currentResume}
            />
          </div>
          <div className="resume-panel">
            <ResumeHistoryTimeline items={history} />
          </div>
        </div>
      </div>
    </div>
  );
}

function getResumeFileType(file: File): 'DOCX' | 'PDF' | null {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
    return null;
  }

  return extension === 'pdf' ? 'PDF' : 'DOCX';
}
