import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  BookOpen,
  Trash2,
  Maximize2,
  Sparkles,
  ArrowRight,
  Layers,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { UploadedPage } from '../types/exam';
import { renderPdfPagesToImages } from '../utils/pdfRenderer';
import { generateSampleTextbookPages } from '../data/samplePages';

interface Step1InputSectionProps {
  pages: UploadedPage[];
  onSetPages: (pages: UploadedPage[]) => void;
  onOpenZoom: (index: number) => void;
  onNext: () => void;
}

export const Step1InputSection: React.FC<Step1InputSectionProps> = ({
  pages,
  onSetPages,
  onOpenZoom,
  onNext,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load sample pages for instant test
  const handleLoadSamplePages = () => {
    const samples = generateSampleTextbookPages();
    onSetPages([...pages, ...samples]);
  };

  // Process selected files
  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const newPages: UploadedPage[] = [];

    for (const file of files) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setIsProcessingPdf(true);
        setPdfProgress({ current: 0, total: 1 });
        try {
          const pdfPages = await renderPdfPagesToImages(file, 8, (current, total) => {
            setPdfProgress({ current, total });
          });
          newPages.push(...pdfPages);
        } catch (e) {
          console.error('PDF error:', e);
        } finally {
          setIsProcessingPdf(false);
          setPdfProgress(null);
        }
      } else if (file.type.startsWith('image/')) {
        const previewUrl = await readFileAsDataUrl(file);
        newPages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          pageNumber: pages.length + newPages.length + 1,
          previewUrl,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          sourceType: 'image',
        });
      }
    }

    if (newPages.length > 0) {
      onSetPages([...pages, ...newPages]);
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = pages.filter((p) => p.id !== id);
    // Recalculate page numbers
    const renumbered = updated.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
    onSetPages(renumbered);
  };

  const handleClearAll = () => {
    if (confirm('আপনি কি সব আপলোডকৃত পাতা মুছে ফেলতে চান?')) {
      onSetPages([]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-xs">
                ১
              </span>
              প্রথম ধাপ: ইনপুট ও পেজ প্রসেসিং
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              বইয়ের পাতা ও প্রশ্নব্যাংক আপলোড করুন
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              পাঠ্যবইয়ের একাধিক পাতার ছবি বা পূর্ণাঙ্গ PDF আপলোড করুন। আমাদের উন্নত সিস্টেম প্রতিটি
              পাতাকে উচ্চ রেজোলিউশনের ক্যানভাসে রূপান্তর করে নির্ভুল প্রশ্ন তৈরি করবে।
            </p>
          </div>

          {/* Quick Sample Demo Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadSamplePages}
              className="group flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-sm rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <BookOpen size={17} className="transition-transform group-hover:scale-110" />
              <span>নমুনা বইয়ের পাতা (Sample Pages)</span>
              <Sparkles size={15} className="text-amber-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[0.99]'
            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-inner">
            <Upload size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            বইয়ের পাতার ছবি বা PDF ফাইল ড্রপ করুন
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            বা আপনার কম্পিউটার / ফোন থেকে ফাইল সিলেক্ট করতে ক্লিক করুন
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
              JPG / JPEG
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
              PNG / WEBP
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
              PDF বই ও স্ক্যান
            </span>
          </div>

          {isProcessingPdf && pdfProgress && (
            <div className="mt-6 w-full max-w-xs bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-sm animate-pulse">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-medium mb-1">
                <span>PDF প্রসেস হচ্ছে...</span>
                <span>{pdfProgress.current} / {pdfProgress.total} পাতা</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-200"
                  style={{ width: `${(pdfProgress.current / pdfProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Pages Gallery */}
      {pages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                আপলোডকৃত পাতা ({pages.length} টি)
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                (পাতায় ক্লিক করে পূর্ণাঙ্গ জুম ও পরিদর্শন করুন)
              </span>
            </div>

            <button
              onClick={handleClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Trash2 size={13} />
              সব পাতা মুছুন
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page, index) => (
              <div
                key={page.id}
                onClick={() => onOpenZoom(index)}
                className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                {/* Page Badge */}
                <div className="absolute top-2 left-2 z-10 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <span>পৃষ্ঠা {page.pageNumber}</span>
                  {page.sourceType === 'sample' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="নমুনা পাতা" />
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDeletePage(page.id, e)}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-md bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="পাতাটি মুছুন"
                >
                  <Trash2 size={14} />
                </button>

                {/* Image Preview */}
                <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={page.previewUrl}
                    alt={page.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Zoom Overlay Hint */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-900 text-xs font-semibold px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                      <Maximize2 size={13} />
                      জুম করুন
                    </span>
                  </div>
                </div>

                {/* Footer label */}
                <div className="p-2.5 bg-white dark:bg-slate-900 text-left">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={page.name}>
                    {page.name}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                    <span>{page.sourceType === 'sample' ? 'নমুনা পাতা' : page.sourceType.toUpperCase()}</span>
                    {page.fileSize && <span>{page.fileSize}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State Tips */}
      {pages.length === 0 && (
        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-6 flex items-start gap-4">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-xl shrink-0">
            <BookOpen size={24} />
          </div>
          <div className="text-sm">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-200">
              টেস্ট করতে চান? এক ক্লিকেই নমুনা পাতা লোড করুন!
            </h4>
            <p className="text-emerald-800/80 dark:text-emerald-300/80 mt-1">
              আপনার কাছে এখনই কোনো বইয়ের স্ক্যান না থাকলে উপরের{' '}
              <button
                onClick={handleLoadSamplePages}
                className="font-bold underline hover:text-emerald-950 dark:hover:text-emerald-100"
              >
                নমুনা বইয়ের পাতা (Sample Pages)
              </button>{' '}
              বাটনে ক্লিক করুন। এটি সরাসরি এইচএসসি ব্যবসায় সংগঠন ও ব্যবস্থাপনা দ্বিতীয় পত্রের বাস্তবসম্মত বোর্ডের তিনটি সৃজনশীল প্রশ্ন লোড করে দেবে।
            </p>
          </div>
        </div>
      )}

      {/* Bottom Step Action */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          disabled={pages.length === 0}
          onClick={onNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
            pages.length > 0
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 cursor-pointer'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>পরবর্তী ধাপ: প্রশ্ন নির্বাচন লজিক</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};
