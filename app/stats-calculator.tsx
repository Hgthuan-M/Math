'use client';
import {useState,useMemo} from 'react';
import {fmt,NumberField} from './labs';
import {MathFormula,MathText} from './math';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {BarChart3,Layers,Calculator,Sparkles} from 'lucide-react';

export function StatsCalculator() {
  return (
    <div className="stats-calc-container">
      <Tabs defaultValue="sample">
        <TabsList className="max-w-full overflow-x-auto justify-start">
          <TabsTrigger value="sample">Thống kê mẫu số liệu & Box Plot</TabsTrigger>
          <TabsTrigger value="combinatorics">Hoán vị, Chỉnh hợp & Tổ hợp</TabsTrigger>
          <TabsTrigger value="binomial">Phân phối Nhị thức B(n, p)</TabsTrigger>
        </TabsList>

        <TabsContent value="sample">
          <SampleStatistics />
        </TabsContent>

        <TabsContent value="combinatorics">
          <CombinatoricsCalculator />
        </TabsContent>

        <TabsContent value="binomial">
          <BinomialCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SampleStatistics() {
  const [rawInput, setRawInput] = useState('14, 16, 15, 18, 20, 15, 22, 19, 17, 24');

  // Parse input numbers
  const numbers = useMemo(() => {
    return rawInput
      .split(/[,;\s\n]+/)
      .map(s => Number(s.trim().replace(',', '.')))
      .filter(n => Number.isFinite(n))
      .sort((a, b) => a - b);
  }, [rawInput]);

  const n = numbers.length;

  const stats = useMemo(() => {
    if (n === 0) return null;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 === 0 ? (numbers[mid - 1] + numbers[mid]) / 2 : numbers[mid];

    // Quartiles
    const lowerHalf = numbers.slice(0, Math.floor(n / 2));
    const upperHalf = numbers.slice(n % 2 === 0 ? mid : mid + 1);

    const getMedian = (arr: number[]) => {
      if (arr.length === 0) return median;
      const m = Math.floor(arr.length / 2);
      return arr.length % 2 === 0 ? (arr[m - 1] + arr[m]) / 2 : arr[m];
    };

    const q1 = getMedian(lowerHalf);
    const q3 = getMedian(upperHalf);
    const iqr = q3 - q1;

    // Variance & Standard Deviation
    const varianceSample = n > 1 ? numbers.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (n - 1) : 0;
    const stdSample = Math.sqrt(varianceSample);

    const variancePop = numbers.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n;
    const stdPop = Math.sqrt(variancePop);

    const min = numbers[0];
    const max = numbers[n - 1];
    const range = max - min;

    // Mode
    const freq: Record<number, number> = {};
    for (const num of numbers) freq[num] = (freq[num] || 0) + 1;
    let maxFreq = 0;
    let mode: number[] = [];
    for (const [k, count] of Object.entries(freq)) {
      if (count > maxFreq) {
        maxFreq = count;
        mode = [Number(k)];
      } else if (count === maxFreq && maxFreq > 1) {
        mode.push(Number(k));
      }
    }

    return {
      n,
      sum,
      mean,
      median,
      q1,
      q3,
      iqr,
      varianceSample,
      stdSample,
      variancePop,
      stdPop,
      min,
      max,
      range,
      mode: maxFreq > 1 ? mode : [],
    };
  }, [numbers, n]);

  // Box Plot SVG calculations
  const boxPlot = useMemo(() => {
    if (!stats || stats.range === 0) return null;
    const width = 480;
    const left = 35;
    const right = width - 35;
    const plotSpan = right - left;

    const scaleX = (val: number) => {
      return left + ((val - stats.min) / (stats.max - stats.min)) * plotSpan;
    };

    return {
      minX: scaleX(stats.min),
      q1X: scaleX(stats.q1),
      medX: scaleX(stats.median),
      q3X: scaleX(stats.q3),
      maxX: scaleX(stats.max),
    };
  }, [stats]);

  return (
    <section className="panel prose">
      <h2>Thống kê mẫu số liệu & Biểu đồ Hộp (Box Plot)</h2>
      <p>Nhập danh sách các số thực, phân cách bằng dấu phẩy, khoảng trắng hoặc dòng mới:</p>

      <textarea
        className="chat-compose"
        rows={3}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '9px',
          background: 'var(--background)',
          border: '1px solid var(--border)',
          fontFamily: 'monospace',
          fontSize: '15px',
          color: 'var(--foreground)',
        }}
        value={rawInput}
        onChange={e => setRawInput(e.target.value)}
        placeholder="Ví dụ: 12, 15, 14, 18, 16, 20"
      />

      <div className="control-row" style={{margin: '8px 0 16px', gap: 8}}>
        <span className="small muted">Mẫu nhanh:</span>
        <button
          className="secondary-btn small-btn"
          onClick={() => setRawInput('7, 8, 9, 6.5, 8, 7.5, 9.5, 8.5, 10, 8')}
        >
          Điểm thi (10 mẫu)
        </button>
        <button
          className="secondary-btn small-btn"
          onClick={() => setRawInput('165, 170, 168, 175, 172, 160, 180, 171, 169, 173, 166, 178')}
        >
          Chiều cao cm (12 mẫu)
        </button>
        <button
          className="secondary-btn small-btn"
          onClick={() => setRawInput('12, 15, 14, 10, 18, 16, 14, 22, 19, 25')}
        >
          Doanh số (10 mẫu)
        </button>
      </div>

      {stats ? (
        <>
          {/* Box Plot Visualization */}
          {boxPlot && (
            <div style={{background: 'var(--background)', padding: '16px 20px', borderRadius: '12px', margin: '18px 0'}}>
              <h3 style={{marginTop: 0, marginBottom: 8}}>Biểu đồ Hộp & Râu (Box Plot)</h3>
              <svg viewBox="0 0 480 90" style={{width: '100%'}}>
                {/* Whisker line from Min to Max */}
                <line x1={boxPlot.minX} y1="40" x2={boxPlot.maxX} y2="40" stroke="currentColor" strokeWidth="2" opacity="0.6" />

                {/* Min whisker tick */}
                <line x1={boxPlot.minX} y1="28" x2={boxPlot.minX} y2="52" stroke="#e29b36" strokeWidth="3" />
                <text x={boxPlot.minX} y="70" fontSize="10" fill="#e29b36" textAnchor="middle">Min={stats.min}</text>

                {/* Max whisker tick */}
                <line x1={boxPlot.maxX} y1="28" x2={boxPlot.maxX} y2="52" stroke="#e29b36" strokeWidth="3" />
                <text x={boxPlot.maxX} y="70" fontSize="10" fill="#e29b36" textAnchor="middle">Max={stats.max}</text>

                {/* Box (Q1 to Q3) */}
                <rect
                  x={boxPlot.q1X}
                  y="20"
                  width={Math.max(2, boxPlot.q3X - boxPlot.q1X)}
                  height="40"
                  fill="#555ce5"
                  fillOpacity="0.3"
                  stroke="#555ce5"
                  strokeWidth="2"
                  rx="3"
                />

                {/* Median line */}
                <line x1={boxPlot.medX} y1="18" x2={boxPlot.medX} y2="62" stroke="#31a58d" strokeWidth="3.5" />
                <text x={boxPlot.medX} y="14" fontSize="11" fill="#31a58d" textAnchor="middle" fontWeight="bold">
                  Me={stats.median}
                </text>

                {/* Q1 and Q3 labels */}
                <text x={boxPlot.q1X} y="70" fontSize="10" fill="#555ce5" textAnchor="middle">Q₁={stats.q1}</text>
                <text x={boxPlot.q3X} y="70" fontSize="10" fill="#555ce5" textAnchor="middle">Q₃={stats.q3}</text>
              </svg>
            </div>
          )}

          <div className="two-columns">
            <div>
              <h3>Đặc trưng vị trí</h3>
              <div className="metric">
                <span>Cỡ mẫu (Số phần tử n)</span>
                <strong>{stats.n}</strong>
              </div>
              <div className="metric">
                <span>Tổng các giá trị ∑ xᵢ</span>
                <strong>{fmt(stats.sum)}</strong>
              </div>
              <div className="metric highlight-metric">
                <span>Số trung bình x̄ = ∑x/n</span>
                <strong style={{color: '#555ce5', fontSize: '18px'}}>{fmt(stats.mean)}</strong>
              </div>
              <div className="metric">
                <span>Trung vị (Median Me)</span>
                <strong style={{color: '#31a58d'}}>{fmt(stats.median)}</strong>
              </div>
              <div className="metric">
                <span>Tứ phân vị Q₁, Q₃</span>
                <strong>Q₁ = {fmt(stats.q1)}; Q₃ = {fmt(stats.q3)}</strong>
              </div>
              <div className="metric">
                <span>Yếu vị (Mode Mo)</span>
                <strong>{stats.mode.length > 0 ? stats.mode.join(', ') : 'Không có (các số có tần số bằng nhau)'}</strong>
              </div>
            </div>

            <div>
              <h3>Đặc trưng độ phân tán</h3>
              <div className="metric">
                <span>Phương sai mẫu hiệu chỉnh s²</span>
                <strong>{fmt(stats.varianceSample)}</strong>
              </div>
              <div className="metric highlight-metric">
                <span>Độ lệch chuẩn mẫu s = √s²</span>
                <strong style={{color: '#8b56d4', fontSize: '18px'}}>{fmt(stats.stdSample)}</strong>
              </div>
              <div className="metric">
                <span>Khoảng tứ phân vị IQR = Q₃ − Q₁</span>
                <strong>{fmt(stats.iqr)}</strong>
              </div>
              <div className="metric">
                <span>Khoảng biến thiên R = Max − Min</span>
                <strong>{fmt(stats.range)} [{stats.min} → {stats.max}]</strong>
              </div>
              <div className="metric">
                <span>Phương sai tổng thể σ²</span>
                <strong>{fmt(stats.variancePop)}</strong>
              </div>
              <div className="metric">
                <span>Độ lệch chuẩn tổng thể σ</span>
                <strong>{fmt(stats.stdPop)}</strong>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="warning-box">Hãy nhập ít nhất một số thực để thực hiện phân tích thống kê.</p>
      )}
    </section>
  );
}

function factorial(n: number): number {
  if (n < 0) return 0;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function CombinatoricsCalculator() {
  const [n, setN] = useState(6);
  const [k, setK] = useState(3);

  const safeN = Math.max(0, Math.min(30, Math.floor(n)));
  const safeK = Math.max(0, Math.min(safeN, Math.floor(k)));

  const pN = factorial(safeN);
  const aNK = safeN <= 20 ? factorial(safeN) / factorial(safeN - safeK) : 0;
  const cNK = safeN <= 30 ? factorial(safeN) / (factorial(safeK) * factorial(safeN - safeK)) : 0;

  // Pascal row for n
  const pascalRow = useMemo(() => {
    const row: number[] = [];
    for (let i = 0; i <= Math.min(10, safeN); i++) {
      row.push(factorial(safeN) / (factorial(i) * factorial(safeN - i)));
    }
    return row;
  }, [safeN]);

  return (
    <section className="panel prose">
      <h2>Hoán vị, Chỉnh hợp & Tổ hợp</h2>
      <p>Chọn cỡ tập hợp n và số phần tử cần chọn k (0 ≤ k ≤ n):</p>

      <div className="control-row">
        <NumberField label="Tổng số phần tử n" value={safeN} onChange={setN} min={0} max={30} step={1} />
        <NumberField label="Số phần tử chọn k" value={safeK} onChange={setK} min={0} max={safeN} step={1} />
      </div>

      <div className="two-columns">
        <div>
          <h3>Kết quả tính toán</h3>
          <div className="metric">
            <span>Giai thừa n!</span>
            <strong>{fmt(pN)}</strong>
          </div>
          <div className="metric">
            <span>Hoán vị Pₙ = n!</span>
            <strong>{fmt(pN)} cách xếp thứ tự</strong>
          </div>
          <div className="metric highlight-metric">
            <span>Chỉnh hợp Aₙᵏ = n! / (n − k)!</span>
            <strong style={{color: '#555ce5', fontSize: '18px'}}>{fmt(aNK)} cách</strong>
          </div>
          <div className="metric highlight-metric">
            <span>Tổ hợp Cₙᵏ = n! / [k!(n − k)!]</span>
            <strong style={{color: '#31a58d', fontSize: '18px'}}>{fmt(cNK)} cách</strong>
          </div>
        </div>

        <div>
          <h3>Các bước biến đổi chi tiết</h3>
          <MathFormula
            latex={String.raw`C_{${safeN}}^{${safeK}} = \frac{${safeN}!}{${safeK}!\times (${safeN}-${safeK})!} = \frac{${safeN}!}{${safeK}!\times ${safeN - safeK}!} = ${fmt(cNK)}`}
          />
          <MathFormula
            latex={String.raw`A_{${safeN}}^{${safeK}} = \frac{${safeN}!}{(${safeN}-${safeK})!} = \frac{${safeN}!}{${safeN - safeK}!} = ${fmt(aNK)}`}
          />
          {safeN <= 10 && (
            <div style={{marginTop: 12}}>
              <span className="small muted">Hàng n = {safeN} trên Tam giác Pascal:</span>
              <div style={{display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6}}>
                {pascalRow.map((val, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: idx === safeK ? 'var(--primary)' : 'var(--accent)',
                      color: idx === safeK ? '#fff' : 'var(--primary)',
                      fontWeight: 'bold',
                      fontSize: 13,
                    }}
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BinomialCalculator() {
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);
  const [k, setK] = useState(5);

  const safeN = Math.max(1, Math.min(100, Math.floor(n)));
  const safeP = Math.max(0, Math.min(1, p));
  const safeK = Math.max(0, Math.min(safeN, Math.floor(k)));

  // Binomial probability P(X = k) = C(n, k) * p^k * (1-p)^(n-k)
  const cNK = factorial(safeN) / (factorial(safeK) * factorial(safeN - safeK));
  const probK = cNK * safeP ** safeK * (1 - safeP) ** (safeN - safeK);

  const mean = safeN * safeP;
  const variance = safeN * safeP * (1 - safeP);
  const std = Math.sqrt(variance);

  return (
    <section className="panel prose">
      <h2>Phân phối Nhị thức B(n, p)</h2>
      <p>Mô hình hóa số lần thành công k trong n phép thử Bernoulli độc lập với xác suất thành công p:</p>

      <div className="control-row">
        <NumberField label="Số phép thử n" value={safeN} onChange={setN} min={1} max={50} step={1} />
        <NumberField label="Xác suất thành công p" value={safeP} onChange={setP} min={0} max={1} step={0.05} />
        <NumberField label="Số lần thành công k" value={safeK} onChange={setK} min={0} max={safeN} step={1} />
      </div>

      <div className="two-columns">
        <div>
          <h3>Xác suất điểm P(X = {safeK})</h3>
          <div className="metric highlight-metric">
            <span>P(X = {safeK})</span>
            <strong style={{color: '#555ce5', fontSize: '22px'}}>{(probK * 100).toFixed(4)}%</strong>
          </div>
          <div className="metric">
            <span>Giá trị thập phân</span>
            <strong>{fmt(probK)}</strong>
          </div>
          <div className="metric">
            <span>Tổ hợp C({safeN}, {safeK})</span>
            <strong>{fmt(cNK)}</strong>
          </div>
        </div>

        <div>
          <h3>Đặc trưng của phân phối B({safeN}, {safeP})</h3>
          <div className="metric">
            <span>Kỳ vọng E[X] = n·p</span>
            <strong>{fmt(mean)}</strong>
          </div>
          <div className="metric">
            <span>Phương sai Var(X) = n·p·(1−p)</span>
            <strong>{fmt(variance)}</strong>
          </div>
          <div className="metric">
            <span>Độ lệch chuẩn σ = √Var</span>
            <strong>{fmt(std)}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
