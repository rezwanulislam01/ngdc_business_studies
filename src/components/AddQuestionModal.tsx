import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { QuestionItem, QuestionType } from '../types/exam';

interface AddQuestionModalProps {
  questionType: QuestionType;
  initialQuestion?: QuestionItem | null;
  onSave: (question: QuestionItem) => void;
  onClose: () => void;
  nextIndex: number;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  questionType,
  initialQuestion,
  onSave,
  onClose,
  nextIndex,
}) => {
  const [questionNo, setQuestionNo] = useState(
    initialQuestion?.questionNo || String(nextIndex)
  );
  const [chapterOrTopic, setChapterOrTopic] = useState(
    initialQuestion?.chapterOrTopic || ''
  );
  const [stem, setStem] = useState(initialQuestion?.stem || '');
  const [questionText, setQuestionText] = useState(
    initialQuestion?.question || ''
  );
  const [context, setContext] = useState(initialQuestion?.context || '');
  const [marks, setMarks] = useState(initialQuestion?.marks || '১০');

  // Sub questions for CQ
  const [subQuestions, setSubQuestions] = useState(
    initialQuestion?.subQuestions || [
      { label: 'ক', question: '', marks: '১' },
      { label: 'খ', question: '', marks: '২' },
      { label: 'গ', question: '', marks: '৩' },
      { label: 'ঘ', question: '', marks: '৪' },
    ]
  );

  // Options for MCQ
  const [options, setOptions] = useState<string[]>(
    initialQuestion?.options || ['ক) ', 'খ) ', 'গ) ', 'ঘ) ']
  );
  const [answer, setAnswer] = useState(initialQuestion?.answer || '');

  const handleSubChange = (index: number, field: 'question' | 'marks', val: string) => {
    const updated = [...subQuestions];
    updated[index] = { ...updated[index], [field]: val };
    setSubQuestions(updated);
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newQ: QuestionItem = {
      id: initialQuestion?.id || `custom-q-${Date.now()}`,
      questionNo,
      chapterOrTopic,
      marks: questionType === 'cq' ? '১০' : marks,
    };

    if (questionType === 'cq') {
      newQ.stem = stem;
      newQ.subQuestions = subQuestions;
    } else if (questionType === 'mcq') {
      newQ.context = context;
      newQ.question = questionText;
      newQ.options = options;
      newQ.answer = answer;
      newQ.marks = '১';
    } else {
      newQ.question = questionText;
      newQ.marks = marks;
    }

    onSave(newQ);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {initialQuestion ? 'প্রশ্ন সম্পাদনা করুন' : 'নতুন প্রশ্ন যুক্ত করুন'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                প্রশ্ন নম্বর (যেমন: ১, ২, ৩)
              </label>
              <input
                type="text"
                required
                value={questionNo}
                onChange={(e) => setQuestionNo(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                অধ্যায় বা টপিক (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={chapterOrTopic}
                onChange={(e) => setChapterOrTopic(e.target.value)}
                placeholder="যেমন: দ্বিতীয় অধ্যায়"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {questionType === 'cq' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  উদ্দীপক (Stimulus / Stem)
                </label>
                <textarea
                  rows={4}
                  required
                  value={stem}
                  onChange={(e) => setStem(e.target.value)}
                  placeholder="উদ্দীপকের সম্পূর্ণ টেক্সট লিখুন..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bangla-sans"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  উপ-প্রশ্নসমূহ (ক, খ, গ, ঘ):
                </label>
                {subQuestions.map((sub, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-sm">
                      {sub.label}
                    </span>
                    <input
                      type="text"
                      required
                      value={sub.question}
                      onChange={(e) => handleSubChange(i, 'question', e.target.value)}
                      placeholder={`(${sub.label}) প্রশ্ন লিখুন`}
                      className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={sub.marks}
                      onChange={(e) => handleSubChange(i, 'marks', e.target.value)}
                      placeholder="মান"
                      className="w-16 px-2 py-2 text-sm text-center font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {questionType === 'mcq' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  উদ্দীপক বা নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="যেমন: নিচের উদ্দীপকটি পড়ে ১ ও ২ নং প্রশ্নের উত্তর দাও:"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  মূল প্রশ্ন
                </label>
                <textarea
                  rows={2}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="বহুনির্বাচনী প্রশ্নটি লিখুন..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  বিকল্পসমূহ (Options)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {options.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      className="px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  সঠিক উত্তর (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="যেমন: ক) অথবা খ)"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {questionType === 'general' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  প্রশ্ন বিবরণ
                </label>
                <textarea
                  rows={4}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="প্রশ্নটি লিখুন..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  প্রশ্নের পূর্ণমান
                </label>
                <input
                  type="text"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="যেমন: ১০"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
