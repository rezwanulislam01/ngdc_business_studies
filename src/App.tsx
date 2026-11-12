import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { InteractiveBoxEditor } from './components/InteractiveBoxEditor';
import { A4PaperPreview } from './components/A4PaperPreview';
import { AiUploaderModal } from './components/AiUploaderModal';
import { ExamHeaderInfo, QuestionItem, QuestionType } from './types/exam';
import {
  NOWHATA_DEFAULT_HEADER,
  NOWHATA_DEFAULT_QUESTIONS,
} from './data/nowhataDefaultData';
import {
  NOWHATA_MCQ_HEADER,
  NOWHATA_MCQ_QUESTIONS,
} from './data/nowhataMcqDefaultData';
import { generateDocxBlob, downloadBlob } from './utils/docxExport';

export default function App() {
  // Current active mode: 'cq' (সৃজনশীল) or 'mcq' (বহুনির্বাচনি)
  const [questionType, setQuestionType] = useState<QuestionType>('cq');

  // Headers for each mode
  const [cqHeader, setCqHeader] = useState<ExamHeaderInfo>(NOWHATA_DEFAULT_HEADER);
  const [mcqHeader, setMcqHeader] = useState<ExamHeaderInfo>(NOWHATA_MCQ_HEADER);

  // Questions for each mode
  const [cqQuestions, setCqQuestions] = useState<QuestionItem[]>(
    NOWHATA_DEFAULT_QUESTIONS
  );
  const [mcqQuestions, setMcqQuestions] = useState<QuestionItem[]>(
    NOWHATA_MCQ_QUESTIONS
  );

  // View mode: 'split' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  // Active header and questions based on current mode
  const activeHeader = questionType === 'mcq' ? mcqHeader : cqHeader;
  const activeQuestions = questionType === 'mcq' ? mcqQuestions : cqQuestions;

  const setActiveHeader = (newHeader: ExamHeaderInfo) => {
    if (questionType === 'mcq') {
      setMcqHeader(newHeader);
    } else {
      setCqHeader(newHeader);
    }
  };

  const setActiveQuestions = (newQuestions: QuestionItem[]) => {
    if (questionType === 'mcq') {
      setMcqQuestions(newQuestions);
    } else {
      setCqQuestions(newQuestions);
    }
  };

  // Export to Word (.docx)
  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generateDocxBlob(activeHeader, activeQuestions);
      const cleanTitle = (activeHeader.instituteName || 'Nowhata_Govt_College')
        .replace(/[^a-zA-Z0-9\u0980-\u09FF_-]/g, '_')
        .substring(0, 30);
      const typeLabel = questionType === 'mcq' ? 'MCQ' : 'CQ';
      downloadBlob(
        blob,
        `${cleanTitle}_${typeLabel}_${activeHeader.subjectCode || '287'}.docx`
      );
    } catch (err) {
      console.error('Word export error:', err);
      alert('Word ফাইল ডাউনলোডে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Print to PDF
  const handlePrintPdf = () => {
    window.print();
  };

  // Add new question
  const handleAddQuestion = () => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const nextNumber = activeQuestions.length + 1;
    const bnNum = String(nextNumber).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);

    if (questionType === 'mcq') {
      const newMcq: QuestionItem = {
        id: `mcq-${Date.now()}`,
        questionNo: bnNum,
        context: '',
        question: '',
        options: ['ক. ', 'খ. ', 'গ. ', 'ঘ. '],
        answer: '',
        marks: '১',
      };
      setActiveQuestions([...activeQuestions, newMcq]);
    } else {
      const newCq: QuestionItem = {
        id: `cq-${Date.now()}`,
        questionNo: bnNum,
        stem: '',
        subQuestions: [
          { label: 'ক', question: '', marks: '১' },
          { label: 'খ', question: '', marks: '২' },
          { label: 'গ', question: '', marks: '৩' },
          { label: 'ঘ', question: '', marks: '৪' },
        ],
      };
      setActiveQuestions([...activeQuestions, newCq]);
    }
  };

  // Reset to original default questions
  const handleResetDefault = () => {
    if (questionType === 'mcq') {
      if (confirm('আপনি কি বহুনির্বাচনি (MCQ) এর মূল ৩০টি প্রশ্নে ফিরে যেতে চান?')) {
        setMcqHeader(NOWHATA_MCQ_HEADER);
        setMcqQuestions(NOWHATA_MCQ_QUESTIONS);
      }
    } else {
      if (confirm('আপনি কি সৃজনশীল (CQ) এর মূল ১১টি প্রশ্নে ফিরে যেতে চান?')) {
        setCqHeader(NOWHATA_DEFAULT_HEADER);
        setCqQuestions(NOWHATA_DEFAULT_QUESTIONS);
      }
    }
  };

  // When AI extracts from uploaded book/photo
  const handleAiExtracted = (newQuestions: QuestionItem[], type: QuestionType) => {
    if (type === 'mcq') {
      setQuestionType('mcq');
      setMcqQuestions([...mcqQuestions, ...newQuestions]);
    } else {
      setQuestionType('cq');
      setCqQuestions([...cqQuestions, ...newQuestions]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-bangla-sans">
      {/* Top Navbar with CQ/MCQ Switcher */}
      <HeaderNav
        collegeName={activeHeader.instituteName}
        questionType={questionType}
        onSelectQuestionType={setQuestionType}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        onExportDocx={handleExportDocx}
        onPrintPdf={handlePrintPdf}
        onOpenAiUploader={() => setShowAiModal(true)}
        isExportingDocx={isExportingDocx}
        questionCount={activeQuestions.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Split Screen Mode: Boxes on the Left, Live A4 Preview on the Right */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Input Boxes */}
            <div className="lg:col-span-6 no-print">
              <InteractiveBoxEditor
                header={activeHeader}
                onChangeHeader={setActiveHeader}
                questions={activeQuestions}
                onChangeQuestions={setActiveQuestions}
                onAddQuestion={handleAddQuestion}
                onResetDefault={handleResetDefault}
                questionType={questionType}
              />
            </div>

            {/* Right: Live A4 Preview (Sticky & Responsive) */}
            <div className="lg:col-span-6 lg:sticky lg:top-24">
              <A4PaperPreview
                header={activeHeader}
                questions={activeQuestions}
                onExportDocx={handleExportDocx}
                onPrintPdf={handlePrintPdf}
                isExportingDocx={isExportingDocx}
                questionType={questionType}
              />
            </div>
          </div>
        )}

        {/* Editor Only Mode */}
        {viewMode === 'editor' && (
          <div className="max-w-4xl mx-auto no-print">
            <InteractiveBoxEditor
              header={activeHeader}
              onChangeHeader={setActiveHeader}
              questions={activeQuestions}
              onChangeQuestions={setActiveQuestions}
              onAddQuestion={handleAddQuestion}
              onResetDefault={handleResetDefault}
              questionType={questionType}
            />
          </div>
        )}

        {/* Preview Only Mode */}
        {viewMode === 'preview' && (
          <div className="max-w-4xl mx-auto">
            <A4PaperPreview
              header={activeHeader}
              questions={activeQuestions}
              onExportDocx={handleExportDocx}
              onPrintPdf={handlePrintPdf}
              isExportingDocx={isExportingDocx}
              questionType={questionType}
            />
          </div>
        )}
      </main>

      {/* AI Page/Photo/PDF Uploader Modal */}
      {showAiModal && (
        <AiUploaderModal
          currentQuestionType={questionType}
          onClose={() => setShowAiModal(false)}
          onExtracted={handleAiExtracted}
        />
      )}

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-700">
            {activeHeader.instituteName} • {questionType === 'mcq' ? 'বহুনির্বাচনি (MCQ)' : 'সৃজনশীল (CQ)'} প্রশ্নপত্র প্রস্তুতকারক
          </span>
          <div className="flex items-center gap-3">
            <span>Microsoft Word (.docx) ফাইল সাপোর্ট</span>
            <span>•</span>
            <span>A4 PDF প্রিন্ট সাপোর্ট</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
