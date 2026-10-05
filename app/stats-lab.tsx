'use client';
import {useState,useMemo,useCallback} from 'react';
import {fmt,NumberField} from './labs';
import {Slider} from '@/components/ui/slider';
import {MathFormula} from './math';
import {RotateCcw,Dices,Sparkles,Info} from 'lucide-react';

// Approximation of the error function erf(x) (Abramowitz & Stegun formula 7.1.26, max error 1.5e-7)
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

// Normal Cumulative Distribution Function (CDF)
function normalCdf(x: number, mean: number, std: number): number {
  return 0.5 * (1 + erf((x - mean) / (std * Math.SQRT2)));
}

// Probability density function
function normalPdf(x: number, mean: number, std: number): number {
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mean) / std) ** 2);
}

export function StatsLab() {
  const [mean, setMean] = useState(0);
  const [std, setStd] = useState(1);
  const [lower, setLower] = useState(-1);
  const [upper, setUpper] = useState(1);
  const [diceCount, setDiceCount] = useState(2);
  const [trials, setTrials] = useState<number[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // SVG coordinate configuration
  const svgWidth = 540;
  const svgHeight = 280;
  const plotLeft = 40;
  const plotRight = 510;
  const plotBottom = 230;
  const plotTop = 30;

  // X range: [mean - 4*std, mean + 4*std]
  const xMin = mean - 4.2 * std;
  const xMax = mean + 4.2 * std;
  const maxPdf = normalPdf(mean, mean, std) * 1.15;

  const toSvgX = useCallback((x: number) => {
    return plotLeft + ((x - xMin) / (xMax - xMin)) * (plotRight - plotLeft);
  }, [xMin, xMax, plotLeft, plotRight]);

  const toSvgY = useCallback((y: number) => {
    return plotBottom - (y / maxPdf) * (plotBottom - plotTop);
  }, [maxPdf, plotBottom, plotTop]);

  // Curve path
  const curvePoints = useMemo(() => {
    const pts: {x: number; y: number}[] = [];
    const steps = 180;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + ((xMax - xMin) * i) / steps;
      const y = normalPdf(x, mean, std);
      pts.push({x: toSvgX(x), y: toSvgY(y)});
    }
    return pts;
  }, [xMin, xMax, mean, std, toSvgX, toSvgY]);

  const curvePath = useMemo(() => {
    return curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  }, [curvePoints]);

  // Shaded area path between lower and upper
  const actualLower = Math.min(lower, upper);
  const actualUpper = Math.max(lower, upper);

  const areaPath = useMemo(() => {
    const pts: {x: number; y: number}[] = [];
    const steps = 90;
    for (let i = 0; i <= steps; i++) {
      const x = actualLower + ((actualUpper - actualLower) * i) / steps;
      const y = normalPdf(x, mean, std);
      pts.push({x: toSvgX(x), y: toSvgY(y)});
    }
    if (pts.length === 0) return '';
    const startX = toSvgX(actualLower);
    const endX = toSvgX(actualUpper);
    let d = `M ${startX.toFixed(2)} ${plotBottom} `;
    for (const p of pts) {
      d += `L ${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
    }
    d += `L ${endX.toFixed(2)} ${plotBottom} Z`;
    return d;
  }, [actualLower, actualUpper, mean, std, toSvgX, toSvgY, plotBottom]);

  // Probability
  const prob = useMemo(() => {
    return normalCdf(actualUpper, mean, std) - normalCdf(actualLower, mean, std);
  }, [actualLower, actualUpper, mean, std]);

  // Central Limit Theorem: Roll dice simulation
  const rollDiceBatch = useCallback((count: number) => {
    setIsSimulating(true);
    const newTrials: number[] = [];
    for (let t = 0; t < count; t++) {
      let sum = 0;
      for (let d = 0; d < diceCount; d++) {
        sum += Math.floor(Math.random() * 6) + 1;
      }
      newTrials.push(sum / diceCount); // average
    }
    setTrials(prev => [...prev.slice(-900), ...newTrials]);
    setIsSimulating(false);
  }, [diceCount]);

  // Calculate histogram for dice simulation
  const histogram = useMemo(() => {
    if (trials.length === 0) return [];
    const bins = 20;
    const minVal = 1;
    const maxVal = 6;
    const counts = new Array(bins).fill(0);
    for (const val of trials) {
      const b = Math.min(bins - 1, Math.floor(((val - minVal) / (maxVal - minVal)) * bins));
      counts[b]++;
    }
    const maxCount = Math.max(1, ...counts);
    return counts.map((cnt, i) => ({
      x: minVal + (i / bins) * (maxVal - minVal),
      height: (cnt / maxCount) * 70,
      count: cnt,
    }));
  }, [trials]);

  return (
    <div className="lab-layout">
      <section className="panel graph-panel prose">
        <div className="section-title">
          <div>
            <span className="tag">PHÂN PHỐI CHUẨN GAUSS</span>
            <h2>Đường cong hình chuông & Xác suất</h2>
          </div>
          <div className="control-row">
            <button
              className="icon-button"
              aria-label="Đặt lại mặc định"
              onClick={() => {
                setMean(0);
                setStd(1);
                setLower(-1);
                setUpper(1);
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Normal distribution SVG graph */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="interactive-graph"
          role="img"
          aria-label={`Phân phối chuẩn: kỳ vọng ${mean}, độ lệch chuẩn ${std}. Xác suất P(${actualLower} ≤ X ≤ ${actualUpper}) = ${(prob * 100).toFixed(2)}%`}
        >
          {/* Baseline */}
          <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="currentColor" opacity="0.3" strokeWidth="1.5" />

          {/* Shaded Area under curve */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#gaussGrad)"
              stroke="#555ce5"
              strokeWidth="1.5"
              opacity="0.85"
            />
          )}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gaussGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#555ce5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b56d4" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Bell Curve Line */}
          <path d={curvePath} fill="none" stroke="#555ce5" strokeWidth="3" />

          {/* Mean line */}
          <line
            x1={toSvgX(mean)}
            y1={toSvgY(normalPdf(mean, mean, std))}
            x2={toSvgX(mean)}
            y2={plotBottom}
            stroke="#e29b36"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <text x={toSvgX(mean)} y={plotBottom + 16} fontSize="11" fill="#e29b36" textAnchor="middle" fontWeight="bold">
            μ = {mean}
          </text>

          {/* 1-Sigma lines */}
          {[-1, 1].map(k => (
            <g key={k}>
              <line
                x1={toSvgX(mean + k * std)}
                y1={toSvgY(normalPdf(mean + k * std, mean, std))}
                x2={toSvgX(mean + k * std)}
                y2={plotBottom}
                stroke="currentColor"
                opacity="0.25"
                strokeDasharray="2 2"
              />
              <text x={toSvgX(mean + k * std)} y={plotBottom + 15} fontSize="9" fill="currentColor" opacity="0.6" textAnchor="middle">
                {k > 0 ? `+${k}σ` : `${k}σ`}
              </text>
            </g>
          ))}

          {/* Lower cutoff line */}
          <line
            x1={toSvgX(actualLower)}
            y1={toSvgY(normalPdf(actualLower, mean, std))}
            x2={toSvgX(actualLower)}
            y2={plotBottom}
            stroke="#31a58d"
            strokeWidth="2.5"
          />
          <circle cx={toSvgX(actualLower)} cy={toSvgY(normalPdf(actualLower, mean, std))} r="5" fill="#31a58d" stroke="white" strokeWidth="2" />
          <text x={toSvgX(actualLower)} y={plotBottom + 28} fontSize="10" fill="#31a58d" textAnchor="middle" fontWeight="bold">
            a = {actualLower}
          </text>

          {/* Upper cutoff line */}
          <line
            x1={toSvgX(actualUpper)}
            y1={toSvgY(normalPdf(actualUpper, mean, std))}
            x2={toSvgX(actualUpper)}
            y2={plotBottom}
            stroke="#8870e8"
            strokeWidth="2.5"
          />
          <circle cx={toSvgX(actualUpper)} cy={toSvgY(normalPdf(actualUpper, mean, std))} r="5" fill="#8870e8" stroke="white" strokeWidth="2" />
          <text x={toSvgX(actualUpper)} y={plotBottom + 28} fontSize="10" fill="#8870e8" textAnchor="middle" fontWeight="bold">
            b = {actualUpper}
          </text>
        </svg>

        {/* 3-Sigma Rule quick presets */}
        <div style={{marginTop: 14}}>
          <span className="small muted" style={{display: 'block', marginBottom: 6}}>Quy tắc thực nghiệm 3-Sigma (Mẫu nhanh):</span>
          <div className="control-row" style={{margin: 0, gap: 8}}>
            <button
              className="secondary-btn small-btn"
              onClick={() => {
                setLower(Number((mean - std).toFixed(2)));
                setUpper(Number((mean + std).toFixed(2)));
              }}
            >
              1σ [μ−σ, μ+σ] (≈68.3%)
            </button>
            <button
              className="secondary-btn small-btn"
              onClick={() => {
                setLower(Number((mean - 2 * std).toFixed(2)));
                setUpper(Number((mean + 2 * std).toFixed(2)));
              }}
            >
              2σ [μ−2σ, μ+2σ] (≈95.5%)
            </button>
            <button
              className="secondary-btn small-btn"
              onClick={() => {
                setLower(Number((mean - 3 * std).toFixed(2)));
                setUpper(Number((mean + 3 * std).toFixed(2)));
              }}
            >
              3σ [μ−3σ, μ+3σ] (≈99.7%)
            </button>
          </div>
        </div>

        {/* Central Limit Theorem experiment box */}
        <div className="example-solution-box" style={{marginTop: 20}}>
          <div className="example-solution-title">
            <Dices size={18} />
            <strong>Thí nghiệm Định lý Giới hạn Trung tâm (CLT) với Xúc xắc:</strong>
          </div>
          <p className="small" style={{margin: '6px 0 10px'}}>
            Tung đồng thời {diceCount} con xúc xắc rồi lấy trung bình số chấm. Khi số lần thử tăng lên, phân phối trung bình mẫu sẽ tự động hội tụ về hình chuông Gauss!
          </p>
          <div className="control-row" style={{margin: '8px 0'}}>
            <label className="field" style={{margin: 0}}>
              <span>Số xúc xắc mỗi lượt ({diceCount}):</span>
              <div style={{display: 'flex', gap: 6, marginTop: 4}}>
                {[1, 2, 4, 8].map(cnt => (
                  <button
                    key={cnt}
                    className={`secondary-btn small-btn ${diceCount === cnt ? 'active' : ''}`}
                    onClick={() => {
                      setDiceCount(cnt);
                      setTrials([]);
                    }}
                  >
                    {cnt} con
                  </button>
                ))}
              </div>
            </label>
            <button
              className="primary-btn small-btn"
              disabled={isSimulating}
              onClick={() => rollDiceBatch(100)}
            >
              <Dices size={14} /> Tung 100 lần
            </button>
            <button
              className="secondary-btn small-btn"
              onClick={() => setTrials([])}
            >
              Xóa dữ liệu ({trials.length} mẫu)
            </button>
          </div>

          {/* Histogram bar preview */}
          {trials.length > 0 && (
            <div style={{marginTop: 10}}>
              <svg viewBox="0 0 460 90" style={{width: '100%', background: 'var(--card)', borderRadius: 8}}>
                <line x1="20" y1="80" x2="440" y2="80" stroke="currentColor" opacity="0.2" />
                {histogram.map((bar, i) => (
                  <rect
                    key={i}
                    x={25 + i * 20}
                    y={80 - bar.height}
                    width="17"
                    height={Math.max(1, bar.height)}
                    fill="#555ce5"
                    rx="2"
                    opacity="0.8"
                  />
                ))}
                <text x="25" y="88" fontSize="9" fill="currentColor" opacity="0.6">1</text>
                <text x="225" y="88" fontSize="9" fill="currentColor" opacity="0.6">3.5 (Kỳ vọng)</text>
                <text x="420" y="88" fontSize="9" fill="currentColor" opacity="0.6">6</text>
              </svg>
              <span className="small muted">
                Đã thực hiện {trials.length} lượt. Trung bình quan sát: {(trials.reduce((a, b) => a + b, 0) / trials.length).toFixed(3)}.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Control parameters panel */}
      <aside className="panel prose">
        <span className="tag">THÔNG SỐ & XÁC SUẤT</span>
        <MathFormula latex={String.raw`f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}`} />

        <div style={{margin: '14px 0'}}>
          <label className="slider-label">Kỳ vọng μ = {mean}</label>
          <Slider min={-5} max={5} step={0.1} value={[mean]} onValueChange={v => setMean(v[0])} />
        </div>

        <div style={{margin: '14px 0'}}>
          <label className="slider-label">Độ lệch chuẩn σ = {std}</label>
          <Slider min={0.4} max={3.0} step={0.1} value={[std]} onValueChange={v => setStd(v[0])} />
        </div>

        <div className="control-row" style={{margin: '16px 0 10px'}}>
          <NumberField label="Cận dưới a" value={lower} onChange={setLower} min={-20} max={20} step={0.1} />
          <NumberField label="Cận trên b" value={upper} onChange={setUpper} min={-20} max={20} step={0.1} />
        </div>

        {/* Result probability metric */}
        <div className="metric highlight-metric" style={{marginTop: 12}}>
          <span>Xác suất P({actualLower} ≤ X ≤ {actualUpper})</span>
          <strong style={{color: '#555ce5', fontSize: '22px'}}>
            {(prob * 100).toFixed(3)}%
          </strong>
        </div>

        <div className="metric">
          <span>Chuẩn hóa Z cận a: (a − μ)/σ</span>
          <strong>{((actualLower - mean) / std).toFixed(3)}</strong>
        </div>

        <div className="metric">
          <span>Chuẩn hóa Z cận b: (b − μ)/σ</span>
          <strong>{((actualUpper - mean) / std).toFixed(3)}</strong>
        </div>

        <div className="metric">
          <span>Đỉnh hàm mật độ f(μ)</span>
          <strong>{fmt(normalPdf(mean, mean, std))}</strong>
        </div>

        <p className="small muted">
          Diện tích phần tô màu dưới đường cong chuẩn chính là xác suất biến ngẫu nhiên X rơi vào đoạn [a, b]. Tổng diện tích toàn miền từ −∞ đến +∞ luôn bằng 100% (1.0).
        </p>
      </aside>
    </div>
  );
}
