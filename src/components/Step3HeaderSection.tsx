import React from 'react';
import {
  Building2,
  FileText,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Eye,
  Loader2
} from 'lucide-react';
import { ExamHeaderInfo, PresetTemplate } from '../types/exam';
import { PRESET_TEMPLATES } from '../data/presetTemplates';

interface Step3HeaderSectionProps {
  header: ExamHeaderInfo;
  onChangeHeader: (header: ExamHeaderInfo) => void;
  onApplyPreset: (preset: PresetTemplate) => void;
  onPrev: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  uploadCount: number;
}

export const Step3HeaderSection: React.FC<Step3HeaderSectionProps> = ({
  header,
  onChangeHeader,
  onApplyPreset,
  onPrev,
  onGenerate,
  isGenerating,
  uploadCount,
}) => {
  const updateField = (field: keyof ExamHeaderInfo, value: string) => {
    onChangeHeader({
      ...header,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1">
          <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-xs">
            ৩
          </span>
          তৃতীয় ধাপ: পরীক্ষার তথ্য ফরম ও লাইভ প্রিভিউ
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          পরীক্ষার প্রাতিষ্ঠানিক হেডার সাজান
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          বাংলাদেশি শিক্ষা বোর্ড ও স্বনামধন্য কলেজের অফিসিয়াল প্রশ্নপত্রের ফরমেটে আপনার কলেজের নাম, পরীক্ষার বিবরণ, সময় ও নম্বর ইনপুট দিন। নিচে লাইভ প্রিভিউ সাথে সাথে আপডেট হবে।
        </p>

        {/* Preset College Templates */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
            রেডিমেড কলেজ ও স্কুলের টেমপ্লেট লোড করুন:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_TEMPLATES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className="p-3 text-left bg-slate-50 hover:bg-emerald-50/70 dark:bg-slate-800/60 dark:hover:bg-emerald-950/40 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-600 transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {preset.header.subjectName} • {preset.header.totalMarks} নম্বর
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            পরীক্ষার তথ্যাবলী সম্পাদনা
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                প্রতিষ্ঠানের নাম (Institute Name)
              </label>
              <input
                type="text"
                value={header.instituteName}
                onChange={(e) => updateField('instituteName', e.target.value)}
                placeholder="যেমন: নওহাটা সরকারি ডিগ্রি কলেজ, রাজশাহী"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  পরীক্ষার নাম ও সাল (Exam & Year)
                </label>
                <input
                  type="text"
                  value={header.examName}
                  onChange={(e) => updateField('examName', e.target.value)}
                  placeholder="যেমন: এইচএসসি প্রাক-নির্বাচনী পরীক্ষা ২০২৬"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  প্রশ্নের ধরন (Question Type Title)
                </label>
                <input
                  type="text"
                  value={header.questionTypeTitle}
                  onChange={(e) => updateField('questionTypeTitle', e.target.value)}
                  placeholder="যেমন: সৃজনশীল প্রশ্ন / বহুনির্বাচনী"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  বিষয় (Subject)
                </label>
                <input
                  type="text"
                  value={header.subjectName}
                  onChange={(e) => updateField('subjectName', e.target.value)}
                  placeholder="ব্যবসায় সংগঠন ও ব্যবস্থাপনা"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  পত্র (Paper)
                </label>
                <input
                  type="text"
                  value={header.paperName}
                  onChange={(e) => updateField('paperName', e.target.value)}
                  placeholder="দ্বিতীয় পত্র"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  বিষয় কোড
                </label>
                <input
                  type="text"
                  value={header.subjectCode}
                  onChange={(e) => updateField('subjectCode', e.target.value)}
                  placeholder="২৭৮"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  সময়
                </label>
                <input
                  type="text"
                  value={header.examTime}
                  onChange={(e) => updateField('examTime', e.target.value)}
                  placeholder="২ ঘণ্টা ৩০ মিনিট"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  পূর্ণমান
                </label>
                <input
                  type="text"
                  value={header.totalMarks}
                  onChange={(e) => updateField('totalMarks', e.target.value)}
                  placeholder="৭০"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                সাধারণ নির্দেশনা (Instructions for Students)
              </label>
              <textarea
                rows={3}
                value={header.generalInstruction}
                onChange={(e) => updateField('generalInstruction', e.target.value)}
                placeholder="[বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। যেকোনো ৭টি প্রশ্নের উত্তর দাও]"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Header Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye size={15} />
              অফিসিয়াল প্রশ্নপত্র হেডার লাইভ প্রিভিউ (A4 Header Preview)
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              রিয়েল-টাইম সিঙ্ক
            </span>
          </div>

          {/* Paper Sheet Preview Container */}
          <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 font-bangla-serif relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] font-sans font-bold uppercase tracking-widest text-slate-300">
              A4 Top Format
            </div>

            {/* Institution Name */}
            <div className="text-center font-bold text-xl sm:text-2xl text-slate-900 tracking-normal pb-1">
              {header.instituteName || 'প্রতিষ্ঠানের নাম'}
            </div>

            {/* Exam Name */}
            <div className="text-center font-semibold text-base sm:text-lg text-slate-800 pb-1">
              {header.examName || 'পরীক্ষার নাম ও সাল'}
            </div>

            {/* Subject and Paper */}
            <div className="text-center font-semibold text-sm sm:text-base text-slate-800 pb-3">
              বিষয়: {header.subjectName || 'বিষয়'} {header.paperName ? `(${header.paperName})` : ''}
            </div>

            {/* Meta row 1: Type and Code */}
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold border-t border-slate-400 pt-2 pb-1">
              <span>{header.questionTypeTitle || 'সৃজনশীল প্রশ্ন'}</span>
              <span>বিষয় কোড: {header.subjectCode || '---'}</span>
            </div>

            {/* Meta row 2: Time and Marks */}
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold pb-2 border-b border-slate-400">
              <span>সময়: {header.examTime || '২ ঘণ্টা ৩০ মিনিট'}</span>
              <span>পূর্ণমান: {header.totalMarks || '৭০'}</span>
            </div>

            {/* Instructions */}
            {header.generalInstruction && (
              <div className="text-center text-xs text-slate-700 italic pt-3 px-4 leading-relaxed">
                {header.generalInstruction}
              </div>
            )}

            {/* Subtle Divider for question start */}
            <div className="mt-5 border-b border-dashed border-slate-300 relative text-center">
              <span className="bg-white px-2 text-[11px] text-slate-400 font-sans -top-2 relative">
                প্রশ্নাংশ নিচে শুরু হবে
              </span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                প্রসেসিংয়ের জন্য পাতা:
              </span>{' '}
              {uploadCount} টি পাতা প্রস্তুত আছে
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 font-medium">
              Gemini AI মাল্টিমডেল এক্সট্রাকশন সক্রিয়
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onPrev}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          <span>আগের ধাপ</span>
        </button>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>প্রশ্নপত্র তৈরি হচ্ছে... (এআই এক্সট্রাকশন)</span>
            </>
          ) : (
            <>
              <Sparkles size={20} className="text-amber-300" />
              <span>চূড়ান্ত প্রশ্নপত্র তৈরি করুন (Generate Exam Paper)</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
