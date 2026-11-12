import React from 'react';
import {
  Download,
  Printer,
  Upload,
  GraduationCap,
  Sparkles,
  FileText,
  CheckCircle,
  Columns,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { QuestionType } from '../types/exam';

interface HeaderNavProps {
  collegeName: string;
  questionType: QuestionType;
  onSelectQuestionType: (type: QuestionType) => void;
  viewMode: 'split' | 'editor' | 'preview';
  onSetViewMode: (mode: 'split' | 'editor' | 'preview') => void;
  onExportDocx: () => void;
  onPrintPdf: () => void;
  onOpenAiUploader: () => void;
  isExportingDocx: boolean;
  questionCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  collegeName,
  questionType,
  onSelectQuestionType,
  viewMode,
  onSetViewMode,
  onExportDocx,
  onPrintPdf,
  onOpenAiUploader,
  isExportingDocx,
  questionCount,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2 gap-3">
          {/* Logo & College Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <GraduationCap size={22} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight font-bangla-sans">
                  {collegeName || 'নওহাটা সরকারি ডিগ্রি কলেজ'}
                </h1>
                <span className="hidden md:inline-flex bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  প্রশ্নপত্র প্রস্তুতকারক
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                মোট {questionCount}টি {questionType === 'mcq' ? 'MCQ প্রশ্ন' : 'সৃজনশীল প্রশ্ন'}
              </p>
            </div>
          </div>

          {/* MAIN PROMINENT TOGGLE: CQ vs MCQ */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={() => onSelectQuestionType('cq')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                questionType === 'cq'
                  ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📝 সৃজনশীল প্রশ্ন (CQ)</span>
            </button>

            <button
              onClick={() => onSelectQuestionType('mcq')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                questionType === 'mcq'
                  ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔘 বহুনির্বাচনি প্রশ্ন (MCQ)</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Upload book page / handwritten photo button */}
            <button
              onClick={onOpenAiUploader}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300 transition shadow-xs cursor-pointer"
              title="বইয়ের পাতার ছবি বা হাতে লেখা প্রশ্ন আপলোড করে অটোমেটিক প্রশ্ন তৈরি করুন"
            >
              <Upload size={14} className="text-emerald-700" />
              <span className="hidden sm:inline">বই/হাতে লেখা ছবি আপলোড</span>
              <span className="sm:hidden">আপলোড</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={onPrintPdf}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition shadow-sm cursor-pointer"
              title="A4 পেপারে প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন"
            >
              <Printer size={14} />
              <span>PDF প্রিন্ট</span>
            </button>

            {/* Word (.docx) Download Button */}
            <button
              onClick={onExportDocx}
              disabled={isExportingDocx}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition cursor-pointer disabled:opacity-50"
              title="মাইক্রোসফট ওয়ার্ড (.docx) ফাইল ডাউনলোড করুন"
            >
              <Download size={14} />
              <span>{isExportingDocx ? 'তৈরি হচ্ছে...' : 'Word (.docx)'}</span>
            </button>
          </div>
        </div>

        {/* Sub-bar: Layout Switcher (Split / Editor / Preview) */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span>ভিউ মোড:</span>
            <button
              onClick={() => onSetViewMode('split')}
              className={`px-2.5 py-1 rounded-md transition font-semibold ${
                viewMode === 'split' ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              স্প্লিট ভিউ (বক্স + লাইভ A4 প্রিভিউ)
            </button>
            <button
              onClick={() => onSetViewMode('editor')}
              className={`px-2.5 py-1 rounded-md transition font-semibold ${
                viewMode === 'editor' ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              শুধু এডিটিং বক্স
            </button>
            <button
              onClick={() => onSetViewMode('preview')}
              className={`px-2.5 py-1 rounded-md transition font-semibold ${
                viewMode === 'preview' ? 'bg-slate-200 text-slate-900' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              শুধু A4 পেপার প্রিভিউ
            </button>
          </div>

          <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            বক্সে যা লিখবেন হুবহু তাই তৈরি হবে
          </div>
        </div>
      </div>
    </header>
  );
};
