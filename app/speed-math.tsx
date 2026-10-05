'use client';
import {useState,useEffect,useCallback,useRef} from 'react';
import {Timer,Trophy,Flame,Sparkles,RotateCcw,ArrowRight,Zap,CheckCircle,XCircle} from 'lucide-react';
import {MathFormula} from './math';

interface Question {
  prompt: string;
  latex?: string;
  options: number[];
  answer: number;
  explanation: string;
}

const r = String.raw;

const QUESTION_BANK: (() => Question)[] = [
  () => {
    const a = [101, 102, 103, 99, 98][Math.floor(Math.random() * 5)];
    const ans = a * a;
    return {
      prompt: `Tính nhanh ${a}²:`,
      latex: `${a}^2 = ?`,
      options: [ans, ans + 20, ans - 10, ans + 10].sort(() => Math.random() - 0.5),
      answer: ans,
      explanation: `${a}² = ${ans}`,
    };
  },
  () => {
    const pairs = [
      {a: 51, b: 49, ans: 200},
      {a: 21, b: 19, ans: 80},
      {a: 31, b: 29, ans: 120},
      {a: 42, b: 38, ans: 320},
    ];
    const item = pairs[Math.floor(Math.random() * pairs.length)];
    return {
      prompt: `Hiệu hai bình phương:`,
      latex: `${item.a}^2 - ${item.b}^2 = ?`,
      options: [item.ans, item.ans + 10, item.ans - 20, item.ans + 40].sort(() => Math.random() - 0.5),
      answer: item.ans,
      explanation: `(${item.a} − ${item.b})(${item.a} + ${item.b}) = ${item.ans}`,
    };
  },
  () => {
    const trig = [
      {q: r`\sin 30^\circ \times 2`, ans: 1, exp: '2 × 0.5 = 1'},
      {q: r`\cos 60^\circ \times 4`, ans: 2, exp: '4 × 0.5 = 2'},
      {q: r`\tan 45^\circ \times 5`, ans: 5, exp: '5 × 1 = 5'},
      {q: r`\sin^2 45^\circ + \cos^2 45^\circ`, ans: 1, exp: 'Hệ thức cơ bản = 1'},
      {q: r`2 \sin 15^\circ \cos 15^\circ`, ans: 0.5, exp: 'sin 30° = 0.5'},
    ];
    const item = trig[Math.floor(Math.random() * trig.length)];
    return {
      prompt: 'Giá trị lượng giác:',
      latex: `${item.q} = ?`,
      options: [item.ans, item.ans + 1, item.ans + 0.5, item.ans - 0.5].sort(() => Math.random() - 0.5),
      answer: item.ans,
      explanation: item.exp,
    };
  },
  () => {
    const derivs = [
      {q: r`(x^2)' \text{ tại } x = 4`, ans: 8, exp: '2x tại 4 là 8'},
      {q: r`(x^3)' \text{ tại } x = 2`, ans: 12, exp: '3x² tại 2 là 12'},
      {q: r`(5x - 3)' \text{ tại } x = 7`, ans: 5, exp: 'Đạo hàm bậc nhất = 5'},
      {q: r`(\sin x)' \text{ tại } x = 0`, ans: 1, exp: 'cos(0) = 1'},
    ];
    const item = derivs[Math.floor(Math.random() * derivs.length)];
    return {
      prompt: 'Đạo hàm tại điểm:',
      latex: item.q,
      options: [item.ans, item.ans + 2, item.ans - 2, item.ans + 4].sort(() => Math.random() - 0.5),
      answer: item.ans,
      explanation: item.exp,
    };
  },
  () => {
    const a = Math.floor(Math.random() * 4) + 1;
    const b = Math.floor(Math.random() * 3) + 1;
    const c = Math.floor(Math.random() * 3) + 1;
    const d = Math.floor(Math.random() * 4) + 1;
    const det = a * d - b * c;
    return {
      prompt: 'Định thức ma trận cấp 2:',
      latex: String.raw`\det \begin{pmatrix} ${a} & ${b} \\ ${c} & ${d} \end{pmatrix} = ?`,
      options: [det, det + 2, det - 3, det + 5].sort(() => Math.random() - 0.5),
      answer: det,
      explanation: `${a}×${d} − ${b}×${c} = ${det}`,
    };
  },
  () => {
    const combs = [
      {q: r`C_4^2`, ans: 6, exp: '4!/(2!2!) = 6'},
      {q: r`C_5^2`, ans: 10, exp: '5!/(2!3!) = 10'},
      {q: r`A_3^2`, ans: 6, exp: '3!/1! = 6'},
      {q: r`C_6^1`, ans: 6, exp: '6'},
      {q: r`4!`, ans: 24, exp: '4×3×2×1 = 24'},
    ];
    const item = combs[Math.floor(Math.random() * combs.length)];
    return {
      prompt: 'Tổ hợp & Giai thừa:',
      latex: `${item.q} = ?`,
      options: [item.ans, item.ans + 4, item.ans - 2, item.ans + 2].sort(() => Math.random() - 0.5),
      answer: item.ans,
      explanation: item.exp,
    };
  },
  () => {
    const logs = [
      {q: r`\log_2 32`, ans: 5, exp: '2⁵ = 32'},
      {q: r`\log_3 27`, ans: 3, exp: '3³ = 27'},
      {q: r`\lg 1000`, ans: 3, exp: '10³ = 1000'},
      {q: r`\log_2 8 + \log_2 4`, ans: 5, exp: '3 + 2 = 5'},
    ];
    const item = logs[Math.floor(Math.random() * logs.length)];
    return {
      prompt: 'Logarit nhẩm nhanh:',
      latex: `${item.q} = ?`,
      options: [item.ans, item.ans + 1, item.ans - 1, item.ans + 2].sort(() => Math.random() - 0.5),
      answer: item.ans,
      explanation: item.exp,
    };
  },
];

export function SpeedMathArena() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{correct: boolean; text: string} | null>(null);
  const [stats, setStats] = useState({total: 0, correct: 0});
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('math-speed-highscore');
      if (stored) setHighScore(Number(stored));
    } catch {}
  }, []);

  const nextQuestion = useCallback(() => {
    const generator = QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
    setCurrentQ(generator());
    setFeedback(null);
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setStats({total: 0, correct: 0});
    nextQuestion();
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setHighScore(prev => {
        const nextHigh = Math.max(prev, score);
        try {
          localStorage.setItem('math-speed-highscore', String(nextHigh));
        } catch {}
        return nextHigh;
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score]);

  const handleAnswer = (choice: number) => {
    if (!currentQ || !isPlaying) return;
    const isCorrect = Math.abs(choice - currentQ.answer) < 1e-6;

    setStats(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));

    if (isCorrect) {
      const newStreak = streak + 1;
      const multiplier = newStreak >= 6 ? 3 : newStreak >= 3 ? 2 : 1;
      const addedPoints = 10 * multiplier;
      setScore(s => s + addedPoints);
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));
      setFeedback({correct: true, text: `+${addedPoints}đ (x${multiplier})!`});
    } else {
      setStreak(0);
      setFeedback({correct: false, text: `Sai rồi! ${currentQ.explanation}`});
    }

    setTimeout(() => {
      nextQuestion();
    }, 450);
  };

  const getRank = (finalScore: number) => {
    if (finalScore >= 200) return {title: 'Bác học Gauss', badge: '🏅 HUY CHƯƠNG VÀNG'};
    if (finalScore >= 120) return {title: 'Thần đồng tính nhẩm', badge: '🥈 BẠC XUẤT SẮC'};
    if (finalScore >= 60) return {title: 'Cao thủ giải nhanh', badge: '🥉 ĐỒNG TIẾN BỘ'};
    return {title: 'Học viên chăm chỉ', badge: '🎖️ HOÀN THÀNH'};
  };

  return (
    <section className="panel speed-arena prose">
      <div className="section-title">
        <div>
          <span className="tag" style={{background: '#fffae6', color: '#b45309'}}>
            <Zap size={14} style={{display: 'inline', marginRight: 4}} />
            ĐẤU TRƯỜNG TÍNH NHANH 60s
          </span>
          <h2>Thử thách tốc độ Toán học</h2>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <span className="small muted">Kỷ lục của bạn:</span>
          <strong style={{color: '#f59e0b', fontSize: 18}}>🏆 {highScore}đ</strong>
        </div>
      </div>

      {!isPlaying && timeLeft === 60 ? (
        <div className="quiz-start" style={{margin: '20px auto', padding: '30px 20px'}}>
          <div className="large-symbol" style={{color: '#f59e0b'}}>⚡</div>
          <h2>60 giây. Bao nhiêu điểm bạn có thể đạt?</h2>
          <p>
            Trả lời nhanh các câu hỏi nhẩm hằng đẳng thức, ma trận, lượng giác, đạo hàm và tổ hợp. Trả lời đúng liên tiếp sẽ nhân đôi (x2), nhân ba (x3) điểm thưởng combo!
          </p>
          <div className="control-row center" style={{marginTop: 20}}>
            <button className="primary-btn" onClick={startGame} style={{fontSize: 16, padding: '12px 24px'}}>
              Bắt đầu thử thách ngay <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : !isPlaying && timeLeft === 0 ? (
        <div className="quiz-result" style={{margin: '20px auto', padding: '30px 20px'}}>
          <span className="result-score" style={{color: '#f59e0b'}}>{score}</span>
          <p style={{fontSize: 14, color: 'var(--muted-foreground)', marginTop: 4}}>ĐIỂM TỔNG KẾT</p>
          <h2>{getRank(score).badge}: {getRank(score).title}</h2>
          <div className="stats-grid" style={{maxWidth: 480, margin: '20px auto'}}>
            <div className="panel" style={{padding: 14}}>
              <strong className="stat-value" style={{fontSize: 24}}>{stats.correct}/{stats.total}</strong>
              <p>Số câu đúng</p>
            </div>
            <div className="panel" style={{padding: 14}}>
              <strong className="stat-value" style={{fontSize: 24}}>{stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(0) : 0}%</strong>
              <p>Độ chính xác</p>
            </div>
            <div className="panel" style={{padding: 14}}>
              <strong className="stat-value" style={{fontSize: 24, color: '#ef4444'}}>x{maxStreak}</strong>
              <p>Chuỗi combo dài nhất</p>
            </div>
            <div className="panel" style={{padding: 14}}>
              <strong className="stat-value" style={{fontSize: 24, color: '#f59e0b'}}>{highScore}</strong>
              <p>Kỷ lục cá nhân</p>
            </div>
          </div>
          <button className="primary-btn" onClick={startGame}>
            <RotateCcw size={16} /> Chơi lại lần nữa
          </button>
        </div>
      ) : (
        <div>
          {/* Game in progress UI */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <Timer size={20} color={timeLeft <= 10 ? '#ef4444' : '#555ce5'} />
              <strong style={{fontSize: 22, color: timeLeft <= 10 ? '#ef4444' : 'var(--foreground)'}}>
                {timeLeft}s
              </strong>
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              {streak >= 3 && (
                <span
                  style={{
                    background: '#fef2f2',
                    color: '#ef4444',
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontWeight: 'bold',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Flame size={15} /> Chuỗi {streak} (x{streak >= 6 ? 3 : 2})!
                </span>
              )}
              <div style={{fontSize: 20, fontWeight: 'bold', color: '#555ce5'}}>
                Điểm: {score}
              </div>
            </div>
          </div>

          {/* Progress bar of time */}
          <div style={{height: 6, background: 'var(--muted)', borderRadius: 3, overflow: 'hidden', marginBottom: 20}}>
            <div
              style={{
                height: '100%',
                width: `${(timeLeft / 60) * 100}%`,
                background: timeLeft <= 10 ? '#ef4444' : '#555ce5',
                transition: 'width 1s linear',
              }}
            />
          </div>

          {/* Question card */}
          {currentQ && (
            <div className="panel" style={{textAlign: 'center', padding: '24px 20px', background: 'var(--background)'}}>
              <p style={{fontSize: 15, color: 'var(--muted-foreground)', marginBottom: 8}}>{currentQ.prompt}</p>
              {currentQ.latex && (
                <div style={{fontSize: 24, margin: '14px 0'}}>
                  <MathFormula latex={currentQ.latex} />
                </div>
              )}

              {feedback && (
                <p
                  style={{
                    fontWeight: 'bold',
                    color: feedback.correct ? '#22c55e' : '#ef4444',
                    margin: '8px 0',
                    fontSize: 15,
                  }}
                >
                  {feedback.text}
                </p>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 12,
                  marginTop: 18,
                }}
              >
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="secondary-btn"
                    onClick={() => handleAnswer(opt)}
                    style={{
                      padding: '16px 12px',
                      fontSize: 18,
                      fontWeight: 'bold',
                      justifyContent: 'center',
                      background: 'var(--card)',
                      borderRadius: 10,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
