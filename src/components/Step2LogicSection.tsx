import React, { useRef } from 'react';
import {
  Sparkles,
  Camera,
  Trash2,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Settings2,
  ListOrdered,
  HelpCircle,
  Eye,
  Sliders,
  Scissors
} from 'lucide-react';
import { LogicPhoto, NumberStyle, QuestionType } from '../types/exam';
import { PRESET_LOGIC_CHIPS } from '../data/presetTemplates';

interface Step2LogicSectionProps {
  logicPhotos: LogicPhoto[];
  onSetLogicPhotos: (photos: LogicPhoto[]) => void;
  logicText: string;
  onSetLogicText: (text: string) => void;
  numberStyle: NumberStyle;
  onSetNumberStyle: (style: NumberStyle) => void;
  questionType: QuestionType;
  onSetQuestionType: (type: QuestionType) => void;
  stripAnswers: boolean;
  onSetStripAnswers: (strip: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Step2LogicSection: React.FC<Step2LogicSectionProps> = ({
  logicPhotos,
  onSetLogicPhotos,
  logicText,
  onSetLogicText,
  numberStyle,
  onSetNumberStyle,
  questionType,
  onSetQuestionType,
  stripAnswers,
  onSetStripAnswers,
  onPrev,
  onNext,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleLogicPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        onSetLogicPhotos([
          ...logicPhotos,
          {
            id: `logic-photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            previewUrl: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (id: string) => {
    onSetLogicPhotos(logicPhotos.filter((p) => p.id !== id));
  };

  const handleApplyChip = (chip: string) => {
    if (!logicText.trim()) {
      onSetLogicText(chip);
    } else {
      onSetLogicText(`${logicText}\n• ${chip}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1">
          <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-xs">
            ২
          </span>
          দ্বিতীয় ধাপ: প্রশ্ন নির্বাচন লজিক ও সেটিংস
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          কোন প্রশ্নগুলো কীভাবে সাজাবেন তা নির্দেশ করুন
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          হাতে লেখা প্রশ্নের তালিকা বা গোল দাগ দেওয়া প্রশ্নপত্রের ছবি আপলোড করতে পারেন, অথবা নিচের কুইক চিপ ও নির্দেশিকা বক্সে আপনার পছন্দের লজিক লিখে দিন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Logic Text & Reference Photo Upload */}
        <div className="lg:col-span-8 space-y-6">
          {/* Reference Photo Upload Area */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Camera size={20} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  রেফারেন্স ফটো আপলোড (হাতে লেখা প্রশ্নের লিস্ট / গোল দাগানো খাতা)
                </h3>
              </div>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                ঐচ্ছিক (Optional)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              শিক্ষক হিসেবে আপনি কি ডায়েরিতে কোনো সিরিয়াল বা প্রশ্নের নম্বর নোট করেছেন? সেই পাতার ছবি এখানে দিলে এআই সরাসরি মিলিয়ে নেবে।
            </p>

            <input
              ref={photoInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleLogicPhotoUpload}
            />

            {/* Photo Preview Strip or Add Button */}
            <div className="flex flex-wrap items-center gap-3">
              {logicPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-500 bg-slate-100 dark:bg-slate-800 shadow-xs"
                >
                  <img src={photo.previewUrl} alt={photo.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="ছবি মুছুন"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[10px] text-white px-1 py-0.5 truncate text-center">
                    রেফারেন্স
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 flex flex-col items-center justify-center gap-1 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-50/50 dark:bg-slate-900/50 transition-colors cursor-pointer"
              >
                <Camera size={22} />
                <span className="text-[11px] font-medium text-center leading-tight">ছবি যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Logic Text Area & Chips */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileCheck2 size={19} className="text-emerald-600 dark:text-emerald-400" />
                প্রশ্ন নির্বাচন নির্দেশিকা (Custom Logic Prompt)
              </label>
              {logicText && (
                <button
                  onClick={() => onSetLogicText('')}
                  className="text-xs text-slate-400 hover:text-rose-500 transition"
                >
                  ক্লিয়ার করুন
                </button>
              )}
            </div>

            {/* Quick Preset Logic Chips */}
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                কুইক লজিক চিপস (ক্লিক করে যোগ করুন):
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_LOGIC_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleApplyChip(chip)}
                    className="text-xs bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-700 transition text-left cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text Area */}
            <textarea
              rows={5}
              value={logicText}
              onChange={(e) => onSetLogicText(e.target.value)}
              placeholder="উদাহরণ: ১ নং পেজ থেকে ১ম ও ৩য় সৃজনশীল, ২ নং পেজ থেকে ২য় প্রশ্ন নিন এবং ক্রমিক ১, ২, ৩ সাজান। উদ্দীপক যেন বাস্তব জীবনের ব্যবসা সংক্রান্ত হয়।"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-bangla-sans"
            />
          </div>
        </div>

        {/* Right Column: Settings & Toggles */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders size={20} className="text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                পরীক্ষা ও ফরম্যাটিং সেটিংস
              </h3>
            </div>

            {/* Question Type Radio */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                প্রশ্নের ধরন (Question Format)
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'cq',
                    title: 'সৃজনশীল প্রশ্ন (CQ)',
                    desc: 'উদ্দীপক + ক, খ, গ, ঘ (মান: ১, ২, ৩, ৪)',
                  },
                  {
                    id: 'mcq',
                    title: 'বহুনির্বাচনী অভীক্ষা (MCQ)',
                    desc: 'প্রশ্ন + ৪টি বিকল্প (ক, খ, গ, ঘ) [মান: ১]',
                  },
                  {
                    id: 'general',
                    title: 'সাধারণ / সংক্ষিপ্ত প্রশ্ন',
                    desc: 'বর্ণনামূলক প্রচলিত প্রশ্নমালা',
                  },
                ].map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      questionType === type.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="questionType"
                      checked={questionType === type.id}
                      onChange={() => onSetQuestionType(type.id as QuestionType)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {type.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {type.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Number Style Toggle */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                সংখ্যা ও ক্রমিক ফরম্যাট (Numbering)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSetNumberStyle('bengali')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition ${
                    numberStyle === 'bengali'
                      ? 'border-emerald-500 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base font-bold">১, ২, ৩, ৪</span>
                  <span>বাংলা সংখ্যা</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSetNumberStyle('english')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition ${
                    numberStyle === 'english'
                      ? 'border-emerald-500 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base font-bold">1, 2, 3, 4</span>
                  <span>ইংরেজি সংখ্যা</span>
                </button>
              </div>
            </div>

            {/* Strip Answers Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stripAnswers}
                  onChange={(e) => onSetStripAnswers(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Scissors size={14} className="text-amber-500" />
                    বইয়ের উত্তরমালা ও সমাধান বাদ দিন
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    বইয়ের পাতার নিচে থাকা ব্যাখ্যা, উত্তর সংকেত বা গাইডলাইন সম্পূর্ণ মুছে শুধু মূল প্রশ্ন রাখবে।
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>আগের ধাপ</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <span>পরবর্তী ধাপ: পরীক্ষার তথ্য ও হেডার</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};
