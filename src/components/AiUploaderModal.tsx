import React, { useRef, useState } from 'react';
import { X, Upload, Sparkles, Loader2, Camera, Trash2, CheckCircle2 } from 'lucide-react';
import { UploadedPage, QuestionItem, QuestionType } from '../types/exam';
import { renderPdfPagesToImages } from '../utils/pdfRenderer';
import { generateSampleTextbookPages } from '../data/samplePages';

interface AiUploaderModalProps {
  currentQuestionType: QuestionType;
  onClose: () => void;
  onExtracted: (newQuestions: QuestionItem[], type: QuestionType) => void;
}

export const AiUploaderModal: React.FC<AiUploaderModalProps> = ({
  currentQuestionType,
  onClose,
  onExtracted,
}) => {
  const [pages, setPages] = useState<UploadedPage[]>([]);
  const [targetType, setTargetType] = useState<QuestionType>(currentQuestionType);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    const newPages: UploadedPage[] = [];

    for (const file of files) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const rendered = await renderPdfPagesToImages(file, 6);
        newPages.push(...rendered);
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((res) => {
          reader.onload = () => res(reader.result as string);
          reader.readAsDataURL(file);
        });
        newPages.push({
          id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          pageNumber: pages.length + newPages.length + 1,
          previewUrl: dataUrl,
          sourceType: 'image',
        });
      }
    }
    setPages([...pages, ...newPages]);
  };

  const handleLoadSamples = () => {
    setPages([...pages, ...generateSampleTextbookPages()]);
  };

  const handleExtract = async () => {
    if (pages.length === 0) {
      alert('অনুগ্রহ করে অন্তত একটি বইয়ের পাতা বা হাতে লেখা ছবি আপলোড করুন।');
      return;
    }

    setIsProcessing(true);
    try {
      const imagesPayload = pages.slice(0, 8).map((p) => ({
        name: p.name,
        pageNumber: p.pageNumber,
        mimeType: 'image/jpeg',
        base64: p.previewUrl,
      }));

      const res = await fetch('/api/extract-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: imagesPayload,
          logicText: targetType === 'mcq'
            ? 'বইয়ের পাতা বা ছবি থেকে বহুনির্বাচনি প্রশ্ন (ক, খ, গ, ঘ বিকল্পসহ) সাজিয়ে দিন'
            : 'বইয়ের পাতা বা ছবি থেকে সৃজনশীল উদ্দীপক এবং ক, খ, গ, ঘ প্রশ্ন ক্রমানুসারে সাজিয়ে দিন',
          questionType: targetType,
          numberStyle: 'bengali',
          stripAnswers: true,
        }),
      });

      const data = await res.json();
      if (data && data.questions && data.questions.length > 0) {
        onExtracted(data.questions, targetType);
        onClose();
      } else {
        alert('প্রশ্ন তৈরি হতে পারেনি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      console.error(err);
      alert('সার্ভার সাড়া দেয়নি। সংযোগ চেক করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              বইয়ের পাতা বা হাতে লেখা ছবি থেকে প্রশ্ন তৈরি
            </h3>
            <p className="text-xs text-slate-500">
              ছবি আপলোড করলেই এআই তা পড়ে স্বয়ংক্রিয়ভাবে বক্সে সাজিয়ে দেবে
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Question Type Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              কোন ধরনের প্রশ্ন তৈরি করতে চান?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('cq')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  targetType === 'cq'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                📝 সৃজনশীল প্রশ্ন (CQ)
              </button>
              <button
                type="button"
                onClick={() => setTargetType('mcq')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  targetType === 'mcq'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🔘 বহুনির্বাচনি প্রশ্ন (MCQ)
              </button>
            </div>
          </div>

          {/* Simple Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Upload size={24} />
              </div>
              <div className="text-sm font-bold text-slate-800">
                বইয়ের পাতার ছবি বা হাতে লেখা প্রশ্ন ড্রপ করুন
              </div>
              <div className="text-xs text-slate-500 mt-1">
                বা মোবাইল / কম্পিউটার থেকে ছবি সিলেক্ট করতে ক্লিক করুন
              </div>
            </div>
          </div>

          {/* Sample quick button */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">ছবি না থাকলে?</span>
            <button
              onClick={handleLoadSamples}
              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Sparkles size={14} className="text-amber-500" />
              নমুনা বইয়ের পাতা লোড করুন
            </button>
          </div>

          {/* Uploaded Gallery Thumbnails */}
          {pages.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">
                নির্বাচিত পাতা ({pages.length}টি):
              </span>
              <div className="grid grid-cols-4 gap-2">
                {pages.map((p, idx) => (
                  <div
                    key={p.id}
                    className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                  >
                    <img src={p.previewUrl} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPages(pages.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] text-white text-center py-0.5">
                      পাতা {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            বাতিল
          </button>
          <button
            onClick={handleExtract}
            disabled={isProcessing || pages.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>প্রশ্ন প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-amber-300" />
                <span>প্রশ্ন বের করে বক্সে লোড করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
