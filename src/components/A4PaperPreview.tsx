import React, { useState } from 'react';
import { Columns2, Download, Printer } from 'lucide-react';
import { ExamHeaderInfo, QuestionItem, QuestionType } from '../types/exam';

interface A4PaperPreviewProps {
  header: ExamHeaderInfo;
  questions: QuestionItem[];
  onExportDocx: () => void;
  onPrintPdf: () => void;
  isExportingDocx: boolean;
  questionType: QuestionType;
}

export const A4PaperPreview: React.FC<A4PaperPreviewProps> = ({
  header,
  questions,
  onExportDocx,
  onPrintPdf,
  isExportingDocx,
  questionType,
}) => {
  const isMcq = questionType === 'mcq' || questions.some((q) => q.options && q.options.length > 0);
  // Default to dual-column for MCQ (matching mcq_ques_57e172bd.pdf), and single column for CQ (matching Marketing_2.B_788519a1.pdf)
  const [isDualColumn, setIsDualColumn] = useState<boolean>(isMcq);

  return (
    <div className="space-y-4">
      {/* Top Controls inside preview */}
      <div className="no-print flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>বাস্তব A4 প্রশ্নপত্র ({isMcq ? 'বহুনির্বাচনি MCQ ফরম্যাট' : 'সৃজনশীল CQ ফরম্যাট'})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDualColumn(!isDualColumn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isDualColumn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="কলাম বিন্যাস পরিবর্তন করুন"
          >
            <Columns2 size={14} />
            <span>{isDualColumn ? 'এক কলাম ভিউ' : 'দ্বি-কলাম লেআউট'}</span>
          </button>

          <button
            onClick={onPrintPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer"
          >
            <Printer size={13} />
            <span>PDF প্রিন্ট</span>
          </button>

          <button
            onClick={onExportDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download size={13} />
            <span>Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="flex justify-center">
        <div
          className={`a4-exam-sheet w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-950 shadow-xl rounded-xl p-8 sm:p-11 border border-slate-200 font-bangla-serif transition-all ${
            isDualColumn ? 'dual-col' : ''
          }`}
        >
          {/* Header Layout (Matching image_1407a516.png and PDF) */}
          <div className="text-center pb-2 border-b border-slate-800">
            {/* 1. College Name */}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-bangla-serif">
              {header.instituteName || 'নওহাটা সরকারি ডিগ্রি কলেজ'}
            </h1>

            {/* 2. Exam Name */}
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mt-0.5">
              {header.examName || (isMcq ? 'প্রাক-নির্বাচনী পরীক্ষা ২০২৩' : 'নির্বাচনী পরীক্ষা ২০২৬')}
            </h2>

            {/* 3. Subject and Paper */}
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              বিষয়: {header.subjectName} {header.paperName ? `(${header.paperName})` : ''}
            </div>

            {/* 4. Type & Code row */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold pt-1.5">
              <span className="flex-1 text-center pl-16 sm:pl-20">
                {header.questionTypeTitle || (isMcq ? 'বহুনির্বাচনি প্রশ্ন' : 'সৃজনশীল প্রশ্ন')}
              </span>
              <span className="shrink-0 text-right">
                বিষয় কোড:{header.subjectCode || (isMcq ? '২৭৮' : '২৮৭')}
              </span>
            </div>

            {/* 5. Time & Marks row */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold pb-1.5">
              <span className="shrink-0 text-left">
                সময়:{header.examTime || (isMcq ? '৩০মিনিট' : '২ঘন্টা ৩০মিনিট')}
              </span>
              <span className="shrink-0 text-right">
                পূর্ণমান-{header.totalMarks || (isMcq ? '৩০' : '৭০')}
              </span>
            </div>

            {/* 6. General Instruction */}
            {header.generalInstruction && (
              <div className="text-xs sm:text-[13px] font-semibold text-slate-900 pt-1 leading-snug">
                {header.generalInstruction}
              </div>
            )}
          </div>

          {/* Question List */}
          <div
            className={`mt-6 ${
              isDualColumn ? 'columns-1 sm:columns-2 gap-7 [column-rule:1px_solid_#cbd5e1]' : 'space-y-6'
            }`}
          >
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className={`break-inside-avoid text-slate-950 ${
                  isMcq ? 'text-[13.5px] mb-4 pb-0.5' : 'text-[14.5px] pb-2'
                }`}
              >
                {/* MCQ Question Display */}
                {isMcq ? (
                  <div className="space-y-1">
                    {/* Stimulus / Context */}
                    {q.context && (
                      <div className="text-xs font-semibold text-slate-900 bg-slate-50 p-2 rounded border border-slate-200 mb-1 leading-snug whitespace-pre-line">
                        {q.context}
                      </div>
                    )}

                    {/* Question Statement */}
                    <div className="leading-snug whitespace-pre-line">
                      <span className="font-bold mr-1">{q.questionNo || idx + 1}.</span>
                      <span>{q.question || q.stem}</span>
                    </div>

                    {/* Options (ক, খ, গ, ঘ) in 2x2 grid */}
                    {q.options && (
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pt-1 pl-1 text-xs sm:text-[13px]">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="leading-tight text-slate-950 font-normal">
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Creative Question (CQ) Display */
                  <div>
                    {/* Stem Paragraph */}
                    <div className="leading-relaxed text-justify mb-2">
                      <span className="font-bold mr-1.5">{q.questionNo || idx + 1}।</span>
                      <span>{q.stem || q.question}</span>
                    </div>

                    {/* Sub-questions table with right-aligned marks */}
                    {q.subQuestions && (
                      <div className="space-y-1 pl-1 sm:pl-2 text-[14px]">
                        {q.subQuestions.map((sub, sIdx) => (
                          <div key={sIdx} className="flex items-start justify-between gap-3">
                            <div className="flex-1 leading-snug">
                              <span className="font-bold mr-1">({sub.label})</span>
                              <span>{sub.question}</span>
                            </div>
                            <div className="font-bold shrink-0 text-right w-6">
                              {sub.marks}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Document End Note */}
          <div className="mt-12 text-center text-xs text-slate-400 font-serif">
            --- সমাপ্ত ---
          </div>
        </div>
      </div>
    </div>
  );
};
