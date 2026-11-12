export type QuestionType = 'cq' | 'mcq' | 'general';
export type NumberStyle = 'bengali' | 'english';

export interface SubQuestion {
  label: string; // 'ক', 'খ', 'গ', 'ঘ' or 'a', 'b', 'c', 'd'
  question: string;
  marks: string; // '১', '২', '৩', '৪'
}

export interface QuestionItem {
  id: string;
  questionNo: string; // '১', '২' etc
  chapterOrTopic?: string;
  context?: string; // Stimulus for MCQ
  stem?: string; // উদ্দীপক for CQ
  question?: string; // For MCQ or General
  options?: string[]; // For MCQ: ['ক) ...', 'খ) ...', 'গ) ...', 'ঘ) ...']
  answer?: string; // Answer key
  subQuestions?: SubQuestion[]; // For CQ: 4 sub-questions
  marks?: string; // Total marks e.g. '১০'
}

export interface ExamHeaderInfo {
  instituteName: string;
  examName: string;
  subjectName: string;
  paperName: string; // e.g. প্রথম পত্র / দ্বিতীয় পত্র
  subjectCode: string; // e.g. ২৭৮
  questionTypeTitle: string; // e.g. সৃজনশীল প্রশ্ন / বহুনির্বাচনী প্রশ্ন
  examTime: string; // e.g. ২ ঘণ্টা ৩০ মিনিট
  totalMarks: string; // e.g. ৭০
  generalInstruction: string; // e.g. [বিশেষ দ্রষ্টব্য: ডান পাশের সংখ্যা প্রশ্নের পূর্ণমান জ্ঞাপক। যেকোনো ৭টি প্রশ্নের উত্তর দিতে হবে।]
}

export interface UploadedPage {
  id: string;
  name: string;
  pageNumber: number;
  previewUrl: string; // Data URL or object URL
  fileSize?: string;
  sourceType: 'image' | 'pdf' | 'sample';
}

export interface LogicPhoto {
  id: string;
  name: string;
  previewUrl: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  header: ExamHeaderInfo;
  defaultQuestionType: QuestionType;
  defaultLogic: string;
}
