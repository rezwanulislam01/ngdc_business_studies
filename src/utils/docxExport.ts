import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  SectionType
} from 'docx';
import { ExamHeaderInfo, QuestionItem } from '../types/exam';

const BANGLA_FONT = 'Kalpurush';

export async function generateDocxBlob(
  header: ExamHeaderInfo,
  questions: QuestionItem[]
): Promise<Blob> {
  const isMcq = questions.some((q) => q.options && q.options.length > 0);

  // --- HEADER PARAGRAPHS & TABLES (Full Width) ---
  const headerElements: (Paragraph | Table)[] = [];

  // 1. College Name (Centered, Bold, 16pt)
  headerElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: header.instituteName || 'নওহাটা সরকারি ডিগ্রি কলেজ',
          bold: true,
          size: 32, // 16pt
          font: BANGLA_FONT,
        }),
      ],
    })
  );

  // 2. Exam Name & Year (Centered, Bold, 13pt)
  headerElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: header.examName || (isMcq ? 'প্রাক-নির্বাচনী পরীক্ষা ২০২৬' : 'নির্বাচনী পরীক্ষা ২০২৬'),
          bold: true,
          size: 26, // 13pt
          font: BANGLA_FONT,
        }),
      ],
    })
  );

  // 3. Subject and Paper (Centered, Bold, 12pt)
  const paperText = header.paperName ? ` (${header.paperName})` : '';
  headerElements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `বিষয়: ${header.subjectName}${paperText}`,
          bold: true,
          size: 24, // 12pt
          font: BANGLA_FONT,
        }),
      ],
    })
  );

  // 4. Row: Question Type (Center) & Subject Code (Right)
  headerElements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: header.questionTypeTitle || (isMcq ? 'বহুনির্বাচনি প্রশ্ন' : 'সৃজনশীল প্রশ্ন'),
                      bold: true,
                      size: 23,
                      font: BANGLA_FONT,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `বিষয় কোড:${header.subjectCode || (isMcq ? '২৭৮' : '২৮৭')}`,
                      bold: true,
                      size: 23,
                      font: BANGLA_FONT,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // 5. Row: Time (Left) & Total Marks (Right)
  headerElements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: `সময়:${header.examTime || (isMcq ? '৩০মিনিট' : '২ঘন্টা ৩০মিনিট')}`,
                      bold: true,
                      size: 23,
                      font: BANGLA_FONT,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `পূর্ণমান-${header.totalMarks || (isMcq ? '৩০' : '৭০')}`,
                      bold: true,
                      size: 23,
                      font: BANGLA_FONT,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  // 6. General Instruction (Centered, Bold, 10.5pt)
  if (header.generalInstruction) {
    headerElements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 120 },
        children: [
          new TextRun({
            text: header.generalInstruction,
            bold: true,
            size: 21,
            font: BANGLA_FONT,
          }),
        ],
      })
    );
  }

  // --- QUESTIONS FORMATTING ---
  if (isMcq) {
    // MCQ Format: Two columns with vertical divider line (SectionType.CONTINUOUS)
    const mcqChildren: (Paragraph | Table)[] = [];

    questions.forEach((q, idx) => {
      const qNum = q.questionNo || String(idx + 1);

      // Context / Stimulus if present
      if (q.context) {
        mcqChildren.push(
          new Paragraph({
            spacing: { before: 100, after: 30 },
            children: [
              new TextRun({
                text: q.context,
                bold: true,
                size: 20,
                font: BANGLA_FONT,
              }),
            ],
          })
        );
      }

      // Question line (e.g. ১. প্রশ্ন...)
      const lines = (q.question || q.stem || '').split('\n');
      lines.forEach((lineText, lineIdx) => {
        mcqChildren.push(
          new Paragraph({
            spacing: { before: lineIdx === 0 ? 40 : 10, after: 20 },
            children: [
              ...(lineIdx === 0
                ? [
                    new TextRun({
                      text: `${qNum}. `,
                      bold: true,
                      size: 20,
                      font: BANGLA_FONT,
                    }),
                  ]
                : []),
              new TextRun({
                text: lineText,
                size: 20,
                font: BANGLA_FONT,
              }),
            ],
          })
        );
      });

      // Options (formatted cleanly in a 2-column borderless table inside the column)
      if (q.options && q.options.length > 0) {
        const half = Math.ceil(q.options.length / 2);
        const row1 = q.options.slice(0, half);
        const row2 = q.options.slice(half);

        const makeRow = (opts: string[]) =>
          new TableRow({
            children: opts.map((opt) =>
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
                children: [
                  new Paragraph({
                    spacing: { before: 10, after: 10 },
                    children: [
                      new TextRun({
                        text: opt,
                        size: 19,
                        font: BANGLA_FONT,
                      }),
                    ],
                  }),
                ],
              })
            ),
          });

        mcqChildren.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [makeRow(row1), ...(row2.length ? [makeRow(row2)] : [])],
          })
        );
      }

      // Small space after each question
      mcqChildren.push(new Paragraph({ spacing: { after: 50 } }));
    });

    const doc = new Document({
      sections: [
        // Section 1: Header (Full width)
        {
          properties: {
            page: {
              margin: {
                top: 800,
                bottom: 800,
                left: 800,
                right: 800,
              },
            },
          },
          children: headerElements,
        },
        // Section 2: Questions (Two columns with separator)
        {
          properties: {
            type: SectionType.CONTINUOUS,
            column: {
              count: 2,
              space: 400,
              separate: true,
            },
            page: {
              margin: {
                top: 800,
                bottom: 800,
                left: 800,
                right: 800,
              },
            },
          },
          children: mcqChildren,
        },
      ],
    });

    return await Packer.toBlob(doc);
  }

  // CQ Format: Single column with right-aligned sub-question marks table
  const cqChildren: (Paragraph | Table)[] = [...headerElements];

  questions.forEach((q, idx) => {
    const qNum = q.questionNo || String(idx + 1);

    // Stem paragraph
    cqChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({
            text: `${qNum}। `,
            bold: true,
            size: 23,
            font: BANGLA_FONT,
          }),
          new TextRun({
            text: q.stem || q.question || '',
            size: 23,
            font: BANGLA_FONT,
          }),
        ],
      })
    );

    // Sub-questions (ক, খ, গ, ঘ) formatted as 2-column borderless table
    if (q.subQuestions && q.subQuestions.length > 0) {
      const subRows = q.subQuestions.map((sub) => {
        return new TableRow({
          children: [
            new TableCell({
              width: { size: 92, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({
                      text: `(${sub.label}) ${sub.question}`,
                      size: 22,
                      font: BANGLA_FONT,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({
                      text: sub.marks,
                      bold: true,
                      size: 22,
                      font: BANGLA_FONT,
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      });

      cqChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: subRows,
        })
      );

      cqChildren.push(new Paragraph({ spacing: { after: 120 } }));
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000,
            },
          },
        },
        children: cqChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
