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

  const filteredPrograms =
    activeGrade === 'all'
      ? gradePrograms
      : gradePrograms.filter((p) => p.grade === activeGrade);

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
                    Các bộ 3 số nguyên kinh điển hay gặp trong đề thi: (3, 4, 5), (6, 8, 10), (5, 12, 13).
                  </div>

                  <button
                    className="primary-btn"
                    style={{padding: '9px 16px', fontSize: 13.5}}
                    onClick={() => openLesson('geo-pythagoras')}
                  >
                    Xem bài học & bài tập mẫu <ArrowRight size={15} />
                  </button>
                </div>

                <div className="thcs-diagram-card">
                  <svg viewBox="0 0 240 180" role="img" aria-label="Minh họa Pytago tam giác 3-4-5">
                    {/* Triangle 3-4-5 */}
                    <polygon points="50,140 170,140 50,50" fill="rgba(99, 102, 241, 0.25)" stroke="#818cf8" strokeWidth="2.5" />
                    {/* Right angle symbol */}
                    <path d="M 50,126 L 64,126 L 64,140" fill="none" stroke="#fcd34d" strokeWidth="2" />
                    {/* Labels */}
                    <text x="32" y="100" fill="#f8fafc" fontSize="13" fontWeight="700">b = 3</text>
                    <text x="105" y="160" fill="#f8fafc" fontSize="13" fontWeight="700">a = 4</text>
                    <text x="122" y="90" fill="#fef08a" fontSize="14" fontWeight="800">c = 5</text>
                    {/* Formula highlight */}
                    <text x="95" y="32" fill="#67e8f9" fontSize="12" fontWeight="600">3² + 4² = 9 + 16 = 25 = 5²</text>
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
                    Ví dụ tính nhẩm: 103² = (100 + 3)² = 10000 + 600 + 9 = 10 609.
                  </div>

                  <button
                    className="primary-btn"
                    style={{padding: '9px 16px', fontSize: 13.5}}
                    onClick={() => openLesson('f1')}
                  >
                    Xem trọn bộ 7 hằng đẳng thức <ArrowRight size={15} />
                  </button>
                </div>

                <div className="thcs-diagram-card">
                  <svg viewBox="0 0 200 180" role="img" aria-label="Minh họa hình học hằng đẳng thức">
                    {/* Big Square (a+b) x (a+b) */}
                    <rect x="25" y="25" width="100" height="100" fill="rgba(99, 102, 241, 0.3)" stroke="#818cf8" strokeWidth="2" />
                    <rect x="125" y="25" width="45" height="100" fill="rgba(236, 72, 153, 0.25)" stroke="#f472b6" strokeWidth="2" />
                    <rect x="25" y="125" width="100" height="45" fill="rgba(236, 72, 153, 0.25)" stroke="#f472b6" strokeWidth="2" />
                    <rect x="125" y="125" width="45" height="45" fill="rgba(245, 158, 11, 0.35)" stroke="#fbbf24" strokeWidth="2" />
                    <text x="68" y="80" fill="#ffffff" fontSize="16" fontWeight="700">a²</text>
                    <text x="138" y="80" fill="#fbcfe8" fontSize="13" fontWeight="700">ab</text>
                    <text x="68" y="152" fill="#fbcfe8" fontSize="13" fontWeight="700">ab</text>
                    <text x="138" y="152" fill="#fef08a" fontSize="14" fontWeight="700">b²</text>
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
                    style={{padding: '9px 16px', fontSize: 13.5}}
                    onClick={() => openLesson('f10')}
                  >
                    Xem bài học & cách tính Vi-ét <ArrowRight size={15} />
                  </button>
                </div>

                <div className="thcs-diagram-card">
                  <svg viewBox="0 0 220 180" role="img" aria-label="Minh họa đồ thị Parabol và nghiệm Vi-ét">
                    {/* Axes */}
                    <line x1="20" y1="120" x2="200" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <line x1="60" y1="20" x2="60" y2="160" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    {/* Parabola curve y = (x-2)(x-4) */}
                    <path d="M 65,30 Q 120,170 175,30" fill="none" stroke="#38bdf8" strokeWidth="3" />
                    {/* Intersection points x1, x2 */}
                    <circle cx="95" cy="120" r="5" fill="#f43f5e" />
                    <circle cx="145" cy="120" r="5" fill="#f43f5e" />
                    <text x="90" y="108" fill="#fef08a" fontSize="12" fontWeight="700">x₁</text>
                    <text x="142" y="108" fill="#fef08a" fontSize="12" fontWeight="700">x₂</text>
                    <text x="110" y="45" fill="#c084fc" fontSize="12" fontWeight="700">Δ &gt; 0: 2 nghiệm</text>
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
                    Đặc biệt: Mọi góc nội tiếp chắn nửa đường tròn đều là góc vuông 90°!
                  </div>

                  <button
                    className="primary-btn"
                    style={{padding: '9px 16px', fontSize: 13.5}}
                    onClick={() => navigate('geometry')}
                  >
                    Xem thư viện hình học đường tròn <ArrowRight size={15} />
                  </button>
                </div>

                <div className="thcs-diagram-card">
                  <svg viewBox="0 0 200 180" role="img" aria-label="Minh họa góc nội tiếp và góc ở tâm">
                    {/* Circle */}
                    <circle cx="100" cy="95" r="65" fill="none" stroke="#818cf8" strokeWidth="2.5" />
                    <circle cx="100" cy="95" r="3" fill="#fcd34d" />
                    <text x="106" y="93" fill="#fcd34d" fontSize="11" fontWeight="700">O</text>
                    {/* Points A, B on circle */}
                    <circle cx="50" cy="135" r="4" fill="#38bdf8" />
                    <text x="35" y="145" fill="#38bdf8" fontSize="12" fontWeight="700">A</text>
                    <circle cx="150" cy="135" r="4" fill="#38bdf8" />
                    <text x="157" y="145" fill="#38bdf8" fontSize="12" fontWeight="700">B</text>
                    {/* Point M */}
                    <circle cx="100" cy="30" r="4" fill="#f43f5e" />
                    <text x="96" y="22" fill="#f43f5e" fontSize="12" fontWeight="700">M</text>
                    {/* Central angle rays */}
                    <line x1="100" y1="95" x2="50" y2="135" stroke="#fcd34d" strokeWidth="1.8" strokeDasharray="3 3" />
                    <line x1="100" y1="95" x2="150" y2="135" stroke="#fcd34d" strokeWidth="1.8" strokeDasharray="3 3" />
                    {/* Inscribed angle lines */}
                    <line x1="100" y1="30" x2="50" y2="135" stroke="#f43f5e" strokeWidth="2" />
                    <line x1="100" y1="30" x2="150" y2="135" stroke="#f43f5e" strokeWidth="2" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ==================== SEARCH BAR ==================== */}
      <div className="searchbar">
        <Search size={21} />
        <input
          aria-label="Tìm kiếm công thức"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Tìm công thức THCS: 7 hằng đẳng thức, Pytago, Vi-ét, góc nội tiếp, diện tích hình thoi..."
        />
      </div>

      {/* ==================== 4 SUPER TOOLS FOR STUDENTS ==================== */}
      <div className="section-heading" style={{margin: '18px 0 12px'}}>
        <h2>Bảo bối học tập cho học sinh THCS</h2>
        <span className="muted" style={{fontSize: 13}}>Công cụ thông minh giúp bạn học nhanh gấp đôi</span>
      </div>

      <div className="thcs-tools-grid">
        <div className="thcs-tool-card" onClick={() => navigate('tutor')}>
          <div className="thcs-tool-icon-wrap camera">
            <Camera size={24} />
          </div>
          <h4>
            Gia sư AI giải đề ảnh
            <ArrowRight size={15} />
          </h4>
          <p>Chụp ảnh hoặc tải đề thi hình học, đại số lên. AI nhận diện và hướng dẫn giải từng bước.</p>
        </div>

        <div className="thcs-tool-card" onClick={() => navigate('arena')}>
          <div className="thcs-tool-icon-wrap lightning">
            <Zap size={24} />
          </div>
          <h4>
            Đấu trường 60s
            <ArrowRight size={15} />
          </h4>
          <p>Thử thách phản xạ tính nhẩm nhanh: cộng trừ nhân chia, bình phương và lượng giác cơ bản.</p>
        </div>

        <div className="thcs-tool-card" onClick={() => navigate('geometry')}>
          <div className="thcs-tool-icon-wrap geometry">
            <Compass size={24} />
          </div>
          <h4>
            Hình học trực quan
            <ArrowRight size={15} />
          </h4>
          <p>Tách riêng từng hình (tam giác, hình thoi, thang, tròn) có hình vẽ minh họa và tính diện tích tự động.</p>
        </div>

        <div className="thcs-tool-card" onClick={() => navigate('mindmap')}>
          <div className="thcs-tool-icon-wrap mindmap">
            <Network size={24} />
          </div>
          <h4>
            Sơ đồ tư duy & Lộ trình
            <ArrowRight size={15} />
          </h4>
          <p>Khung kiến thức dạng cây: mất gốc thì nên bắt đầu từ đâu, bài nào làm nền tảng cho bài nào.</p>
        </div>
      </div>

      {/* ==================== GAMIFIED STREAK STRIP ==================== */}
      <div className="thcs-streak-strip">
        <div className="thcs-streak-info">
          <div className="thcs-flame-badge">
            <Flame size={24} />
          </div>
          <div className="thcs-streak-text">
            <h4>Chuỗi 3 ngày chăm chỉ · Cấp độ: Học bá THCS ⭐</h4>
            <p>Học đều đặn 15 phút mỗi ngày hiệu quả hơn học dồn trước ngày thi 10 lần!</p>
          </div>
        </div>

        <div style={{display: 'flex', gap: 10}}>
          <button className="primary-btn" onClick={() => navigate('quiz')} style={{padding: '8px 15px', fontSize: 13}}>
            Luyện Quiz ngay <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ==================== GRADE FILTER BAR ==================== */}
      <div className="section-heading">
        <h2>Chương trình khung theo từng khối lớp</h2>
        <span className="muted" style={{fontSize: 13}}>Chọn lớp của bạn để tập trung vào đúng bài học</span>
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
          🎒 Lớp 6
        </button>

        <button
          className={`grade-btn g7 ${activeGrade === '7' ? 'active g7' : ''}`}
          onClick={() => setActiveGrade('7')}
        >
          📐 Lớp 7
        </button>

        <button
          className={`grade-btn g8 ${activeGrade === '8' ? 'active g8' : ''}`}
          onClick={() => setActiveGrade('8')}
        >
          ⚡ Lớp 8
        </button>

        <button
          className={`grade-btn g9 ${activeGrade === '9' ? 'active g9' : ''}`}
          onClick={() => setActiveGrade('9')}
        >
          🎯 Lớp 9 (Ôn thi vào 10)
        </button>
      </div>

      {/* ==================== GRADE CARDS GRID ==================== */}
      <div className="topic-grid">
        {filteredPrograms.map((p) => (
          <div key={p.grade} className="thcs-topic-card">
            <div className="thcs-topic-top">
              <span className={`grade-tag ${p.colorClass}`}>{p.badge}</span>
              <span style={{fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 600}}>{p.formulaCount}</span>
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

      {/* ==================== 4 STUDY HABITS BANNER ==================== */}
      <div className="learning-strip" style={{marginTop: 32}}>
        <GraduationCap size={32} />
        <div>
          <h3 style={{fontSize: 16}}>4 Bí quyết giúp bạn đạt điểm 9+ Toán Cấp 2</h3>
          <p style={{fontSize: 13.5, margin: '4px 0 0'}}>
            1. Luôn vẽ hình chuẩn và ký hiệu góc, cạnh bằng nhau ngay lên hình.
            <br />
            2. Viết rõ điều kiện xác định trước khi biến đổi biểu thức hay giải phương trình.
            <br />
            3. Rèn tính nhẩm 60s mỗi ngày để không bao giờ bị mất điểm do tính toán nhầm lẫn.
            <br />
            4. Tự kiểm tra lại đáp án bằng cách thay số nhỏ thử lại vào đề bài ban đầu.
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