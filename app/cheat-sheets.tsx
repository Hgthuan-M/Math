'use client';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {MathFormula} from './math';
import {Table,Sparkles,Layers,BookOpen} from 'lucide-react';

export function CheatSheets() {
  return (
    <div className="cheat-sheets-container">
      <div className="page-heading">
        <p className="eyebrow">TRA CỨU NHANH TRONG 3 GIÂY</p>
        <h1>Bảng tra cứu công thức</h1>
        <p>Bảng đối chiếu giá trị lượng giác, bảng đạo hàm – nguyên hàm song song và bất đẳng thức kinh điển.</p>
      </div>

      <Tabs defaultValue="trig-table">
        <TabsList className="max-w-full overflow-x-auto justify-start">
          <TabsTrigger value="trig-table">Giá trị Lượng giác góc đặc biệt</TabsTrigger>
          <TabsTrigger value="calculus-table">Đạo hàm & Nguyên hàm đối chiếu</TabsTrigger>
          <TabsTrigger value="ineq-table">Bất đẳng thức & Hằng đẳng thức</TabsTrigger>
        </TabsList>

        <TabsContent value="trig-table">
          <TrigValuesTable />
        </TabsContent>

        <TabsContent value="calculus-table">
          <CalculusReferenceTable />
        </TabsContent>

        <TabsContent value="ineq-table">
          <InequalitiesReferenceTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TrigValuesTable() {
  const angles = [
    {deg: '0°', rad: '0', sin: '0', cos: '1', tan: '0', cot: '|| (kxd)'},
    {deg: '30°', rad: 'π/6', sin: '1/2', cos: '√3/2', tan: '√3/3', cot: '√3'},
    {deg: '45°', rad: 'π/4', sin: '√2/2', cos: '√2/2', tan: '1', cot: '1'},
    {deg: '60°', rad: 'π/3', sin: '√3/2', cos: '1/2', tan: '√3', cot: '√3/3'},
    {deg: '90°', rad: 'π/2', sin: '1', cos: '0', tan: '|| (kxd)', cot: '0'},
    {deg: '120°', rad: '2π/3', sin: '√3/2', cos: '−1/2', tan: '−√3', cot: '−√3/3'},
    {deg: '135°', rad: '3π/4', sin: '√2/2', cos: '−√2/2', tan: '−1', cot: '−1'},
    {deg: '150°', rad: '5π/6', sin: '1/2', cos: '−√3/2', tan: '−√3/3', cot: '−√3'},
    {deg: '180°', rad: 'π', sin: '0', cos: '−1', tan: '0', cot: '|| (kxd)'},
  ];

  return (
    <section className="panel prose">
      <h2>Bảng giá trị Lượng giác các góc đặc biệt</h2>
      <p className="small muted">Hệ thống các giá trị sin, cos, tan, cot thông dụng nhất trong giải toán:</p>

      <div style={{overflowX: 'auto', margin: '18px 0'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: 15}}>
          <thead>
            <tr style={{background: 'var(--muted)', borderBottom: '2px solid var(--border)'}}>
              <th style={{padding: '12px 10px'}}>Độ (°)</th>
              <th style={{padding: '12px 10px'}}>Radian (rad)</th>
              <th style={{padding: '12px 10px', color: '#555ce5'}}>sin α</th>
              <th style={{padding: '12px 10px', color: '#31a58d'}}>cos α</th>
              <th style={{padding: '12px 10px', color: '#e29b36'}}>tan α</th>
              <th style={{padding: '12px 10px', color: '#8870e8'}}>cot α</th>
            </tr>
          </thead>
          <tbody>
            {angles.map((row, i) => (
              <tr key={i} style={{borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card)' : 'var(--background)'}}>
                <td style={{padding: '10px', fontWeight: 'bold'}}>{row.deg}</td>
                <td style={{padding: '10px', color: 'var(--muted-foreground)'}}>{row.rad}</td>
                <td style={{padding: '10px', fontWeight: 600, color: '#555ce5'}}>{row.sin}</td>
                <td style={{padding: '10px', fontWeight: 600, color: '#31a58d'}}>{row.cos}</td>
                <td style={{padding: '10px', fontWeight: 600, color: '#e29b36'}}>{row.tan}</td>
                <td style={{padding: '10px', fontWeight: 600, color: '#8870e8'}}>{row.cot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="warning-box" style={{marginTop: 18}}>
        <h3>Quy tắc góc liên kết (Thơ nhớ dấu)</h3>
        <p>
          <strong>"Cos đối, Sin bù, Phụ chéo, Hơn kém pi tang"</strong>:
          <br />
          • Hai góc đối nhau (α và −α): cos(−α) = cos α, các hàm còn lại đổi dấu.
          <br />
          • Hai góc bù nhau (α và π − α): sin(π − α) = sin α, các hàm còn lại đổi dấu.
          <br />
          • Hai góc phụ nhau (α và π/2 − α): chéo nhau (sin đổi cos, tan đổi cot).
        </p>
      </div>
    </section>
  );
}

function CalculusReferenceTable() {
  const pairs = [
    {func: 'c (hằng số)', deriv: '0', integ: 'cx + C'},
    {func: 'x^n (n \\neq -1)', deriv: 'n x^{n-1}', integ: '\\frac{x^{n+1}}{n+1} + C'},
    {func: '\\frac{1}{x} (x > 0)', deriv: '-\\frac{1}{x^2}', integ: '\\ln x + C'},
    {func: '\\sqrt{x}', deriv: '\\frac{1}{2\\sqrt{x}}', integ: '\\frac{2}{3}x\\sqrt{x} + C'},
    {func: 'e^x', deriv: 'e^x', integ: 'e^x + C'},
    {func: 'a^x (a > 0, a \\neq 1)', deriv: 'a^x \\ln a', integ: '\\frac{a^x}{\\ln a} + C'},
    {func: '\\ln x', deriv: '\\frac{1}{x}', integ: 'x\\ln x - x + C'},
    {func: '\\sin x', deriv: '\\cos x', integ: '-\\cos x + C'},
    {func: '\\cos x', deriv: '-\\sin x', integ: '\\sin x + C'},
    {func: '\\tan x', deriv: '\\frac{1}{\\cos^2 x} = 1 + \\tan^2 x', integ: '-\\ln|\\cos x| + C'},
    {func: '\\frac{1}{1 + x^2}', deriv: '-\\frac{2x}{(1+x^2)^2}', integ: '\\arctan x + C'},
  ];

  return (
    <section className="panel prose">
      <h2>Bảng tra cứu Đạo hàm & Nguyên hàm đối chiếu song song</h2>
      <p className="small muted">Giúp nhận biết nhanh mối quan hệ hai chiều giữa phép lấy đạo hàm và phép lấy nguyên hàm:</p>

      <div style={{overflowX: 'auto', margin: '18px 0'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: 15}}>
          <thead>
            <tr style={{background: 'var(--muted)', borderBottom: '2px solid var(--border)'}}>
              <th style={{padding: '12px 10px'}}>Hàm số f(x)</th>
              <th style={{padding: '12px 10px', color: '#e29b36'}}>Đạo hàm f′(x)</th>
              <th style={{padding: '12px 10px', color: '#31a58d'}}>Nguyên hàm ∫ f(x) dx</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((row, i) => (
              <tr key={i} style={{borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card)' : 'var(--background)'}}>
                <td style={{padding: '12px 10px'}}>
                  <MathFormula latex={row.func} />
                </td>
                <td style={{padding: '12px 10px'}}>
                  <MathFormula latex={row.deriv} />
                </td>
                <td style={{padding: '12px 10px'}}>
                  <MathFormula latex={row.integ} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InequalitiesReferenceTable() {
  return (
    <section className="panel prose">
      <h2>Các Bất đẳng thức & Hằng đẳng thức kinh điển</h2>

      <div className="two-columns">
        <div>
          <h3>7 Hằng đẳng thức đáng nhớ</h3>
          <ol className="steps">
            <li>(a + b)² = a² + 2ab + b²</li>
            <li>(a − b)² = a² − 2ab + b²</li>
            <li>a² − b² = (a − b)(a + b)</li>
            <li>(a + b)³ = a³ + 3a²b + 3ab² + b³</li>
            <li>(a − b)³ = a³ − 3a²b + 3ab² − b³</li>
            <li>a³ + b³ = (a + b)(a² − ab + b²)</li>
            <li>a³ − b³ = (a − b)(a² + ab + b²)</li>
          </ol>
        </div>

        <div>
          <h3>Bất đẳng thức cốt lõi</h3>
          <div className="metric">
            <span>AM–GM 2 số</span>
            <strong>a + b ≥ 2√ab (a,b ≥ 0)</strong>
          </div>
          <div className="metric">
            <span>AM–GM 3 số</span>
            <strong>a + b + c ≥ 3 ∛(abc)</strong>
          </div>
          <div className="metric">
            <span>Cauchy–Schwarz</span>
            <strong>(ax + by)² ≤ (a² + b²)(x² + y²)</strong>
          </div>
          <div className="metric">
            <span>Bất đẳng thức tam giác</span>
            <strong>|a + b| ≤ |a| + |b|</strong>
          </div>
          <div className="metric">
            <span>Bất đẳng thức Nesbitt</span>
            <strong>a/(b+c) + b/(c+a) + c/(a+b) ≥ 3/2</strong>
          </div>
          <div className="metric">
            <span>Bất đẳng thức Bernoulli</span>
            <strong>(1 + x)ⁿ ≥ 1 + nx (x ≥ −1, n ∈ ℕ*)</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
