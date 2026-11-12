import { UploadedPage } from '../types/exam';

/**
 * Creates authentic looking scanned textbook page images using HTML5 Canvas.
 * These simulate real Bangladeshi Board HSC Business Studies textbook pages with Bangla typography,
 * diagrams/tables, stimulus (উদ্দীপক), and sub-questions (ক, খ, গ, ঘ).
 */
export function generateSampleTextbookPages(): UploadedPage[] {
  const pages: UploadedPage[] = [];

  const pageContents = [
    {
      pageNo: 1,
      chapter: 'অধ্যায় ২: ব্যবস্থাপনার নীতিমালা ও পদ্ধতি',
      bookTitle: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা — দ্বিতীয় পত্র (এইচএসসি)',
      pageLabel: 'পৃষ্ঠা: ১২৪',
      cqTitle: 'সৃজনশীল প্রশ্ন — ০১ (ঢাকা বোর্ড ২০২০ অনুরুপ)',
      stem: 'জনাব আহসান হাবীব রাজশাহী শহরের কেন্দ্রস্থলে আধুনিক প্রযুক্তি সংবলিত একটি ডেইরি ফার্ম গড়ে তোলেন। খামারে স্বাস্থ্যসম্মত উপায়ে দুধ দোহন ও কোল্ড চেইনের মাধ্যমে প্যাকেটজাত করে বিপণন করা হয়। তিনি কর্মীদের কাজের গতি ও সততার মূল্যায়ন করে নিয়মিত প্রণোদনা ভাতা প্রদান করেন। তাঁর সফলতায় উদ্বুদ্ধ হয়ে এলাকার আরও বেশ কয়েকজন তরুণ ডেইরি খামার স্থাপন করায় এলাকায় একটি টেকসই অর্থনৈতিক প্রবাহ গড়ে উঠেছে। তবে বর্ষা মৌসুমে গো-খাদ্যের অস্বাভাবিক মূল্যবৃদ্ধির কারণে প্রতিষ্ঠানটি কাঁচামাল সংকটে পড়ে।',
      questions: [
        'ক. ব্যবস্থাপনার আধুনিক ধারণার প্রবক্তা কে? [মান: ১]',
        'খ. "ব্যবস্থাপনা একটি সামাজিক প্রক্রিয়া"—ব্যাখ্যা কর। [মান: ২]',
        'গ. উদ্দীপকে জনাব হাবীবের কার্যক্রমে ব্যবস্থাপনার কোন নীতিটি সুস্পষ্টভাবে প্রতিফলিত হয়েছে? আলোচনা কর। [মান: ৩]',
        'ঘ. গো-খাদ্যের সংকট কাটিয়ে উঠতে জনাব হাবীবের জন্য কোন পরিকল্পনা কৌশল সবচেয়ে ফলপ্রসূ হবে? যুক্তিসহ বিশ্লেষণ কর। [মান: ৪]'
      ],
      sideNote: 'নোট ও বোর্ডের নির্দেশিকা: এটি উচ্চ মাধ্যমিক পরীক্ষার জন্য অতি গুরুত্বপূর্ণ একটি প্রয়োগভিত্তিক প্রশ্ন।'
    },
    {
      pageNo: 2,
      chapter: 'অধ্যায় ৩: পরিকল্পনা প্রণয়ন ও সিদ্ধান্ত গ্রহণ',
      bookTitle: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা — দ্বিতীয় পত্র (এইচএসসি)',
      pageLabel: 'পৃষ্ঠা: ১২৫',
      cqTitle: 'সৃজনশীল প্রশ্ন — ০২ (রাজশাহী বোর্ড ২০২৩)',
      stem: 'নওহাটা এগ্রো প্রসেসিং লিমিটেড উত্তরবঙ্গের আম ও টমেটো প্রক্রিয়াজাত করে জ্যাম ও সস তৈরি করে। ব্যবস্থাপনা পরিচালক মি. মোস্তাফিজুর রহমান আগামী অর্থবছরের জন্য উৎপাদন লক্ষ্যমাত্রা ৩০% বৃদ্ধির সিদ্ধান্ত নেন। কিন্তু তিনি লক্ষ্যমাত্রা অর্জনের জন্য মধ্যম ও নিম্নস্তরের কর্মকর্তাদের সাথে কোনো প্রকার সমন্বয় সভা না করেই এককভাবে আদেশ জারি করেন। ফলে মাঠপর্যায়ের কর্মীরা লক্ষ্যমাত্রা পূরণে ব্যর্থ হয় এবং কাঁচামাল নষ্ট হয়ে কোম্পানির বিপুল আর্থিক ক্ষতি সাধিত হয়।',
      questions: [
        'ক. পরিকল্পনা কী? [মান: ১]',
        'খ. "পরিকল্পনাকে ভবিষ্যতের আয়না বলা হয়"—কেন? [মান: ২]',
        'গ. উদ্দীপকে নওহাটা এগ্রো এর ব্যর্থতার পেছনে পরিকল্পনার কোন প্রধান সীমাবদ্ধতা দায়ী? পাঠ্যবইয়ের আলোকে বর্ণনা কর। [মান: ৩]',
        'ঘ. ভবিষ্যতে এ ধরণের ক্ষতি এড়াতে মি. মোস্তাফিজুর রহমানের ব্যবস্থাপনায় গণতান্ত্রিক নেতৃত্বের ভূমিকা মূল্যায়ন কর। [মান: ৪]'
      ],
      sideNote: 'শিক্ষার্থী টিপস: অনুধাবনমূলক প্রশ্নটির উত্তর লেখার সময় সংজ্ঞার সাথে কারণ স্পষ্টভাবে উল্লেখ করতে হবে।'
    },
    {
      pageNo: 3,
      chapter: 'অধ্যায় ৪: সংগঠন ও বিভাগীয়করণ',
      bookTitle: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা — দ্বিতীয় পত্র (এইচএসসি)',
      pageLabel: 'পৃষ্ঠা: ১২৬',
      cqTitle: 'সৃজনশীল প্রশ্ন — ০৩ (সম্মিলিত বোর্ড পরীক্ষা)',
      stem: '‘মেঘা টেক্সটাইল মিলস’ এ প্রায় বারোশত কর্মকর্তা ও কর্মচারী কর্মরত রয়েছেন। কোম্পানিতে মানবসম্পদ, উৎপাদন, বিপণন এবং অর্থ বিভাগ সম্পূর্ণ পৃথকভাবে নিজ নিজ দায়িত্ব পালন করে। তবে জরুরি সময়ে এক বিভাগ অন্য বিভাগের সহযোগিতায় এগিয়ে না আসায় অর্ডার সরবরাহে প্রায়শই অনাকাঙ্ক্ষিত বিলম্ব ঘটে। এই সমস্যা নিরসনে ব্যবস্থাপনা কর্তৃপক্ষ একটি বিশেষ ক্রস-ফাংশনাল সমন্বয় সেল গঠনের সিদ্ধান্ত গ্রহণ করেন।',
      questions: [
        'ক. পদসোপান নীতি কী? [মান: ১]',
        'খ. কর্তৃত্ব ও দায়িত্বের সমতা বলতে কী বোঝায়? [মান: ২]',
        'গ. মেঘা টেক্সটাইল মিলস এ কোন ধরনের সাংগঠনিক কাঠামো প্রচলিত রয়েছে? ব্যাখ্যা কর। [মান: ৩]',
        'ঘ. কর্তৃপক্ষ কর্তৃক গঠিত সমন্বয় সেলটি কি প্রতিষ্ঠানের বর্তমান অচলাবস্থা নিরসনে যথেষ্ট? তোমার যৌক্তিক মতামত উপস্থাপন কর। [মান: ৪]'
      ],
      sideNote: 'উত্তর সংকেত: সাংগঠনিক কাঠামো ও সমন্বয় নীতি সম্পর্কিত অধ্যায়ের সহায়তা নাও।'
    }
  ];

  pageContents.forEach((item) => {
    // Generate an authentic visual textbook canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1700;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Paper background with warm subtle textbook tint
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Margin borders (book-like subtle guide)
      ctx.strokeStyle = '#e2ded5';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      // Header Bar
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(60, 60, canvas.width - 120, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Hind Siliguri", "Noto Serif Bengali", sans-serif';
      ctx.fillText(item.bookTitle, 90, 94);

      ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
      ctx.fillText(item.pageLabel, canvas.width - 220, 94);

      // Chapter info
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px "Hind Siliguri", sans-serif';
      ctx.fillText(item.chapter, 90, 165);

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(90, 185, canvas.width - 180, 2);

      // CQ Title
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
      ctx.fillText(item.cqTitle, 90, 235);

      // Stimulus / উদ্দীপক box
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(90, 260, canvas.width - 180, 360);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(90, 260, canvas.width - 180, 360);

      // Stimulus badge
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(110, 280, 110, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Hind Siliguri", sans-serif';
      ctx.fillText('উদ্দীপক:', 130, 303);

      // Draw stimulus text wrapped
      ctx.fillStyle = '#1e293b';
      ctx.font = '22px "Noto Serif Bengali", "Hind Siliguri", serif';
      wrapText(ctx, item.stem, 110, 350, canvas.width - 220, 38);

      // Sub-questions header
      ctx.fillStyle = '#b91c1c';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText('প্রশ্নসমূহ:', 90, 680);

      // Sub-questions list
      ctx.fillStyle = '#0f172a';
      ctx.font = '22px "Hind Siliguri", sans-serif';
      let y = 730;
      item.questions.forEach((q) => {
        // Bullet or line
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(90, y - 18, 6, 24);

        ctx.fillStyle = '#0f172a';
        y = wrapText(ctx, q, 110, y, canvas.width - 220, 36);
        y += 24;
      });

      // Side note / hints box at bottom (to demonstrate textbook answer/hint stripping feature!)
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(90, y + 40, canvas.width - 180, 140);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(90, y + 40, canvas.width - 180, 140);

      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 20px "Hind Siliguri", sans-serif';
      ctx.fillText('বোর্ড নির্দেশিকা ও উত্তর সংকেত (পরিক্ষার্থী ও শিক্ষকের জন্য):', 120, y + 80);
      ctx.font = '19px "Hind Siliguri", sans-serif';
      wrapText(ctx, item.sideNote, 120, y + 120, canvas.width - 240, 30);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '16px "Hind Siliguri", sans-serif';
      ctx.fillText('জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত এইচএসসি পাঠ্যপুস্তক', 90, canvas.height - 80);
      ctx.fillText(`পৃষ্ঠা ${item.pageNo}`, canvas.width - 160, canvas.height - 80);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      pages.push({
        id: `sample-page-${item.pageNo}`,
        name: `HSC_Business_Studies_Page_${item.pageNo}.jpg`,
        pageNumber: item.pageNo,
        previewUrl: dataUrl,
        fileSize: '1.2 MB',
        sourceType: 'sample'
      });
    }
  });

  return pages;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}
