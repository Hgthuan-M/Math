/**
 * Generates clear, simulated exam paper problem images (raster PNG)
 * for testing the Photo Math Solver instantly.
 */

export interface SampleProblem {
  id: string;
  title: string;
  topic: string;
  previewPrompt: string;
  generateImage: () => string;
}

export function generateExamImage(
  subject: string,
  questionNumber: string,
  questionLines: string[],
  options?: string[]
): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  const width = 800;
  const baseHeight = 360 + (options ? options.length * 28 : 0);
  canvas.width = width;
  canvas.height = baseHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background: crisp white exam paper with subtle margins
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, baseHeight);

  // Subtle grid/ruled lines like school paper
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let y = 30; y < baseHeight; y += 28) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(width - 30, y);
    ctx.stroke();
  }

  // Outer paper border
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, width - 32, baseHeight - 32);

  // Exam Header Bar
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(20, 20, width - 40, 52);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(20, 20, width - 40, 52);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 16px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('ĐỀ THI KHẢO SÁT CHẤT LƯỢNG MÔN TOÁN', 36, 44);

  ctx.fillStyle = '#475569';
  ctx.font = 'normal 13px "Segoe UI", system-ui, sans-serif';
  ctx.fillText(`Chuyên đề: ${subject} · Thời gian làm bài: 90 phút`, 36, 62);

  // Question badge
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(36, 92, 90, 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif';
  ctx.fillText(questionNumber, 48, 112);

  // Question content
  ctx.fillStyle = '#1e293b';
  ctx.font = '500 18px "Segoe UI", system-ui, sans-serif';
  let curY = 150;
  for (const line of questionLines) {
    ctx.fillText(line, 40, curY);
    curY += 34;
  }

  // Options (if multiple choice)
  if (options && options.length > 0) {
    curY += 10;
    ctx.font = '600 16.5px "Segoe UI", system-ui, sans-serif';
    for (const opt of options) {
      ctx.fillStyle = '#334155';
      ctx.fillText(opt, 50, curY);
      curY += 30;
    }
  }

  // Exam footer watermark
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 12px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('Học sinh không được sử dụng tài liệu · Cán bộ coi thi không giải thích gì thêm', 40, baseHeight - 26);

  return canvas.toDataURL('image/png');
}

export const sampleMathExamProblems: SampleProblem[] = [
  {
    id: 'sample-integral',
    title: 'Tích phân đổi biến số',
    topic: 'Giải tích 12 · THPT Quốc gia',
    previewPrompt: 'Nhận diện đề bài trong ảnh và giải chi tiết tích phân I = ∫[0→1] x / √(x² + 1) dx',
    generateImage: () =>
      generateExamImage(
        'Nguyên hàm & Tích phân Riemann',
        'CÂU 38',
        [
          'Cho tích phân I = ∫₀¹ [ x / √(x² + 1) ] dx.',
          'Bằng phương pháp đặt ẩn phụ u = √(x² + 1), hãy tính giá trị của I.',
        ],
        [
          'A.  I = √2 - 1',
          'B.  I = √2',
          'C.  I = 2√2 - 1',
          'D.  I = 1/2',
        ]
      ),
  },
  {
    id: 'sample-geometry-oxyz',
    title: 'Khoảng cách & Mặt phẳng Oxyz',
    topic: 'Hình học Oxyz 12',
    previewPrompt: 'Nhận diện đề bài trong ảnh và tính khoảng cách từ điểm M đến mặt phẳng (P)',
    generateImage: () =>
      generateExamImage(
        'Hình học không gian Tọa độ Oxyz',
        'CÂU 41',
        [
          'Trong không gian Oxyz, cho điểm M(1; 2; 3) và mặt phẳng (P): 2x - 2y + z - 6 = 0.',
          'Tính khoảng cách d từ điểm M đến mặt phẳng (P).',
        ],
        [
          'A.  d = 3',
          'B.  d = 7/3',
          'C.  d = 5/3',
          'D.  d = 1',
        ]
      ),
  },
  {
    id: 'sample-matrix-inverse',
    title: 'Ma trận nghịch đảo & Hệ PT',
    topic: 'Đại số tuyến tính Đại học',
    previewPrompt: 'Nhận diện đề bài trong ảnh và tìm ma trận nghịch đảo A⁻¹ cùng nghiệm vector X',
    generateImage: () =>
      generateExamImage(
        'Đại số tuyến tính & Lý thuyết ma trận',
        'BÀI 2',
        [
          'Cho ma trận vuông A = [[2, 1], [5, 3]] và vector B = [4, 11]ᵀ.',
          'a) Tính định thức det(A) và tìm ma trận nghịch đảo A⁻¹.',
          'b) Giải phương trình ma trận A · X = B để tìm vector nghiệm X.',
        ],
        [
          'A.  det(A) = 1, A⁻¹ = [[3, -1], [-5, 2]], X = [1, 2]ᵀ',
          'B.  det(A) = -1, A⁻¹ = [[-3, 1], [5, -2]], X = [2, 1]ᵀ',
          'C.  det(A) = 1, A⁻¹ = [[3, 1], [5, 2]], X = [4, 11]ᵀ',
          'D.  Ma trận A suy biến không có nghịch đảo.',
        ]
      ),
  },
];
