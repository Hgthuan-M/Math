'use client';

import {useState} from 'react';
import {
  Search,
  ArrowRight,
  Sparkles,
  Camera,
  Zap,
  GraduationCap,
  Layers,
  Brain,
  Calculator,
  Compass,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Flame,
  Star,
  Bookmark,
  Network
} from 'lucide-react';
import {MathFormula} from './math';

export function Overview({
  navigate,
  openLesson,
  openTopic,
  onSearch,
}: {
  navigate: (s: string) => void;
  openLesson: (s: string) => void;
  openTopic: (s: string) => void;
  onSearch: (s: string) => void;
}) {
  const [activeGrade, setActiveGrade] = useState<'all' | '6' | '7' | '8' | '9'>('all');
  const [activePillar, setActivePillar] = useState<'pythagoras' | 'identities' | 'quadratic' | 'circle'>('pythagoras');

  // Curated THCS Programs by Grade
  const gradePrograms = [
    {
      grade: '6',
      badge: '🎒 Lớp 6',
      colorClass: 'g6',
      title: 'Số học & Hình học trực quan Lớp 6',
      desc: 'Tập hợp số tự nhiên, ước chung & bội chung, phân số, số thập phân và các hình phẳng trực quan (hình chữ nhật, thoi, bình hành, thang cân).',
      symbol: 'ƯCLN · BCNN · S',
      topicId: 'algebra',
      formulaCount: '12 bài học',
      highlight: 'Nền tảng khởi đầu cấp 2',
    },
    {
      grade: '7',
      badge: '📐 Lớp 7',
      colorClass: 'g7',
      title: 'Số hữu tỉ & Tam giác bằng nhau Lớp 7',
      desc: 'Số hữu tỉ, số thực, tỉ lệ thức & dãy tỉ số bằng nhau, các trường hợp bằng nhau của tam giác (c-c-c, c-g-c, g-c-g) và định lý Pytago.',
      symbol: 'a/b = c/d · a² + b² = c²',
      topicId: 'geometry-middle',
      formulaCount: '16 bài học',
      highlight: 'Chuyển biến tư duy hình học',
    },
    {
      grade: '8',
      badge: '⚡ Lớp 8',
      colorClass: 'g8',
      title: '7 Hằng đẳng thức & Tam giác đồng dạng Lớp 8',
      desc: '7 hằng đẳng thức đáng nhớ, phân tích đa thức thành nhân tử, phân thức đại số, định lý Ta-lét và các trường hợp tam giác đồng dạng.',
      symbol: '(a + b)² · a² - b² · Δ ~ Δ',
      topicId: 'algebra',
      formulaCount: '20 bài học',
      highlight: 'Kỹ năng đại số cốt lõi',
    },
    {
      grade: '9',
      badge: '🎯 Lớp 9 - Ôn thi vào 10',
      colorClass: 'g9',
      title: 'Phương trình bậc 2, Vi-ét & Đường tròn Lớp 9',
      desc: 'Căn bậc hai, hệ hai phương trình, phương trình bậc hai ax² + bx + c = 0, định lý Vi-ét, hệ thức lượng tam giác vuông, góc với đường tròn & tứ giác nội tiếp.',
      symbol: 'Δ = b² - 4ac · x₁ + x₂ · (O; R)',
      topicId: 'geometry-middle',
      formulaCount: '24 bài học',
      highlight: 'Trọng tâm thi tuyển sinh vào 10',
    },
  ];

  // Curated Core Formulas by Grade
  const gradeFormulas = [
    // LỚP 6
    {
      id: 'g6-area',
      grade: '6',
      gradeBadge: '🎒 Lớp 6',
      tagColor: 'g6',
      title: 'Chu vi & Diện tích các hình phẳng cơ bản',
      latex: 'S_{\\text{hcn}} = a \\cdot b \\quad;\\quad S_{\\text{vuông}} = a^2 \\quad;\\quad S_{\\text{thoi}} = \\frac{1}{2}d_1 d_2 \\quad;\\quad S_{\\text{thang}} = \\frac{(a+b)h}{2}',
      whenToUse: '📌 Dùng khi tính diện tích mảnh đất, nền nhà, cắt dán hình học thực tế, bài toán sơn tường, lát gạch.',
      example: '✏️ Ví dụ: Mảnh đất hình thang có 2 đáy a = 12m, b = 8m, chiều cao h = 5m ⇒ S = [(12 + 8) × 5] / 2 = 50 m².',
      targetLessonId: 'geo-trapezoid',
    },
    {
      id: 'g6-gcd-lcm',
      grade: '6',
      gradeBadge: '🎒 Lớp 6',
      tagColor: 'g6',
      title: 'ƯCLN & BCNN (Ước chung lớn nhất & Bội chung nhỏ nhất)',
      latex: '\\text{ƯCLN}(a,b) \\times \\text{BCNN}(a,b) = a \\times b',
      whenToUse: '📌 Dùng để rút gọn phân số về tối giản (chia cho ƯCLN) và quy đồng mẫu số nhiều phân số (tìm BCNN làm mẫu chung).',
      example: '✏️ Ví dụ: Quy đồng mẫu số 5/12 và 7/18: Ta tìm BCNN(12, 18) = 36 ⇒ Mẫu số chung nhỏ nhất là 36.',
      targetTopicId: 'algebra',
    },
    {
      id: 'g6-signs',
      grade: '6',
      gradeBadge: '🎒 Lớp 6',
      tagColor: 'g6',
      title: 'Quy tắc dấu ngoặc & Phép tính số nguyên',
      latex: '-(a + b - c) = -a - b + c \\quad;\\quad (-a) \\times (-b) = a \\times b',
      whenToUse: '📌 Dùng khi bỏ dấu ngoặc khi trước ngoặc có dấu trừ (đổi dấu toàn bộ), nhân chia số nguyên âm không sai dấu.',
      example: '✏️ Ví dụ: Tính nhanh: 25 − (15 − 8) = 25 − 15 + 8 = 10 + 8 = 18.',
      targetTopicId: 'algebra',
    },

    // LỚP 7
    {
      id: 'g7-pythagoras',
      grade: '7',
      gradeBadge: '📐 Lớp 7',
      tagColor: 'g7',
      title: 'Định lý Pythagoras (Pytago) trong tam giác vuông',
      latex: 'a^2 + b^2 = c^2 \\quad\\Longleftrightarrow\\quad c = \\sqrt{a^2 + b^2}',
      whenToUse: '📌 Dùng khi biết độ dài 2 cạnh tam giác vuông để tính cạnh còn lại, hoặc chứng minh tam giác vuông (Pytago đảo: 3² + 4² = 5²).',
      example: '✏️ Ví dụ: Tam giác vuông có 2 cạnh góc vuông là 6 cm và 8 cm ⇒ Cạnh huyền c = √(6² + 8²) = √(36 + 64) = 10 cm.',
      targetLessonId: 'geo-pythagoras',
    },
    {
      id: 'g7-angles',
      grade: '7',
      gradeBadge: '📐 Lớp 7',
      tagColor: 'g7',
      title: 'Tổng ba góc của tam giác & Tính chất góc ngoài',
      latex: '\\widehat{A} + \\widehat{B} + \\widehat{C} = 180^\\circ \\quad;\\quad \\widehat{A_{\\text{ngoài}}} = \\widehat{B} + \\widehat{C}',
      whenToUse: '📌 Dùng để tìm số đo góc thứ 3 khi biết 2 góc; tính góc nhọn trong tam giác vuông (hai góc nhọn phụ nhau = 90°).',
      example: '✏️ Ví dụ: Tam giác ABC có ∠A = 65°, ∠B = 75° ⇒ ∠C = 180° − (65° + 75°) = 40°.',
      targetLessonId: 'geo-angles',
    },
    {
      id: 'g7-ratio',
      grade: '7',
      gradeBadge: '📐 Lớp 7',
      tagColor: 'g7',
      title: 'Tỉ lệ thức & Tính chất dãy tỉ số bằng nhau',
      latex: '\\frac{a}{b} = \\frac{c}{d} = \\frac{a+c}{b+d} = \\frac{a-c}{b-d} \\quad (b, d \\neq 0)',
      whenToUse: '📌 Dùng giải dạng toán chia tỉ lệ: chia tiền thưởng, số học sinh 3 lớp, tỉ lệ các cạnh tam giác hoặc chu vi.',
      example: '✏️ Ví dụ: Cho x/3 = y/5 và x + y = 32 ⇒ x/3 = y/5 = 32/(3+5) = 4 ⇒ x = 12, y = 20.',
      targetTopicId: 'algebra',
    },
    {
      id: 'g7-congruence',
      grade: '7',
      gradeBadge: '📐 Lớp 7',
      tagColor: 'g7',
      title: '3 Trường hợp bằng nhau của tam giác',
      latex: '\\Delta ABC = \\Delta A\'B\'C\' \\quad (\\text{c-c-c},\\, \\text{c-g-c},\\, \\text{g-c-g})',
      whenToUse: '📌 Bước cơ bản nhất để chứng minh hai đoạn thẳng bằng nhau, hai góc bằng nhau, chứng minh tia phân giác hay trung điểm.',
      example: '✏️ Ví dụ: Hai tam giác vuông bằng nhau khi có cạnh huyền - góc nhọn bằng nhau, hoặc cạnh huyền - cạnh góc vuông bằng nhau.',
      targetLessonId: 'geo-triangle-area',
    },

    // LỚP 8
    {
      id: 'g8-identities',
      grade: '8',
      gradeBadge: '⚡ Lớp 8',
      tagColor: 'g8',
      title: 'Trọn bộ 7 Hằng đẳng thức đáng nhớ',
      latex: '(a+b)^2 = a^2+2ab+b^2 \\quad;\\quad a^2-b^2 = (a-b)(a+b) \\quad;\\quad (a+b)^3 = a^3+3a^2b+3ab^2+b^3',
      whenToUse: '📌 Dùng rút gọn biểu thức, phân tích đa thức thành nhân tử, tìm GTLN / GTNN và giải nhanh bài toán đại số.',
      example: '✏️ Ví dụ: Tính nhanh 103² = (100 + 3)² = 100² + 2 × 100 × 3 + 3² = 10 000 + 600 + 9 = 10 609.',
      targetLessonId: 'f1',
    },
    {
      id: 'g8-thales',
      grade: '8',
      gradeBadge: '⚡ Lớp 8',
      tagColor: 'g8',
      title: 'Định lý Ta-lét trong tam giác',
      latex: 'MN \\parallel BC \\implies \\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}',
      whenToUse: '📌 Dùng tính độ dài đoạn thẳng khi có yếu tố song song, chứng minh các đoạn thẳng tỉ lệ hoặc chứng minh 2 đường song song.',
      example: '✏️ Ví dụ: Cho AM = 2, AB = 6, BC = 9 với MN ∥ BC ⇒ MN = 9 × (2 / 6) = 3.',
      targetLessonId: 'geo-thales',
    },
    {
      id: 'g8-similarity',
      grade: '8',
      gradeBadge: '⚡ Lớp 8',
      tagColor: 'g8',
      title: 'Tam giác đồng dạng & Tỉ số diện tích',
      latex: '\\Delta A\'B\'C\' \\backsim \\Delta ABC \\implies \\frac{A\'B\'}{AB} = k \\implies \\frac{S_{A\'B\'C\'}}{S_{ABC}} = k^2',
      whenToUse: '📌 Dùng đo chiều cao cây, tháp ngoài thực tế; chứng minh hệ thức tích AB·CD = AC·BD và tỉ số diện tích k².',
      example: '✏️ Ví dụ: Hai tam giác đồng dạng theo tỉ số k = 3 ⇒ Diện tích tam giác lớn gấp k² = 3² = 9 lần tam giác nhỏ.',
      targetLessonId: 'geo-similarity',
    },
    {
      id: 'g8-bisector',
      grade: '8',
      gradeBadge: '⚡ Lớp 8',
      tagColor: 'g8',
      title: 'Tính chất đường phân giác trong tam giác',
      latex: 'AD\\text{ là phân giác } \\widehat{BAC} \\implies \\frac{DB}{DC} = \\frac{AB}{AC}',
      whenToUse: '📌 Dùng để tính tỉ số các đoạn thẳng trên cạnh đối diện bị đường phân giác chia ra.',
      example: '✏️ Ví dụ: Cho AB = 4, AC = 6, BC = 5 ⇒ DB/DC = 4/6 = 2/3 ⇒ DB = 2 cm, DC = 3 cm.',
      targetLessonId: 'geo-bisector',
    },

    // LỚP 9
    {
      id: 'g9-quadratic',
      grade: '9',
      gradeBadge: '🎯 Lớp 9',
      tagColor: 'g9',
      title: 'Phương trình bậc hai & Công thức nghiệm Δ',
      latex: 'ax^2 + bx + c = 0 \\quad (\\Delta = b^2 - 4ac) \\implies x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
      whenToUse: '📌 Chắc chắn có trong đề thi tuyển sinh vào 10: câu giải phương trình bậc hai hoặc bài toán lập phương trình.',
      example: '✏️ Ví dụ: Giải x² − 7x + 12 = 0 ⇒ Δ = (−7)² − 4(1)(12) = 1 > 0 ⇒ x₁ = (7 + 1) / 2 = 4, x₂ = (7 − 1) / 2 = 3.',
      targetLessonId: 'f10',
    },
    {
      id: 'g9-viet',
      grade: '9',
      gradeBadge: '🎯 Lớp 9',
      tagColor: 'g9',
      title: 'Định lý Vi-ét & Mẹo nhẩm nghiệm thần tốc',
      latex: 'S = x_1 + x_2 = -\\frac{b}{a} \\quad;\\quad P = x_1 x_2 = \\frac{c}{a}',
      whenToUse: '📌 Dùng tìm tham số m để phương trình có 2 nghiệm thỏa mãn hệ thức. Mẹo: nếu a + b + c = 0 thì x₁ = 1, x₂ = c/a.',
      example: '✏️ Ví dụ: Phương trình 3x² − 5x + 2 = 0 có a + b + c = 3 − 5 + 2 = 0 ⇒ Nhẩm ngay x₁ = 1, x₂ = 2/3.',
      targetLessonId: 'f10',
    },
    {
      id: 'g9-right-triangle',
      grade: '9',
      gradeBadge: '🎯 Lớp 9',
      tagColor: 'g9',
      title: '5 Hệ thức lượng trong tam giác vuông',
      latex: 'b^2 = a \\cdot b\' \\quad;\\quad c^2 = a \\cdot c\' \\quad;\\quad h^2 = b\' \\cdot c\' \\quad;\\quad a \\cdot h = b \\cdot c \\quad;\\quad \\frac{1}{h^2} = \\frac{1}{b^2} + \\frac{1}{c^2}',
      whenToUse: '📌 Dùng giải tam giác vuông cực nhanh chỉ trong 1 bước tính, tính chiều cao cây, độ rộng sông.',
      example: '✏️ Ví dụ: Cho hình chiếu b\' = 4 cm, c\' = 9 cm ⇒ Chiều cao h = √(4 × 9) = √36 = 6 cm.',
      targetLessonId: 'geo-right-triangle-relations',
    },
    {
      id: 'g9-trig',
      grade: '9',
      gradeBadge: '🎯 Lớp 9',
      tagColor: 'g9',
      title: 'Tỉ số lượng giác góc nhọn (Sin, Cos, Tan, Cot)',
      latex: '\\sin\\alpha = \\frac{\\text{đối}}{\\text{huyền}} \\quad;\\quad \\cos\\alpha = \\frac{\\text{kề}}{\\text{huyền}} \\quad;\\quad \\tan\\alpha = \\frac{\\text{đối}}{\\text{kề}} \\quad;\\quad \\cot\\alpha = \\frac{\\text{kề}}{\\text{đối}}',
      whenToUse: '📌 Thần chú: "Sin đi học, Cos khóc cười, Tan đoàn kết, Cot kết đoàn". Dùng đo góc dốc, khoảng cách.',
      example: '✏️ Ví dụ: sin 30° = 0.5, cos 60° = 0.5, tan 45° = 1. Hệ thức vàng: sin²α + cos²α = 1.',
      targetLessonId: 'geo-trig-ratios',
    },
    {
      id: 'g9-circle',
      grade: '9',
      gradeBadge: '🎯 Lớp 9',
      tagColor: 'g9',
      title: 'Góc với đường tròn & Tứ giác nội tiếp',
      latex: '\\angle AMB = \\frac{1}{2}\\text{sđ}\\overparen{AB} \\quad;\\quad \\angle A + \\angle C = 180^\\circ \\text{ (Tứ giác nội tiếp)}',
      whenToUse: '📌 Chiếm 3.0 - 3.5 điểm bài hình thi vào 10: chứng minh 4 điểm cùng thuộc một đường tròn, tứ giác nội tiếp.',
      example: '✏️ Ví dụ: Mọi góc nội tiếp chắn nửa đường tròn đều bằng 90°. Tứ giác nội tiếp có tổng hai góc đối diện bằng 180°.',
      targetLessonId: 'geo-cyclic-quad',
    },
  ];

  const filteredPrograms =
    activeGrade === 'all'
      ? gradePrograms
      : gradePrograms.filter((p) => p.grade === activeGrade);

  const displayedFormulas =
    activeGrade === 'all'
      ? gradeFormulas
      : gradeFormulas.filter((f) => f.grade === activeGrade);

  return (
    <>
      {/* ==================== HERO SECTION THCS ==================== */}
      <section className="thcs-hero-container">
        <div className="thcs-hero-glow" />
        <div className="thcs-hero-glow-2" />

        <div className="thcs-hero-header">
          <div className="thcs-badge">
            <span className="dot" />
            <span>Toán Cấp 2 THCS · Lớp 6 - Lớp 9</span>
          </div>

          <h1 className="thcs-hero-title">
            Học Toán Cấp 2 <span>Thật Dễ Hiểu & Tự Tin!</span> 🚀
          </h1>

          <p className="thcs-hero-desc">
            Sổ tay thông minh giúp bạn nắm vững 7 hằng đẳng thức, định lý Pytago, hệ thức lượng,
            phương trình bậc 2 & Vi-ét. Có hình vẽ minh họa từng bước, mẹo giải nhanh và Gia sư AI đồng hành.
          </p>

          <div className="thcs-hero-actions">
            <button
              className="thcs-action-btn ai-solve"
              onClick={() => navigate('tutor')}
            >
              <Camera size={18} />
              <span>Gia sư AI giải đề ảnh</span>
            </button>

            <button
              className="thcs-action-btn arena"
              onClick={() => navigate('arena')}
            >
              <Zap size={18} />
              <span>Đấu trường 60s</span>
            </button>

            <button
              className="thcs-action-btn geometry"
              onClick={() => navigate('geometry')}
            >
              <Compass size={18} />
              <span>Hình học trực quan</span>
            </button>

            <button
              className="thcs-action-btn mindmap"
              onClick={() => navigate('mindmap')}
            >
              <Network size={18} />
              <span>Cây tiền đề & Sơ đồ</span>
            </button>
          </div>
        </div>

        {/* ==================== INTERACTIVE FORMULA SPOTLIGHT ==================== */}
        <div className="thcs-spotlight">
          <div className="thcs-spotlight-nav">
            <button
              className={`thcs-tab-pill ${activePillar === 'pythagoras' ? 'active' : ''}`}
              onClick={() => setActivePillar('pythagoras')}
            >
              <Compass size={15} />
              <span>📐 Định lý Pythagoras</span>
            </button>

            <button
              className={`thcs-tab-pill ${activePillar === 'identities' ? 'active' : ''}`}
              onClick={() => setActivePillar('identities')}
            >
              <Zap size={15} />
              <span>⚡ 7 Hằng đẳng thức</span>
            </button>

            <button
              className={`thcs-tab-pill ${activePillar === 'quadratic' ? 'active' : ''}`}
              onClick={() => setActivePillar('quadratic')}
            >
              <Star size={15} />
              <span>🎯 PT Bậc 2 & Vi-ét</span>
            </button>

            <button
              className={`thcs-tab-pill ${activePillar === 'circle' ? 'active' : ''}`}
              onClick={() => setActivePillar('circle')}
            >
              <CheckCircle2 size={15} />
              <span>⭕ Góc & Đường tròn</span>
            </button>
          </div>

          <div className="thcs-spotlight-body">
            {activePillar === 'pythagoras' && (
              <>
                <div className="thcs-spotlight-left">
                  <h3>
                    Định lý Pythagoras (Pytago)
                    <span className="thcs-spotlight-grade">Lớp 7 · 8 · 9</span>
                  </h3>
                  <p className="thcs-spotlight-desc">
                    Trong tam giác vuông, bình phương độ dài cạnh huyền bằng tổng bình phương hai cạnh góc vuông.
                  </p>

                  <div className="thcs-formula-view">
                    <MathFormula latex="a^2 + b^2 = c^2 \quad\Longleftrightarrow\quad c = \sqrt{a^2 + b^2}" block />
                  </div>

                  <div className="thcs-mnemonic-box">
                    <strong>💡 Mẹo nhớ siêu nhanh:</strong> Cạnh huyền luôn là cạnh đối diện góc 90° và dài nhất.
                    Các bộ 3 số nguyên kinh điển hay gặp trong đề thi: <code>(3, 4, 5)</code>, <code>(6, 8, 10)</code>, <code>(5, 12, 13)</code>.
                  </div>

                  <button
                    className="primary-btn"
                    style={{padding: '10px 18px', fontSize: 14}}
                    onClick={() => openLesson('geo-pythagoras')}
                  >
                    Xem bài học & bài tập mẫu <ArrowRight size={15} />
                  </button>
                </div>

                <div className="thcs-diagram-card">
                  <svg viewBox="0 0 240 180" role="img" aria-label="Minh họa Pytago tam giác 3-4-5">
                    {/* Triangle 3-4-5 */}
                    <polygon points="50,140 170,140 50,50" fill="rgba(99, 102, 241, 0.14)" stroke="#4f46e5" strokeWidth="2.5" />
                    {/* Right angle symbol */}
                    <path d="M 50,126 L 64,126 L 64,140" fill="none" stroke="#d97706" strokeWidth="2" />
                    {/* Labels */}
                    <text className="svg-text" x="30" y="100" fontSize="13">b = 3</text>
                    <text className="svg-text" x="105" y="160" fontSize="13">a = 4</text>
                    <text className="svg-text-amber" x="122" y="90" fontSize="14">c = 5</text>
                    {/* Formula highlight */}
                    <text className="svg-text-primary" x="90" y="32" fontSize="12.5">3² + 4² = 9 + 16 = 25 = 5²</text>
                  </svg>
                </div>
              </>
            )}

            {activePillar === 'identities' && (
              <>
                <div className="thcs-spotlight-left">
                  <h3>
                    7 Hằng đẳng thức đáng nhớ
                    <span className="thcs-spotlight-grade">Lớp 8</span>
                  </h3>
                  <p className="thcs-spotlight-desc">
                    Vũ khí tối thượng giúp rút gọn biểu thức, phân tích đa thức thành nhân tử và tính nhẩm nhanh.
                  </p>

                  <div className="thcs-formula-view">
                    <MathFormula latex="(a + b)^2 = a^2 + 2ab + b^2 \quad;\quad a^2 - b^2 = (a - b)(a + b)" block />
                  </div>

                  <div className="thcs-mnemonic-box">
                    <strong>💡 Mẹo nhớ siêu nhanh:</strong> Bình phương một tổng không bao giờ được thiếu <code>2ab</code>!
                    Ví dụ tính nhẩm: <code>103² = (100 + 3)² = 10000 + 600 + 9 = 10 609</code>.
                  </div>

                  <button
                    className="primary-btn"
                    style={{padding: '10px 18px', fontSize: 14}}
                    onClick={() => openLesson('f1')}
                  >
                    Xem trọn bộ 7 hằng đẳng thức <ArrowRight size={15} />
                  </button>
                </div>

                <div className="thcs-diagram-card">
                  <svg viewBox="0 0 200 180" role="img" aria-label="Minh họa hình học hằng đẳng thức">
                    {/* Big Square (a+b) x (a+b) */}
                    <rect x="25" y="25" width="100" height="100" fill="rgba(99, 102, 241, 0.15)" stroke="#4f46e5" strokeWidth="2" />
                    <rect x="125" y="25" width="45" height="100" fill="rgba(236, 72, 153, 0.15)" stroke="#db2777" strokeWidth="2" />
                    <rect x="25" y="125" width="100" height="45" fill="rgba(236, 72, 153, 0.15)" stroke="#db2777" strokeWidth="2" />
                    <rect x="125" y="125" width="45" height="45" fill="rgba(245, 158, 11, 0.2)" stroke="#d97706" strokeWidth="2" />
                    <text className="svg-text-primary" x="68" y="80" fontSize="16">a²</text>
                    <text className="svg-text" x="138" y="80" fontSize="13">ab</text>
                    <text className="svg-text" x="68" y="152" fontSize="13">ab</text>
                    <text className="svg-text-amber" x="138" y="152" fontSize="14">b²</text>
                  </svg>
                </div>
              </>
            )}

            {activePillar === 'quadratic' && (
              <>
                <div className="thcs-spotlight-left">
                  <h3>
                    Phương trình bậc hai & Định lý Vi-ét
                    <span className="thcs-spotlight-grade">Lớp 9 · Ôn thi 10</span>
                  </h3>
                  <p className="thcs-spotlight-desc">
                    Trọng tâm tuyệt đối trong đề thi vào lớp 10 các tỉnh thành trên cả nước.
                  </p>

                  <div className="thcs-formula-view">
                    <MathFormula latex="ax^2 + bx + c = 0 \quad (\Delta = b^2 - 4ac) \implies S = x_1+x_2 = -\frac{b}{a}, \quad P = x_1x_2 = \frac{c}{a}" block />
                  </div>

                  <div className="thcs-mnemonic-box">
                    <strong>💡 Mẹo nhẩm nghiệm thần tốc:</strong>
                    <br />• Nếu <code>a + b + c = 0</code> thì phương trình có 2 nghiệm: <code>x₁ = 1, x₂ = c/a</code>.
                    <br />• Nếu <code>a - b + c = 0</code> thì phương trình có 2 nghiệm: <code>x₁ = -1, x₂ = -c/a</code>.
                  </div>

                  <button
                    className="primary-btn"
                    style={{padding: '10px 18px', fontSize: 14}}
                    onClick={() => openLesson('f10')}
                  >
                    Xem bài học & cách tính Vi-ét <ArrowRight size={15} />
                  </button>
                </div>

                <div className="thcs-diagram-card">
                  <svg viewBox="0 0 220 180" role="img" aria-label="Minh họa đồ thị Parabol và nghiệm Vi-ét">
                    {/* Axes */}
                    <line x1="20" y1="120" x2="200" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="60" y1="20" x2="60" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
                    {/* Parabola curve y = (x-2)(x-4) */}
                    <path d="M 65,30 Q 120,170 175,30" fill="none" stroke="#0284c7" strokeWidth="3" />
                    {/* Intersection points x1, x2 */}
                    <circle cx="95" cy="120" r="5" fill="#dc2626" />
                    <circle cx="145" cy="120" r="5" fill="#dc2626" />
                    <text className="svg-text-red" x="90" y="108" fontSize="12">x₁</text>
                    <text className="svg-text-red" x="142" y="108" fontSize="12">x₂</text>
                    <text className="svg-text-primary" x="105" y="45" fontSize="12">Δ &gt; 0: 2 nghiệm</text>
                  </svg>
                </div>
              </>
            )}

            {activePillar === 'circle' && (
              <>
                <div className="thcs-spotlight-left">
                  <h3>
                    Góc với đường tròn & Tứ giác nội tiếp
                    <span className="thcs-spotlight-grade">Lớp 9 · Hình học</span>
                  </h3>
                  <p className="thcs-spotlight-desc">
                    Quan hệ giữa góc ở tâm, góc nội tiếp, góc tạo bởi tia tiếp tuyến và dây cung cùng chắn một cung.
                  </p>

                  <div className="thcs-formula-view">
                    <MathFormula latex="\angle AOB = \text{sđ}\overparen{AB} \quad;\quad \angle AMB = \frac{1}{2}\text{sđ}\overparen{AB} = \frac{1}{2}\angle AOB" block />
                  </div>

                  <div className="thcs-mnemonic-box">
                    <strong>💡 Mẹo nhớ cốt lõi:</strong> Góc nội tiếp luôn bằng một nửa số đo góc ở tâm cùng chắn một cung.
                    Đặc biệt: Mọi góc nội tiếp chắn nửa đường tròn đều là góc vuông <code>90°</code>!
                  </div>

                  <button
                    className="primary-btn"
                    style={{padding: '10px 18px', fontSize: 14}}
                    onClick={() => navigate('geometry')}
                  >
                    Xem thư viện hình học đường tròn <ArrowRight size={15} />
                  </button>
                </div>

                <div className="thcs-diagram-card">
                  <svg viewBox="0 0 200 180" role="img" aria-label="Minh họa góc nội tiếp và góc ở tâm">
                    {/* Circle */}
                    <circle cx="100" cy="95" r="65" fill="rgba(99, 102, 241, 0.04)" stroke="#4f46e5" strokeWidth="2.5" />
                    <circle cx="100" cy="95" r="3.5" fill="#d97706" />
                    <text className="svg-text-amber" x="106" y="93" fontSize="11">O</text>
                    {/* Points A, B on circle */}
                    <circle cx="50" cy="135" r="4" fill="#0284c7" />
                    <text className="svg-text-blue" x="35" y="145" fontSize="12">A</text>
                    <circle cx="150" cy="135" r="4" fill="#0284c7" />
                    <text className="svg-text-blue" x="157" y="145" fontSize="12">B</text>
                    {/* Point M */}
                    <circle cx="100" cy="30" r="4" fill="#dc2626" />
                    <text className="svg-text-red" x="96" y="22" fontSize="12">M</text>
                    {/* Central angle rays */}
                    <line x1="100" y1="95" x2="50" y2="135" stroke="#d97706" strokeWidth="1.8" strokeDasharray="3 3" />
                    <line x1="100" y1="95" x2="150" y2="135" stroke="#d97706" strokeWidth="1.8" strokeDasharray="3 3" />
                    {/* Inscribed angle lines */}
                    <line x1="100" y1="30" x2="50" y2="135" stroke="#dc2626" strokeWidth="2" />
                    <line x1="100" y1="30" x2="150" y2="135" stroke="#dc2626" strokeWidth="2" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==================== SEARCH BAR ==================== */}
      <div className="searchbar">
        <Search size={22} style={{color: 'var(--primary)'}} />
        <input
          aria-label="Tìm kiếm công thức"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Tìm nhanh công thức: 7 hằng đẳng thức, Pytago, Vi-ét, góc nội tiếp, diện tích hình thoi, hình thang..."
        />
      </div>

      {/* ==================== 4 SUPER TOOLS FOR STUDENTS ==================== */}
      <div className="section-heading" style={{margin: '22px 0 14px'}}>
        <h2>Bảo bối học tập cho học sinh THCS</h2>
        <span className="muted" style={{fontSize: 13.5}}>Công cụ thông minh giúp bạn học nhanh gấp đôi</span>
      </div>

      <div className="thcs-tools-grid">
        <div className="thcs-tool-card" onClick={() => navigate('tutor')}>
          <div className="thcs-tool-icon-wrap camera">
            <Camera size={24} />
          </div>
          <h4>
            Gia sư AI giải đề ảnh
            <ArrowRight size={16} />
          </h4>
          <p>Chụp ảnh hoặc tải đề thi hình học, đại số lên. AI nhận diện hình vẽ và hướng dẫn giải từng bước chi tiết.</p>
        </div>

        <div className="thcs-tool-card" onClick={() => navigate('arena')}>
          <div className="thcs-tool-icon-wrap lightning">
            <Zap size={24} />
          </div>
          <h4>
            Đấu trường 60s
            <ArrowRight size={16} />
          </h4>
          <p>Thử thách phản xạ tính nhẩm nhanh: cộng trừ nhân chia, bình phương và lượng giác cơ bản chống bấm nhầm máy tính.</p>
        </div>

        <div className="thcs-tool-card" onClick={() => navigate('geometry')}>
          <div className="thcs-tool-icon-wrap geometry">
            <Compass size={24} />
          </div>
          <h4>
            Hình học trực quan
            <ArrowRight size={16} />
          </h4>
          <p>Tách riêng từng hình (tam giác, hình thoi, thang, đường tròn) có hình vẽ minh họa và tính diện tích tự động.</p>
        </div>

        <div className="thcs-tool-card" onClick={() => navigate('mindmap')}>
          <div className="thcs-tool-icon-wrap mindmap">
            <Network size={24} />
          </div>
          <h4>
            Sơ đồ tư duy & Lộ trình
            <ArrowRight size={16} />
          </h4>
          <p>Khung kiến thức dạng cây: mất gốc thì nên bắt đầu từ đâu, bài nào làm nền tảng cho bài nào.</p>
        </div>
      </div>

      {/* ==================== GAMIFIED STREAK STRIP ==================== */}
      <div className="thcs-streak-strip">
        <div className="thcs-streak-info">
          <div className="thcs-flame-badge">
            <Flame size={26} />
          </div>
          <div className="thcs-streak-text">
            <h4>Chuỗi 3 ngày chăm chỉ · Cấp độ: Học bá THCS ⭐</h4>
            <p>Học đều đặn 15 phút mỗi ngày hiệu quả hơn học dồn trước ngày thi 10 lần!</p>
          </div>
        </div>

        <div style={{display: 'flex', gap: 10}}>
          <button className="primary-btn" onClick={() => navigate('quiz')} style={{padding: '9px 18px', fontSize: 13.5}}>
            Luyện Quiz ngay <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ==================== GRADE FILTER BAR ==================== */}
      <div className="section-heading" style={{margin: '28px 0 14px'}}>
        <h2>Chương trình khung & Công thức trọng tâm theo lớp</h2>
        <span className="muted" style={{fontSize: 13.5}}>Chọn đúng khối lớp của bạn để xem công thức và bài tập tương ứng</span>
      </div>

      <div className="grade-selector-bar">
        <button
          className={`grade-btn ${activeGrade === 'all' ? 'active' : ''}`}
          onClick={() => setActiveGrade('all')}
        >
          🌟 Tất cả THCS (Lớp 6 - 9)
        </button>

        <button
          className={`grade-btn g6 ${activeGrade === '6' ? 'active g6' : ''}`}
          onClick={() => setActiveGrade('6')}
        >
          🎒 Lớp 6 (Khởi đầu)
        </button>

        <button
          className={`grade-btn g7 ${activeGrade === '7' ? 'active g7' : ''}`}
          onClick={() => setActiveGrade('7')}
        >
          📐 Lớp 7 (Tam giác & Tỉ lệ)
        </button>

        <button
          className={`grade-btn g8 ${activeGrade === '8' ? 'active g8' : ''}`}
          onClick={() => setActiveGrade('8')}
        >
          ⚡ Lớp 8 (7 HĐT & Đồng dạng)
        </button>

        <button
          className={`grade-btn g9 ${activeGrade === '9' ? 'active g9' : ''}`}
          onClick={() => setActiveGrade('9')}
        >
          🎯 Lớp 9 (Ôn thi vào 10)
        </button>
      </div>

      {/* ==================== DYNAMIC GRADE FORMULAS SHOWCASE ==================== */}
      {activeGrade !== 'all' ? (
        <>
          <div className="thcs-grade-header">
            <h3>
              {activeGrade === '6' && '🎒 Bảng công thức cốt lõi Toán Lớp 6'}
              {activeGrade === '7' && '📐 Bảng công thức cốt lõi Toán Lớp 7'}
              {activeGrade === '8' && '⚡ Bảng công thức cốt lõi Toán Lớp 8'}
              {activeGrade === '9' && '🎯 Bảng công thức trọng tâm Ôn thi vào Lớp 10'}
            </h3>
            <span style={{fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600}}>
              {displayedFormulas.length} công thức then chốt kèm ví dụ số
            </span>
          </div>

          <div className="thcs-formulas-grid">
            {displayedFormulas.map((item) => (
              <div key={item.id} className="thcs-formula-card">
                <div className="thcs-card-badge-row">
                  <span className={`grade-tag ${item.tagColor}`}>{item.gradeBadge}</span>
                </div>

                <h3>{item.title}</h3>

                <div className="thcs-formula-box">
                  <MathFormula latex={item.latex} block />
                </div>

                <div className="thcs-usage-pill">{item.whenToUse}</div>

                <div className="thcs-example-pill">{item.example}</div>

                <div className="thcs-card-action">
                  <button
                    className="primary-btn"
                    style={{padding: '8px 16px', fontSize: 13}}
                    onClick={() => {
                      if (item.targetLessonId) {
                        openLesson(item.targetLessonId);
                      } else if (item.targetTopicId) {
                        openTopic(item.targetTopicId);
                      } else {
                        navigate('formulas');
                      }
                    }}
                  >
                    Xem bài học chi tiết <ArrowRight size={14} />
                  </button>
                  <button
                    className="secondary-btn"
                    style={{padding: '8px 14px', fontSize: 13}}
                    onClick={() => navigate('quiz')}
                  >
                    Luyện tập
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* OVERVIEW TOPIC CARDS FOR ALL GRADES */}
          <div className="topic-grid">
            {filteredPrograms.map((p) => (
              <div key={p.grade} className="thcs-topic-card">
                <div className="thcs-topic-top">
                  <span className={`grade-tag ${p.colorClass}`}>{p.badge}</span>
                  <span style={{fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 600}}>
                    {p.formulaCount}
                  </span>
                </div>

                <div className="thcs-topic-symbol">{p.symbol}</div>

                <h3>{p.title}</h3>
                <p>{p.desc}</p>

                <div className="thcs-topic-footer">
                  <button
                    className="text-btn"
                    style={{padding: 0, fontSize: 13.5}}
                    onClick={() => openTopic(p.topicId)}
                  >
                    Vào học ngay <ArrowRight size={15} />
                  </button>
                  <span style={{fontSize: 12, color: 'var(--muted-foreground)'}}>{p.highlight}</span>
                </div>
              </div>
            ))}
          </div>

          {/* TOP CORE FORMULAS PREVIEW */}
          <div className="thcs-grade-header" style={{marginTop: 32}}>
            <h3>🌟 Tuyển chọn các công thức THCS xuất hiện nhiều nhất trong đề thi</h3>
            <span style={{fontSize: 13, color: 'var(--muted-foreground)', fontWeight: 600}}>
              Bấm vào từng lớp phía trên để xem đầy đủ
            </span>
          </div>

          <div className="thcs-formulas-grid">
            {gradeFormulas.slice(3, 7).map((item) => (
              <div key={item.id} className="thcs-formula-card">
                <div className="thcs-card-badge-row">
                  <span className={`grade-tag ${item.tagColor}`}>{item.gradeBadge}</span>
                </div>

                <h3>{item.title}</h3>

                <div className="thcs-formula-box">
                  <MathFormula latex={item.latex} block />
                </div>

                <div className="thcs-usage-pill">{item.whenToUse}</div>

                <div className="thcs-example-pill">{item.example}</div>

                <div className="thcs-card-action">
                  <button
                    className="primary-btn"
                    style={{padding: '8px 16px', fontSize: 13}}
                    onClick={() => {
                      if (item.targetLessonId) {
                        openLesson(item.targetLessonId);
                      } else if (item.targetTopicId) {
                        openTopic(item.targetTopicId);
                      } else {
                        navigate('formulas');
                      }
                    }}
                  >
                    Xem bài học chi tiết <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ==================== 4 STUDY HABITS BANNER ==================== */}
      <div className="learning-strip" style={{marginTop: 36}}>
        <GraduationCap size={36} />
        <div>
          <h3 style={{fontSize: 16.5, fontWeight: 800}}>4 Bí quyết giúp bạn đạt điểm 9+ Toán Cấp 2</h3>
          <p style={{fontSize: 14, margin: '6px 0 0', lineHeight: 1.6}}>
            1. <strong>Luôn vẽ hình chuẩn</strong> và ký hiệu góc, cạnh bằng nhau ngay lên hình vẽ.
            <br />
            2. <strong>Viết điều kiện xác định (ĐKXĐ)</strong> trước khi biến đổi biểu thức hay giải phương trình.
            <br />
            3. <strong>Rèn tính nhẩm 60s mỗi ngày</strong> để không bao giờ bị mất điểm do tính toán nhầm lẫn.
            <br />
            4. <strong>Tự kiểm tra lại đáp án</strong> bằng cách thay số nhỏ thử lại vào đề bài ban đầu.
          </p>
        </div>
        <button className="secondary-btn" onClick={() => navigate('cheatsheets')}>
          Bảng tra cứu 3 giây <ArrowRight size={16} />
        </button>
      </div>

      <footer className="page-footer">
        MATH HANDBOOK THCS <span>Toán học cấp 2 trực quan, dễ hiểu & đồng hành cùng bạn.</span>
      </footer>
    </>
  );
}