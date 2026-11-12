import React from 'react';
import {
  Trash2,
  MoveUp,
  MoveDown,
  Plus,
  Copy,
  RotateCcw,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { ExamHeaderInfo, QuestionItem, QuestionType } from '../types/exam';

interface InteractiveBoxEditorProps {
  header: ExamHeaderInfo;
  onChangeHeader: (header: ExamHeaderInfo) => void;
  questions: QuestionItem[];
  onChangeQuestions: (questions: QuestionItem[]) => void;
  onAddQuestion: () => void;
  onResetDefault: () => void;
  questionType: QuestionType;
}

export const InteractiveBoxEditor: React.FC<InteractiveBoxEditorProps> = ({
  header,
  onChangeHeader,
  questions,
  onChangeQuestions,
  onAddQuestion,
  onResetDefault,
  questionType,
}) => {
  const updateHeaderField = (field: keyof ExamHeaderInfo, value: string) => {
    onChangeHeader({
      ...header,
      [field]: value,
    });
  };

  const updateQuestionField = (
    index: number,
    field: keyof QuestionItem,
    value: any
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onChangeQuestions(updated);
  };

  const updateSubQuestion = (
    qIndex: number,
    subIndex: number,
    field: 'question' | 'marks',
    value: string
  ) => {
    const updated = [...questions];
    const q = updated[qIndex];
    if (q.subQuestions) {
      const subs = [...q.subQuestions];
      subs[subIndex] = { ...subs[subIndex], [field]: value };
      updated[qIndex] = { ...q, subQuestions: subs };
      onChangeQuestions(updated);
    }
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    const q = updated[qIndex];
    const opts = q.options ? [...q.options] : ['ক. ', 'খ. ', 'গ. ', 'ঘ. '];
    opts[optIndex] = value;
    updated[qIndex] = { ...q, options: opts };
    onChangeQuestions(updated);
  };

  const handleDeleteQuestion = (index: number) => {
    if (confirm(`আপনি কি ${questions[index].questionNo || index + 1} নং প্রশ্নটি মুছে ফেলতে চান?`)) {
      const updated = questions.filter((_, i) => i !== index);
      onChangeQuestions(updated);
    }
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= questions.length) return;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    onChangeQuestions(updated);
  };

  const handleDuplicateQuestion = (index: number) => {
    const original = questions[index];
    const duplicated: QuestionItem = {
      ...original,
      id: `copy-${Date.now()}`,
      questionNo: `${original.questionNo} (কপি)`,
    };
    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    onChangeQuestions(updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Information Input Boxes Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="font-bold text-base text-slate-900">
              পরীক্ষার তথ্য ও হেডার বক্স ({questionType === 'mcq' ? 'বহুনির্বাচনি প্রশ্ন' : 'সৃজনশীল প্রশ্ন'})
            </h2>
          </div>
          <button
            onClick={onResetDefault}
            className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium transition cursor-pointer"
            title="মূল তথ্যে ফিরে যান"
          >
            <RotateCcw size={13} />
            মূল তথ্যে রিসেট করুন
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* College Name Box */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              প্রতিষ্ঠানের নাম (College Name)
            </label>
            <input
              type="text"
              value={header.instituteName}
              onChange={(e) => updateHeaderField('instituteName', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="নওহাটা সরকারি ডিগ্রি কলেজ"
            />
          </div>

          {/* Exam Name Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              পরীক্ষার নাম ও সাল (Exam Name)
            </label>
            <input
              type="text"
              value={header.examName}
              onChange={(e) => updateHeaderField('examName', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="প্রাক-নির্বাচনী পরীক্ষা ২০২৬"
            />
          </div>

          {/* Subject Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              বিষয় (Subject Name)
            </label>
            <input
              type="text"
              value={header.subjectName}
              onChange={(e) => updateHeaderField('subjectName', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="ব্যবসায় সংগঠন ও ব্যবস্থাপনা"
            />
          </div>

          {/* Paper Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              পত্র (Paper)
            </label>
            <input
              type="text"
              value={header.paperName}
              onChange={(e) => updateHeaderField('paperName', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="দ্বিতীয় পত্র"
            />
          </div>

          {/* Question Type Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              প্রশ্নের ধরন (Question Type)
            </label>
            <input
              type="text"
              value={header.questionTypeTitle}
              onChange={(e) => updateHeaderField('questionTypeTitle', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder={questionType === 'mcq' ? 'বহুনির্বাচনি প্রশ্ন' : 'সৃজনশীল প্রশ্ন'}
            />
          </div>

          {/* Subject Code Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              বিষয় কোড (Subject Code)
            </label>
            <input
              type="text"
              value={header.subjectCode}
              onChange={(e) => updateHeaderField('subjectCode', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="২৭৮"
            />
          </div>

          {/* Time Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              সময় (Exam Time)
            </label>
            <input
              type="text"
              value={header.examTime}
              onChange={(e) => updateHeaderField('examTime', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder={questionType === 'mcq' ? '৩০ মিনিট' : '২ঘন্টা ৩০মিনিট'}
            />
          </div>

          {/* Full Marks Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              পূর্ণমান (Total Marks)
            </label>
            <input
              type="text"
              value={header.totalMarks}
              onChange={(e) => updateHeaderField('totalMarks', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder={questionType === 'mcq' ? '৩০' : '৭০'}
            />
          </div>

          {/* General Instruction Box */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              সাধারণ নির্দেশনা (General Instruction)
            </label>
            <input
              type="text"
              value={header.generalInstruction}
              onChange={(e) => updateHeaderField('generalInstruction', e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder={
                questionType === 'mcq'
                  ? '(প্রত্যেকটি প্রশ্নের উত্তর দিতে হবে। প্রতিটি প্রশ্নের মান ১)'
                  : '(যেকোনো ৭ টি প্রশ্নের উত্তর দিতে হবে। প্রতিটি প্রশ্নের মান ১০)'
              }
            />
          </div>
        </div>
      </div>

      {/* 2. Questions Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              {questionType === 'mcq'
                ? `বহুনির্বাচনি প্রশ্নমালা বক্স (মোট ${questions.length}টি MCQ)`
                : `সৃজনশীল প্রশ্নমালা বক্স (মোট ${questions.length}টি CQ)`}
            </h3>
          </div>

          <button
            onClick={onAddQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Plus size={15} />
            <span>{questionType === 'mcq' ? 'নতুন MCQ যোগ করুন' : 'নতুন সৃজনশীল প্রশ্ন যোগ করুন'}</span>
          </button>
        </div>

        {/* List of question cards */}
        {questions.map((q, qIdx) => (
          <div
            key={q.id || qIdx}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-3.5"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">প্রশ্ন নং:</span>
                <input
                  type="text"
                  value={q.questionNo}
                  onChange={(e) => updateQuestionField(qIdx, 'questionNo', e.target.value)}
                  className="w-14 px-2 py-1 text-sm font-bold text-center rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveQuestion(qIdx, 'up')}
                  disabled={qIdx === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition"
                  title="উপরে নিন"
                >
                  <MoveUp size={14} />
                </button>
                <button
                  onClick={() => handleMoveQuestion(qIdx, 'down')}
                  disabled={qIdx === questions.length - 1}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition"
                  title="নিচে নিন"
                >
                  <MoveDown size={14} />
                </button>
                <button
                  onClick={() => handleDuplicateQuestion(qIdx)}
                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                  title="ডুপ্লিকেট / কপি করুন"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(qIdx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="মুছে ফেলুন"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* MCQ Layout */}
            {questionType === 'mcq' || (q.options && q.options.length > 0) ? (
              <div className="space-y-3">
                {/* Optional Context/Stimulus for MCQ */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    উদ্দীপক বা নির্দেশনা (যদি থাকে, যেমন: নিচের উদ্দীপকটি পড়ে ৫ ও ৬ নং প্রশ্নের উত্তর দাও):
                  </label>
                  <input
                    type="text"
                    value={q.context || ''}
                    onChange={(e) => updateQuestionField(qIdx, 'context', e.target.value)}
                    placeholder="উদ্দীপক থাকলে এখানে লিখুন (ঐচ্ছিক)"
                    className="w-full px-3 py-1.5 text-xs italic rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Main MCQ Question text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মূল প্রশ্ন বক্স:
                  </label>
                  <input
                    type="text"
                    value={q.question || q.stem || ''}
                    onChange={(e) => updateQuestionField(qIdx, 'question', e.target.value)}
                    placeholder="প্রশ্ন লিখুন..."
                    className="w-full px-3 py-2 text-sm font-medium rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Options (ক, খ, গ, ঘ) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    বিকল্পসমূহ (ক, খ, গ, ঘ):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(q.options || ['ক. ', 'খ. ', 'গ. ', 'ঘ. ']).map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(qIdx, optIdx, e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answer box */}
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                  <span className="font-semibold">সঠিক উত্তর:</span>
                  <input
                    type="text"
                    value={q.answer || ''}
                    onChange={(e) => updateQuestionField(qIdx, 'answer', e.target.value)}
                    placeholder="যেমন: খ. অথবা গ."
                    className="w-32 px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            ) : (
              /* Creative Question (CQ) Layout */
              <div className="space-y-3">
                {/* Stimulus (উদ্দীপক) Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    উদ্দীপক বক্স (Stimulus):
                  </label>
                  <textarea
                    rows={3}
                    value={q.stem || ''}
                    onChange={(e) => updateQuestionField(qIdx, 'stem', e.target.value)}
                    placeholder="উদ্দীপক লিখুন..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition font-bangla-sans leading-relaxed"
                  />
                </div>

                {/* Sub-Questions Boxes (ক, খ, গ, ঘ) */}
                {q.subQuestions && (
                  <div className="space-y-2 pt-1">
                    <span className="block text-xs font-bold text-slate-700">
                      উপ-প্রশ্নমালা ও নম্বর (ক, খ, গ, ঘ):
                    </span>
                    <div className="space-y-2">
                      {q.subQuestions.map((sub, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm border border-emerald-200">
                            {sub.label}
                          </span>
                          <input
                            type="text"
                            value={sub.question}
                            onChange={(e) =>
                              updateSubQuestion(qIdx, sIdx, 'question', e.target.value)
                            }
                            placeholder={`(${sub.label}) প্রশ্ন লিখুন`}
                            className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                          />
                          <input
                            type="text"
                            value={sub.marks}
                            onChange={(e) =>
                              updateSubQuestion(qIdx, sIdx, 'marks', e.target.value)
                            }
                            placeholder="মান"
                            className="w-14 px-2 py-1.5 text-sm text-center font-bold rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
                            title="প্রশ্নের পূর্ণমান"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add Question Card at Bottom */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onAddQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg transition cursor-pointer"
          >
            <Plus size={18} />
            <span>{questionType === 'mcq' ? 'নতুন বহুনির্বাচনি প্রশ্ন যোগ করুন' : 'নতুন সৃজনশীল প্রশ্ন যোগ করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
