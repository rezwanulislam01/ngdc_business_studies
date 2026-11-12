import React, { useState } from 'react';
import {
  Download,
  Printer,
  Edit3,
  Trash2,
  MoveUp,
  MoveDown,
  Plus,
  Copy,
  Check,
  Columns2,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { ExamHeaderInfo, QuestionItem, QuestionType } from '../types/exam';
import { generateDocxBlob, downloadBlob } from '../utils/docxExport';
import { AddQuestionModal } from './AddQuestionModal';

interface Step4OutputSectionProps {
  header: ExamHeaderInfo;
  questions: QuestionItem[];
  questionType: QuestionType;
  onUpdateQuestions: (questions: QuestionItem[]) => void;
  onPrev: () => void;
  isAiExtracted?: boolean;
}

export const Step4OutputSection: React.FC<Step4OutputSectionProps> = ({
  header,
  questions,
  questionType,
  onUpdateQuestions,
  onPrev,
  isAiExtracted,
}) => {
  const [isDualColumn, setIsDualColumn] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'paper' | 'manage'>('paper');

  // Handle docx download
  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generateDocxBlob(header, questions);
      const cleanName = (header.instituteName || 'Exam_Question_Paper')
        .replace(/[^a-zA-Z0-9\u0980-\u09FF_-]/g, '_')
        .substring(0, 30);
      downloadBlob(blob, `${cleanName}_Question_Paper.docx`);
    } catch (err) {
      console.error('Docx export error:', err);
      alert('Word ফাইল জেনারেট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Reordering
  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= questions.length) return;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    onUpdateQuestions(updated);
  };

  // Delete
  const deleteQuestion = (index: number) => {
    if (confirm('আপনি কি এই প্রশ্নটি মুছে ফেলতে চান?')) {
      const updated = questions.filter((_, i) => i !== index);
      onUpdateQuestions(updated);
    }
  };

  // Save from modal
  const handleSaveQuestion = (savedQ: QuestionItem) => {
    if (editingQuestion) {
      const updated = questions.map((q) => (q.id === savedQ.id ? savedQ : q));
      onUpdateQuestions(updated);
    } else {
      onUpdateQuestions([...questions, savedQ]);
    }
    setEditingQuestion(null);
    setShowAddModal(false);
  };

  // Copy plain text
  const handleCopyText = () => {
    let fullText = `${header.instituteName}\n${header.examName}\nবিষয়: ${header.subjectName} (${header.paperName})\n${header.questionTypeTitle} | বিষয় কোড: ${header.subjectCode}\nসময়: ${header.examTime} | পূর্ণমান: ${header.totalMarks}\n${header.generalInstruction}\n\n`;

    questions.forEach((q, i) => {
      fullText += `\n${q.questionNo || i + 1}। `;
      if (q.stem) fullText += `${q.stem}\n`;
      if (q.question) fullText += `${q.question}\n`;
      if (q.subQuestions) {
        q.subQuestions.forEach((s) => {
          fullText += `(${s.label}) ${s.question}  [${s.marks}]\n`;
        });
      }
      if (q.options) {
        q.options.forEach((opt) => {
          fullText += `${opt}  `;
        });
        fullText += `\n`;
      }
    });

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Toolbar Header (Hidden on Print) */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-[11px]">
                ৪
              </span>
              চতুর্থ ধাপ: চূড়ান্ত প্রশ্নপত্র ও এক্সপোর্ট
              {isAiExtracted && (
                <span className="ml-2 inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Sparkles size={11} /> এআই প্রস্তুতকৃত
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              প্রশ্নপত্র প্রিভিউ ও ডাউনলোড
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              মোট প্রশ্ন: {questions.length} টি • সরাসরি ওয়ার্ডে (.docx) ডাউনলোড অথবা A4 সাইজে প্রিন্ট নিন।
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <button
              onClick={() => setIsDualColumn(!isDualColumn)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                isDualColumn
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
              title="বোর্ড প্রশ্নপত্রের মত দ্বি-কলাম লেআউট"
            >
              <Columns2 size={15} />
              <span>{isDualColumn ? 'এক কলাম ভিউ' : 'দ্বি-কলাম লেআউট'}</span>
            </button>

            {/* Add New Question Button */}
            <button
              onClick={() => {
                setEditingQuestion(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
            >
              <Plus size={15} />
              <span>প্রশ্ন যোগ করুন</span>
            </button>

            {/* Copy Text */}
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
              title="সম্পূর্ণ টেক্সট কপি করুন"
            >
              {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
              <span>{copied ? 'কপি হয়েছে!' : 'টেক্সট কপি'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition shadow-sm cursor-pointer"
            >
              <Printer size={15} />
              <span>প্রিন্ট / PDF</span>
            </button>

            {/* MS Word (.docx) Button */}
            <button
              onClick={handleExportDocx}
              disabled={isExportingDocx}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download size={15} />
              <span>{isExportingDocx ? 'তৈরি হচ্ছে...' : 'MS Word (.docx) ডাউনলোড'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main A4 Exam Paper Simulation Sheet */}
      <div className="flex justify-center">
        <div
          className={`a4-exam-sheet w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl rounded-xl p-8 sm:p-12 border border-slate-200 font-bangla-serif transition-all ${
            isDualColumn ? 'dual-col' : ''
          }`}
        >
          {/* Institution Header (Centered) */}
          <div className="text-center pb-2 border-b-2 border-slate-900/80">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-bangla-serif">
              {header.instituteName || 'নওহাটা সরকারি ডিগ্রি কলেজ, রাজশাহী'}
            </h1>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 mt-0.5">
              {header.examName || 'এইচএসসি প্রাক-নির্বাচনী পরীক্ষা ২০২৬'}
            </h2>
            <div className="text-sm font-semibold text-slate-800 mt-0.5">
              বিষয়: {header.subjectName} {header.paperName ? `(${header.paperName})` : ''}
            </div>

            {/* Metadata Bar */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold border-t border-slate-700 pt-1.5 mt-2">
              <span>{header.questionTypeTitle || 'সৃজনশীল প্রশ্ন'}</span>
              <span>বিষয় কোড: {header.subjectCode || '২৭৮'}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold pb-1">
              <span>সময়: {header.examTime || '২ ঘণ্টা ৩০ মিনিট'}</span>
              <span>পূর্ণমান: {header.totalMarks || '৭০'}</span>
            </div>

            {/* Instruction */}
            {header.generalInstruction && (
              <div className="text-xs sm:text-[13px] text-slate-700 italic pt-1.5 leading-snug px-4">
                {header.generalInstruction}
              </div>
            )}
          </div>

          {/* Question List */}
          <div
            className={`mt-6 space-y-7 ${
              isDualColumn ? 'columns-1 sm:columns-2 gap-8 [column-rule:1px_dashed_#cbd5e1]' : ''
            }`}
          >
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="relative group break-inside-avoid pb-2 text-slate-900"
              >
                {/* Floating Quick Edit Controls (Hidden in print) */}
                <div className="no-print absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900/90 text-white p-1 rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => moveQuestion(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                    title="উপরে নিন"
                  >
                    <MoveUp size={13} />
                  </button>
                  <button
                    onClick={() => moveQuestion(idx, 'down')}
                    disabled={idx === questions.length - 1}
                    className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                    title="নিচে নিন"
                  >
                    <MoveDown size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingQuestion(q);
                      setShowAddModal(true);
                    }}
                    className="p-1 hover:bg-slate-800 text-amber-400 rounded"
                    title="সম্পাদনা করুন"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => deleteQuestion(idx)}
                    className="p-1 hover:bg-rose-700 text-rose-400 rounded"
                    title="মুছুন"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Creative Question (CQ) Layout */}
                {q.subQuestions && q.subQuestions.length > 0 ? (
                  <div>
                    {/* Stimulus / উদ্দীপক Box */}
                    <div className="text-[14.5px] leading-relaxed text-justify mb-2.5">
                      <span className="font-bold text-[15px] mr-1.5">
                        {q.questionNo || idx + 1}।
                      </span>
                      {q.stem && (
                        <span>
                          {q.stem}
                        </span>
                      )}
                    </div>

                    {/* Sub-questions table with right-aligned marks */}
                    <div className="space-y-1.5 pl-2 sm:pl-3 text-[14px]">
                      {q.subQuestions.map((sub, sIdx) => (
                        <div key={sIdx} className="flex items-start justify-between gap-3">
                          <div className="flex-1 leading-snug">
                            <span className="font-bold mr-1.5">({sub.label})</span>
                            <span>{sub.question}</span>
                          </div>
                          <div className="font-bold shrink-0 text-slate-800 text-right w-6">
                            {sub.marks}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : q.options && q.options.length > 0 ? (
                  /* MCQ Question Layout */
                  <div>
                    {q.context && (
                      <div className="text-xs italic text-slate-700 mb-1 leading-normal">
                        {q.context}
                      </div>
                    )}
                    <div className="flex items-start justify-between text-[14.5px] mb-2 font-medium">
                      <div>
                        <span className="font-bold mr-1.5">{q.questionNo || idx + 1}।</span>
                        <span>{q.question}</span>
                      </div>
                      <span className="font-bold text-xs text-slate-600">১</span>
                    </div>

                    {/* Options grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-4 text-xs sm:text-[13.5px]">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="text-slate-800">
                          {opt}
                        </div>
                      ))}
                    </div>

                    {/* Answer Key (Optionally shown in view, styled nicely) */}
                    {q.answer && (
                      <div className="no-print mt-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block font-sans">
                        সঠিক উত্তর: <span className="font-bold">{q.answer}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* General Question Layout */
                  <div className="flex items-start justify-between text-[14.5px]">
                    <div className="flex-1">
                      <span className="font-bold mr-1.5">{q.questionNo || idx + 1}।</span>
                      <span>{q.question || q.stem}</span>
                    </div>
                    {q.marks && (
                      <span className="font-bold text-slate-800 pl-3">
                        [{q.marks}]
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom End Mark */}
          <div className="mt-12 text-center text-xs font-serif text-slate-400">
            --- সমাপ্ত ---
          </div>
        </div>
      </div>

      {/* Navigation Footer (Hidden on print) */}
      <div className="no-print flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>লজিক বা তথ্য পরিবর্তন করুন</span>
        </button>

        <button
          onClick={handleExportDocx}
          disabled={isExportingDocx}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition cursor-pointer"
        >
          <Download size={17} />
          <span>{isExportingDocx ? 'তৈরি হচ্ছে...' : 'MS Word (.docx) ডাউনলোড করুন'}</span>
        </button>
      </div>

      {/* Add / Edit Question Modal */}
      {showAddModal && (
        <AddQuestionModal
          questionType={questionType}
          initialQuestion={editingQuestion}
          nextIndex={questions.length + 1}
          onSave={handleSaveQuestion}
          onClose={() => {
            setShowAddModal(false);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
};
