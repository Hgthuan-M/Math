'use client';
import {useState} from 'react';
import {MathFormula, MathText} from './math';
import {fmt} from './labs';
import {FileSpreadsheet, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle, RefreshCw} from 'lucide-react';

function toBmatrix(mat: number[][]): string {
  const rows = mat.map(row => row.map(v => fmt(v)).join(' & ')).join(' \\\\ ');
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

export function EconomicMathKT105() {
  const [activeQuestion, setActiveQuestion] = useState<'q1' | 'q2' | 'q3'>('q1');

  // =========================================================================
  // CÂU 1 STATE: Ma trận 3x4
  // =========================================================================
  const defaultA1: number[][] = [
    [4, 1, 1, 5],
    [-3, 0, 2, 7],
    [5, 5, 3, 11]
  ];
  const defaultB1: number[][] = [
    [-2, 1, 3, 4],
    [5, 2, 5, 7],
    [-5, 9, 4, 1]
  ];

  const [matA1, setMatA1] = useState<number[][]>(defaultA1);
  const [matB1, setMatB1] = useState<number[][]>(defaultB1);
  const [subQ1, setSubQ1] = useState<'a' | 'b' | 'c'>('a');

  function updateA1(r: number, c: number, val: number) {
    setMatA1(prev => prev.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? val : v))));
  }
  function updateB1(r: number, c: number, val: number) {
    setMatB1(prev => prev.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? val : v))));
  }
  function resetQ1() {
    setMatA1(defaultA1);
    setMatB1(defaultB1);
  }

  // Câu 1 calculations:
  // a) A + X = B => X = B - A
  const X_a = matB1.map((row, i) => row.map((b, j) => b - matA1[i][j]));
  // b) 2A - 3B = X
  const mat2A = matA1.map(row => row.map(v => 2 * v));
  const mat3B = matB1.map(row => row.map(v => 3 * v));
  const X_b = matA1.map((row, i) => row.map((a, j) => 2 * a - 3 * matB1[i][j]));
  // c) Transpose and addition
  const matAT = [0, 1, 2, 3].map(j => [0, 1, 2].map(i => matA1[i][j]));
  const matBT = [0, 1, 2, 3].map(j => [0, 1, 2].map(i => matB1[i][j]));
  const matAT_plus_BT = matAT.map((row, i) => row.map((at, j) => at + matBT[i][j]));
  const matA_plus_B = matA1.map((row, i) => row.map((a, j) => a + matB1[i][j]));
  const matApB_T = [0, 1, 2, 3].map(j => [0, 1, 2].map(i => matA_plus_B[i][j]));

  // =========================================================================
  // CÂU 2 STATE: Phép nhân 5 ma trận A, B, C, D, E
  // =========================================================================
  const matricesQ2: Record<string, {name: string; rows: number; cols: number; data: number[][]}> = {
    A: {
      name: 'A',
      rows: 2,
      cols: 3,
      data: [[1, 2, -1], [3, 0, 1]]
    },
    B: {
      name: 'B',
      rows: 3,
      cols: 4,
      data: [[-1, 1, 3, 2], [2, 1, -3, -1], [1, 0, 2, -2]]
    },
    C: {
      name: 'C',
      rows: 4,
      cols: 2,
      data: [[1, 2], [3, -1], [2, 4], [4, 1]]
    },
    D: {
      name: 'D',
      rows: 3,
      cols: 3,
      data: [[4, -1, 3], [2, 3, 1], [1, 0, -3]]
    },
    E: {
      name: 'E',
      rows: 3,
      cols: 3,
      data: [[1, 3, 2], [4, 2, -1], [1, 0, -3]]
    }
  };

  const [pairLeft, setPairLeft] = useState<string>('A');
  const [pairRight, setPairRight] = useState<string>('B');
  const [subQ2, setSubQ2] = useState<'a' | 'b'>('a');

  const mLeft = matricesQ2[pairLeft];
  const mRight = matricesQ2[pairRight];
  const canMultiplyPair = mLeft.cols === mRight.rows;

  let mulPairResult: number[][] | null = null;
  if (canMultiplyPair) {
    mulPairResult = [];
    for (let i = 0; i < mLeft.rows; i++) {
      mulPairResult[i] = [];
      for (let j = 0; j < mRight.cols; j++) {
        let sum = 0;
        for (let k = 0; k < mLeft.cols; k++) {
          sum += mLeft.data[i][k] * mRight.data[k][j];
        }
        mulPairResult[i][j] = sum;
      }
    }
  }

  // Chuỗi tính mẫu A * B * C
  const mulAB = mulMatrices(matricesQ2.A.data, matricesQ2.B.data)!;
  const mulABC = mulMatrices(mulAB, matricesQ2.C.data)!;

  function mulMatrices(M1: number[][], M2: number[][]): number[][] | null {
    if (M1[0].length !== M2.length) return null;
    const res: number[][] = [];
    for (let i = 0; i < M1.length; i++) {
      res[i] = [];
      for (let j = 0; j < M2[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < M1[0].length; k++) {
          sum += M1[i][k] * M2[k][j];
        }
        res[i][j] = sum;
      }
    }
    return res;
  }

  // =========================================================================
  // CÂU 3 STATE: Bài toán kinh tế 3 cửa hàng x 6 sản phẩm
  // =========================================================================
  const products = ['A', 'B', 'C', 'D', 'E', 'F'];
  const stores = ['Cửa hàng 1', 'Cửa hàng 2', 'Cửa hàng 3'];

  const defaultS = [
    [50, 40, 100, 150, 8, 100],
    [70, 40, 80, 70, 12, 80],
    [80, 50, 70, 100, 14, 100]
  ];
  const defaultT = [
    [20, 10, 25, 40, 8, 38],
    [10, 12, 30, 32, 12, 32],
    [15, 20, 18, 38, 14, 40]
  ];

  const [matS, setMatS] = useState<number[][]>(defaultS);
  const [matT, setMatT] = useState<number[][]>(defaultT);

  function updateS(r: number, c: number, val: number) {
    setMatS(prev => prev.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? val : v))));
  }
  function updateT(r: number, c: number, val: number) {
    setMatT(prev => prev.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? val : v))));
  }
  function resetQ3() {
    setMatS(defaultS);
    setMatT(defaultT);
  }

  // R = S - T
  const matR = matS.map((row, i) => row.map((s, j) => s - matT[i][j]));

  // Economic sums:
  // Total consumed per product (sum over stores for each product j)
  const totalConsumedPerProduct = products.map((_, j) => matT.reduce((acc, row) => acc + row[j], 0));
  // Total remaining inventory per store (sum over products for each store i)
  const totalRemainPerStore = stores.map((_, i) => matR[i].reduce((acc, val) => acc + val, 0));
  const totalSystemRemain = totalRemainPerStore.reduce((acc, v) => acc + v, 0);

  return (
    <div className="economic-math-module" style={{marginTop: 10}}>
      {/* HEADER BANNER */}
      <div className="status-banner" style={{background: 'linear-gradient(135deg, rgba(85,92,229,0.12), rgba(139,86,212,0.12))', border: '1.5px solid var(--primary)', borderRadius: 14, padding: '16px 20px', marginBottom: 20}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <FileSpreadsheet size={28} style={{color: 'var(--primary)', flexShrink: 0}} />
          <div>
            <h3 style={{margin: 0, fontSize: 18, color: 'var(--foreground)'}}>
              <strong>BT KT105 TOÁN KINH TẾ 1</strong>
            </h3>
            <p className="small" style={{margin: '4px 0 0', color: 'var(--muted-foreground)'}}>
              Học phần Toán cho các nhà kinh tế: Phép toán ma trận cấp 3×4, tích chuỗi ma trận và mô hình tồn kho – tiêu thụ thực tế.
            </p>
          </div>
        </div>
      </div>

      {/* QUESTION NAV TABS */}
      <div className="control-row" style={{marginBottom: 22, gap: 10}}>
        <button
          className={`pill-toggle ${activeQuestion === 'q1' ? 'active f font-bold' : ''}`}
          onClick={() => setActiveQuestion('q1')}
          style={{padding: '8px 18px', fontSize: 14}}
        >
          📝 Câu 1: Phép toán ma trận cấp 3 × 4
        </button>
        <button
          className={`pill-toggle ${activeQuestion === 'q2' ? 'active F font-bold' : ''}`}
          onClick={() => setActiveQuestion('q2')}
          style={{padding: '8px 18px', fontSize: 14}}
        >
          ✖️ Câu 2: Tích & Chuỗi ma trận (A, B, C, D, E)
        </button>
        <button
          className={`pill-toggle ${activeQuestion === 'q3' ? 'active area font-bold' : ''}`}
          onClick={() => setActiveQuestion('q3')}
          style={{padding: '8px 18px', fontSize: 14}}
        >
          🏬 Câu 3: Mô hình Kinh tế Tồn kho – Tiêu thụ (3 × 6)
        </button>
      </div>

      {/* =========================================================================
          CÂU 1 RENDER
          ========================================================================= */}
      {activeQuestion === 'q1' && (
        <section className="panel prose" style={{marginBottom: 24}}>
          <div className="section-title">
            <div>
              <h3>Câu 1: Cho 2 ma trận A, B cấp 3 × 4</h3>
              <p className="small">Tìm ma trận X và kiểm chứng các tính chất của ma trận chuyển vị.</p>
            </div>
            <button className="secondary-btn small-btn" onClick={resetQ1} title="Khôi phục số liệu gốc đề bài">
              <RefreshCw size={14} /> Khôi phục đề bài
            </button>
          </div>

          {/* INPUT CARDS FOR A AND B */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, margin: '16px 0'}}>
            {/* CARD A */}
            <div className="matrix-card">
              <div className="matrix-card-header">
                <span className="tag">MA TRẬN A</span>
                <span className="matrix-dim-badge">3 hàng × 4 cột</span>
              </div>
              <div className="matrix-bracket-wrap">
                <div className="matrix-bracket size-rect">
                  {matA1.map((row, ri) => (
                    <div key={ri} className="matrix-row">
                      {row.map((val, ci) => (
                        <label key={ci} className="matrix-cell-label">
                          <span>a<sub>{ri + 1}{ci + 1}</sub></span>
                          <input
                            type="number"
                            value={val}
                            className="matrix-cell"
                            style={{width: 54, height: 38, fontSize: 15}}
                            onChange={e => updateA1(ri, ci, Number(e.target.value) || 0)}
                          />
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD B */}
            <div className="matrix-card">
              <div className="matrix-card-header">
                <span className="tag">MA TRẬN B</span>
                <span className="matrix-dim-badge">3 hàng × 4 cột</span>
              </div>
              <div className="matrix-bracket-wrap">
                <div className="matrix-bracket size-rect">
                  {matB1.map((row, ri) => (
                    <div key={ri} className="matrix-row">
                      {row.map((val, ci) => (
                        <label key={ci} className="matrix-cell-label">
                          <span>b<sub>{ri + 1}{ci + 1}</sub></span>
                          <input
                            type="number"
                            value={val}
                            className="matrix-cell"
                            style={{width: 54, height: 38, fontSize: 15}}
                            onChange={e => updateB1(ri, ci, Number(e.target.value) || 0)}
                          />
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SUBQUESTION TOGGLES */}
          <div className="control-row" style={{margin: '18px 0'}}>
            <button className={`pill-toggle ${subQ1 === 'a' ? 'active f' : ''}`} onClick={() => setSubQ1('a')}>
              a) Giải tìm X: A + X = B
            </button>
            <button className={`pill-toggle ${subQ1 === 'b' ? 'active d' : ''}`} onClick={() => setSubQ1('b')}>
              b) Giải tìm X: 2A - 3B = X
            </button>
            <button className={`pill-toggle ${subQ1 === 'c' ? 'active area' : ''}`} onClick={() => setSubQ1('c')}>
              c) Tính Aᵀ + Bᵀ và (A + B)ᵀ
            </button>
          </div>

          {/* PART a SOLUTION */}
          {subQ1 === 'a' && (
            <div className="example-solution-box">
              <div className="example-solution-title">
                <CheckCircle2 size={18} />
                <strong>Lời giải Câu 1a: Tìm ma trận X thỏa mãn A + X = B</strong>
              </div>
              <div className="example-solution-content">
                <div className="solution-step">
                  <MathText text="• **Bước 1**: Biến đổi phương trình đại số ma trận:" />
                  <MathFormula latex={`A + X = B \\iff X = B - A`} block={true} />
                  <span className="small muted">
                    Vì $A$ và $B$ đều là ma trận cấp $3 \\times 4$ nên hiệu $B - A$ hoàn toàn xác định và ma trận $X$ cũng có cấp $3 \\times 4$.
                  </span>
                </div>

                <div className="solution-step">
                  <MathText text="• **Bước 2**: Thực hiện phép trừ từng phần tử tương ứng: $x_{ij} = b_{ij} - a_{ij}$:" />
                  <MathFormula latex={`X = ${toBmatrix(matB1)} - ${toBmatrix(matA1)}`} block={true} />
                </div>

                <div className="solution-step">
                  <MathText text="• **Bước 3**: Kết quả ma trận $X$:" />
                  <MathFormula latex={`X = ${toBmatrix(X_a)}`} block={true} />
                </div>

                <div className="solution-step small">
                  <span className="small muted">
                    Kiểm tra: $x_{11} = -2 - 4 = -6$, $x_{12} = 1 - 1 = 0$, $x_{21} = 5 - (-3) = 8$, $x_{34} = 1 - 11 = -10$.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PART b SOLUTION */}
          {subQ1 === 'b' && (
            <div className="example-solution-box">
              <div className="example-solution-title">
                <CheckCircle2 size={18} />
                <strong>Lời giải Câu 1b: Tìm ma trận X = 2A - 3B</strong>
              </div>
              <div className="example-solution-content">
                <div className="solution-step">
                  <MathText text="• **Bước 1**: Nhân từng ma trận với hệ số vô hướng tương ứng:" />
                  <MathFormula latex={`2A = 2 \\cdot ${toBmatrix(matA1)} = ${toBmatrix(mat2A)}`} block={true} />
                  <MathFormula latex={`3B = 3 \\cdot ${toBmatrix(matB1)} = ${toBmatrix(mat3B)}`} block={true} />
                </div>

                <div className="solution-step">
                  <MathText text="• **Bước 2**: Lấy hiệu $2A - 3B$ theo từng vị trí tương ứng $x_{ij} = 2a_{ij} - 3b_{ij}$:" />
                  <MathFormula latex={`X = 2A - 3B = ${toBmatrix(mat2A)} - ${toBmatrix(mat3B)}`} block={true} />
                </div>

                <div className="solution-step">
                  <MathText text="• **Bước 3**: Kết quả ma trận $X$:" />
                  <MathFormula latex={`X = ${toBmatrix(X_b)}`} block={true} />
                </div>
              </div>
            </div>
          )}

          {/* PART c SOLUTION */}
          {subQ1 === 'c' && (
            <div className="example-solution-box">
              <div className="example-solution-title">
                <CheckCircle2 size={18} />
                <strong>Lời giải Câu 1c: Tính Aᵀ + Bᵀ và (A + B)ᵀ</strong>
              </div>
              <div className="example-solution-content">
                <div className="solution-step">
                  <MathText text="• **Bước 1**: Tìm ma trận chuyển vị $A^T$ và $B^T$ (hoán đổi hàng và cột từ cấp $3 \\times 4$ sang cấp $4 \\times 3$):" />
                  <MathFormula latex={`A^T = \\left( ${toBmatrix(matA1)} \\right)^T = ${toBmatrix(matAT)}`} block={true} />
                  <MathFormula latex={`B^T = \\left( ${toBmatrix(matB1)} \\right)^T = ${toBmatrix(matBT)}`} block={true} />
                </div>

                <div className="solution-step">
                  <MathText text="• **Bước 2**: Tính tổng $A^T + B^T$ (cấp $4 \\times 3$):" />
                  <MathFormula latex={`A^T + B^T = ${toBmatrix(matAT)} + ${toBmatrix(matBT)} = ${toBmatrix(matAT_plus_BT)}`} block={true} />
                </div>

                <div className="solution-step">
                  <MathText text="• **Bước 3**: Tính $(A + B)^T$ bằng cách tính tổng $A + B$ trước rồi chuyển vị:" />
                  <MathFormula latex={`A + B = ${toBmatrix(matA1)} + ${toBmatrix(matB1)} = ${toBmatrix(matA_plus_B)}`} block={true} />
                  <MathFormula latex={`(A + B)^T = \\left( ${toBmatrix(matA_plus_B)} \\right)^T = ${toBmatrix(matApB_T)}`} block={true} />
                </div>

                <div className="solution-step">
                  <MathText text="• **Kết luận quan trọng**: So sánh hai kết quả ta thấy:" />
                  <MathFormula latex={`(A + B)^T = A^T + B^T`} block={true} />
                  <span className="small muted">
                    Điều này minh họa định lý cơ bản: Chuyển vị của một tổng ma trận bằng tổng các ma trận chuyển vị.
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          CÂU 2 RENDER
          ========================================================================= */}
      {activeQuestion === 'q2' && (
        <section className="panel prose" style={{marginBottom: 24}}>
          <div className="section-title">
            <div>
              <h3>Câu 2: Cho các ma trận A, B, C, D, E</h3>
              <p className="small">Khảo sát điều kiện nhân được và xác định cấp của tích chuỗi ma trận.</p>
            </div>
          </div>

          {/* LIST OF 5 MATRICES */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, margin: '14px 0'}}>
            {Object.values(matricesQ2).map(m => (
              <div key={m.name} className="matrix-card" style={{padding: '14px 16px'}}>
                <div className="matrix-card-header">
                  <span className="tag">MA TRẬN {m.name}</span>
                  <span className="matrix-dim-badge">{m.rows} × {m.cols}</span>
                </div>
                <div style={{overflowX: 'auto', textAlign: 'center'}}>
                  <MathFormula latex={`${m.name} = ${toBmatrix(m.data)}`} block={true} />
                </div>
              </div>
            ))}
          </div>

          {/* SUBQUESTION TOGGLES */}
          <div className="control-row" style={{margin: '18px 0'}}>
            <button className={`pill-toggle ${subQ2 === 'a' ? 'active f' : ''}`} onClick={() => setSubQ2('a')}>
              a) Tìm 1 cặp ma trận nhân được & thực hiện phép nhân
            </button>
            <button className={`pill-toggle ${subQ2 === 'b' ? 'active F' : ''}`} onClick={() => setSubQ2('b')}>
              b) Tìm chuỗi 3, 4, 5 ma trận & xác định cấp kết quả
            </button>
          </div>

          {/* SUBQUESTION 2a: INTERACTIVE MULTIPLICATION SELECTOR */}
          {subQ2 === 'a' && (
            <div className="example-solution-box">
              <div className="example-solution-title">
                <CheckCircle2 size={18} />
                <strong>Câu 2a: Chọn 2 ma trận để thực hiện phép nhân</strong>
              </div>
              <div className="example-solution-content">
                <div className="solution-step">
                  <MathText text="• **Điều kiện nhân được**: Tích $M_1 \\cdot M_2$ xác định khi và chỉ khi **Số cột của ma trận trước ($M_1$) bằng Số hàng của ma trận sau ($M_2$)**." />
                </div>

                <div className="control-row" style={{alignItems: 'center', gap: 12, margin: '10px 0'}}>
                  <span>Chọn ma trận trước:</span>
                  <div style={{display: 'flex', gap: 6}}>
                    {['A', 'B', 'C', 'D', 'E'].map(k => (
                      <button
                        key={'left_' + k}
                        className={`secondary-btn small-btn ${pairLeft === k ? 'active font-bold' : ''}`}
                        onClick={() => setPairLeft(k)}
                      >
                        {k} ({matricesQ2[k].rows}×{matricesQ2[k].cols})
                      </button>
                    ))}
                  </div>

                  <span style={{fontWeight: 'bold', margin: '0 4px'}}>×</span>

                  <span>Chọn ma trận sau:</span>
                  <div style={{display: 'flex', gap: 6}}>
                    {['A', 'B', 'C', 'D', 'E'].map(k => (
                      <button
                        key={'right_' + k}
                        className={`secondary-btn small-btn ${pairRight === k ? 'active font-bold' : ''}`}
                        onClick={() => setPairRight(k)}
                      >
                        {k} ({matricesQ2[k].rows}×{matricesQ2[k].cols})
                      </button>
                    ))}
                  </div>
                </div>

                {canMultiplyPair ? (
                  <>
                    <div className="solution-step" style={{color: '#29a393', fontWeight: 600}}>
                      ✓ Nhân được! Cấp của {pairLeft} là {mLeft.rows} × {mLeft.cols}, cấp của {pairRight} là {mRight.rows} × {mRight.cols}.
                      <br />
                      Ma trận tích ${pairLeft} \\cdot {pairRight}$ có cấp **{mLeft.rows} × {mRight.cols}**.
                    </div>
                    <MathFormula
                      latex={`${pairLeft} \\cdot ${pairRight} = ${toBmatrix(mLeft.data)} \\cdot ${toBmatrix(mRight.data)} = ${toBmatrix(mulPairResult!)}`}
                      block={true}
                    />
                  </>
                ) : (
                  <div className="warning-box" style={{margin: '12px 0'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--destructive)', fontWeight: 600}}>
                      <AlertTriangle size={18} />
                      <span>Không nhân được!</span>
                    </div>
                    <p style={{margin: '6px 0 0', fontSize: 14}}>
                      Ma trận {pairLeft} có <strong>{mLeft.cols} cột</strong>, trong khi ma trận {pairRight} có <strong>{mRight.rows} hàng</strong>.
                      Vì {mLeft.cols} ≠ {mRight.rows} nên phép nhân ${pairLeft} \\cdot {pairRight}$ không xác định!
                    </p>
                  </div>
                )}

                <div className="solution-step" style={{borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14}}>
                  <MathText text="• **Tổng hợp các cặp nhân được trong đề bài**:" />
                  <ul style={{paddingLeft: 20, margin: '8px 0', fontSize: 14.5}}>
                    <li><MathText text="$A_{2\times 3} \cdot B_{3\times 4} \implies$ cấp 2 × 4" /></li>
                    <li><MathText text="$B_{3\times 4} \cdot C_{4\times 2} \implies$ cấp 3 × 2" /></li>
                    <li><MathText text="$C_{4\times 2} \cdot A_{2\times 3} \implies$ cấp 4 × 3" /></li>
                    <li><MathText text="$D_{3\times 3} \cdot B_{3\times 4} \implies$ cấp 3 × 4" /></li>
                    <li><MathText text="$E_{3\times 3} \cdot B_{3\times 4} \implies$ cấp 3 × 4" /></li>
                    <li><MathText text="$D_{3\times 3} \cdot E_{3\times 3}$ và $E_{3\times 3} \cdot D_{3\times 3} \implies$ cấp 3 × 3" /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SUBQUESTION 2b: CHAINS OF 3, 4, 5 MATRICES */}
          {subQ2 === 'b' && (
            <div className="example-solution-box">
              <div className="example-solution-title">
                <CheckCircle2 size={18} />
                <strong>Câu 2b: Chuỗi 3, 4, 5 ma trận có thể nhân được và cấp ma trận kết quả</strong>
              </div>
              <div className="example-solution-content">
                {/* CHUỖI 3 */}
                <div className="solution-step">
                  <h4 style={{margin: '8px 0 6px', color: 'var(--primary)'}}>1. Chuỗi 3 ma trận có thể nhân được:</h4>
                  <ul style={{paddingLeft: 20, margin: '6px 0', fontSize: 14.5}}>
                    <li>
                      <strong>$A \\cdot B \\cdot C$</strong>: Cấp là $(2\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\implies$ <strong>cấp 2 × 2</strong>.
                    </li>
                    <li>
                      <strong>$B \\cdot C \\cdot A$</strong>: Cấp là $(3\\times 4) \\cdot (4\\times 2) \\cdot (2\\times 3) \\implies$ <strong>cấp 3 × 3</strong>.
                    </li>
                    <li>
                      <strong>$C \\cdot A \\cdot B$</strong>: Cấp là $(4\\times 2) \\cdot (2\\times 3) \\cdot (3\\times 4) \\implies$ <strong>cấp 4 × 4</strong>.
                    </li>
                    <li>
                      <strong>$D \\cdot B \\cdot C$</strong> hoặc <strong>$E \\cdot B \\cdot C$</strong>: Cấp là $(3\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\implies$ <strong>cấp 3 × 2</strong>.
                    </li>
                  </ul>
                  <div className="code-box" style={{padding: '12px 14px', background: 'var(--background)', borderRadius: 8, marginTop: 8}}>
                    <MathText text="• **Tính mẫu tích chuỗi 3 ma trận $A \\cdot B \\cdot C$**:" />
                    <MathFormula
                      latex={`A \\cdot B \\cdot C = ${toBmatrix(matricesQ2.A.data)} \\cdot ${toBmatrix(matricesQ2.B.data)} \\cdot ${toBmatrix(matricesQ2.C.data)} = ${toBmatrix(mulABC)}`}
                      block={true}
                    />
                  </div>
                </div>

                {/* CHUỖI 4 */}
                <div className="solution-step">
                  <h4 style={{margin: '12px 0 6px', color: 'var(--primary)'}}>2. Chuỗi 4 ma trận có thể nhân được:</h4>
                  <ul style={{paddingLeft: 20, margin: '6px 0', fontSize: 14.5}}>
                    <li>
                      <strong>$A \\cdot B \\cdot C \\cdot A$</strong>: Cấp là $(2\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\cdot (2\\times 3) \\implies$ <strong>cấp 2 × 3</strong>.
                    </li>
                    <li>
                      <strong>$B \\cdot C \\cdot A \\cdot B$</strong>: Cấp là $(3\\times 4) \\cdot (4\\times 2) \\cdot (2\\times 3) \\cdot (3\\times 4) \\implies$ <strong>cấp 3 × 4</strong>.
                    </li>
                    <li>
                      <strong>$C \\cdot A \\cdot B \\cdot C$</strong>: Cấp là $(4\\times 2) \\cdot (2\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\implies$ <strong>cấp 4 × 2</strong>.
                    </li>
                    <li>
                      <strong>$D \\cdot E \\cdot B \\cdot C$</strong>: Cấp là $(3\\times 3) \\cdot (3\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\implies$ <strong>cấp 3 × 2</strong>.
                    </li>
                  </ul>
                </div>

                {/* CHUỖI 5 */}
                <div className="solution-step">
                  <h4 style={{margin: '12px 0 6px', color: 'var(--primary)'}}>3. Chuỗi 5 ma trận có thể nhân được:</h4>
                  <ul style={{paddingLeft: 20, margin: '6px 0', fontSize: 14.5}}>
                    <li>
                      <strong>$A \\cdot B \\cdot C \\cdot A \\cdot B$</strong>: Cấp là $(2\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\cdot (2\\times 3) \\cdot (3\\times 4) \\implies$ <strong>cấp 2 × 4</strong>.
                    </li>
                    <li>
                      <strong>$B \\cdot C \\cdot A \\cdot B \\cdot C$</strong>: Cấp là $(3\\times 4) \\cdot (4\\times 2) \\cdot (2\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\implies$ <strong>cấp 3 × 2</strong>.
                    </li>
                    <li>
                      <strong>$C \\cdot A \\cdot B \\cdot C \\cdot A$</strong>: Cấp là $(4\\times 2) \\cdot (2\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\cdot (2\\times 3) \\implies$ <strong>cấp 4 × 3</strong>.
                    </li>
                    <li>
                      <strong>$D \\cdot E \\cdot B \\cdot C \\cdot A$</strong>: Cấp là $(3\\times 3) \\cdot (3\\times 3) \\cdot (3\\times 4) \\cdot (4\\times 2) \\cdot (2\\times 3) \\implies$ <strong>cấp 3 × 3</strong>.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          CÂU 3 RENDER: BÀI TOÁN KINH TẾ
          ========================================================================= */}
      {activeQuestion === 'q3' && (
        <section className="panel prose" style={{marginBottom: 24}}>
          <div className="section-title">
            <div>
              <h3>Câu 3: Báo cáo kinh doanh của 3 cửa hàng đối với 6 sản phẩm</h3>
              <p className="small">Mô hình ma trận phân tích tồn kho cuối kỳ và lượng hàng tiêu thụ.</p>
            </div>
            <button className="secondary-btn small-btn" onClick={resetQ3} title="Khôi phục số liệu gốc đề bài">
              <RefreshCw size={14} /> Khôi phục số liệu gốc
            </button>
          </div>

          {/* TABLE S: TỒN KHO BAN ĐẦU */}
          <div style={{marginBottom: 20}}>
            <h4 style={{display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 10px'}}>
              <span className="tag">MA TRẬN S</span>
              <strong>1. Báo cáo hàng tồn kho đến 31/12/2009 (Cấp 3 × 6)</strong>
            </h4>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: 14.5}}>
                <thead>
                  <tr style={{background: 'var(--accent)', borderBottom: '2px solid var(--border)'}}>
                    <th style={{padding: '10px 14px', textAlign: 'left'}}>Cửa hàng \ Sản phẩm</th>
                    {products.map(p => (
                      <th key={p} style={{padding: '10px 14px'}}>SP {p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stores.map((sName, ri) => (
                    <tr key={sName} style={{borderBottom: '1px solid var(--border)'}}>
                      <td style={{padding: '8px 14px', textAlign: 'left', fontWeight: 600}}>{sName}</td>
                      {products.map((_, ci) => (
                        <td key={ci} style={{padding: '6px 8px'}}>
                          <input
                            type="number"
                            value={matS[ri][ci]}
                            className="matrix-cell"
                            style={{width: 58, height: 36, fontSize: 14}}
                            onChange={e => updateS(ri, ci, Number(e.target.value) || 0)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE T: LƯỢNG TIÊU THỤ */}
          <div style={{marginBottom: 20}}>
            <h4 style={{display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 10px'}}>
              <span className="tag">MA TRẬN T</span>
              <strong>2. Lượng tiêu thụ sản phẩm tháng 1/2010 (Cấp 3 × 6)</strong>
            </h4>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: 14.5}}>
                <thead>
                  <tr style={{background: 'var(--accent)', borderBottom: '2px solid var(--border)'}}>
                    <th style={{padding: '10px 14px', textAlign: 'left'}}>Cửa hàng \ Sản phẩm</th>
                    {products.map(p => (
                      <th key={p} style={{padding: '10px 14px'}}>SP {p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stores.map((sName, ri) => (
                    <tr key={sName} style={{borderBottom: '1px solid var(--border)'}}>
                      <td style={{padding: '8px 14px', textAlign: 'left', fontWeight: 600}}>{sName}</td>
                      {products.map((_, ci) => (
                        <td key={ci} style={{padding: '6px 8px'}}>
                          <input
                            type="number"
                            value={matT[ri][ci]}
                            className="matrix-cell"
                            style={{width: 58, height: 36, fontSize: 14}}
                            onChange={e => updateT(ri, ci, Number(e.target.value) || 0)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE R = S - T: TỒN KHO CÒN LẠI VÀ PHÂN TÍCH */}
          <div className="example-solution-box">
            <div className="example-solution-title">
              <CheckCircle2 size={18} />
              <strong>3. Kết quả lượng tồn kho còn lại: Ma trận R = S - T (Cấp 3 × 6)</strong>
            </div>
            <div className="example-solution-content">
              <div className="solution-step">
                <MathText text="• **Mô hình toán học**: Lượng tồn kho còn lại sau tháng 1/2010 bằng Tồn kho ban đầu trừ Lượng tiêu thụ: $R = S - T$." />
                <MathFormula latex={`R = S - T = ${toBmatrix(matS)} - ${toBmatrix(matT)} = ${toBmatrix(matR)}`} block={true} />
              </div>

              {/* TABLE RESULT R */}
              <div style={{overflowX: 'auto', margin: '14px 0'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: 14.5}}>
                  <thead>
                    <tr style={{background: 'var(--secondary)', borderBottom: '2px solid var(--border)'}}>
                      <th style={{padding: '10px 14px', textAlign: 'left'}}>Cửa hàng</th>
                      {products.map(p => (
                        <th key={p} style={{padding: '10px 14px'}}>SP {p}</th>
                      ))}
                      <th style={{padding: '10px 14px', background: 'rgba(99,107,231,0.15)', color: 'var(--primary)'}}>
                        Tổng tồn CH
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((sName, ri) => (
                      <tr key={sName} style={{borderBottom: '1px solid var(--border)'}}>
                        <td style={{padding: '10px 14px', textAlign: 'left', fontWeight: 600}}>{sName}</td>
                        {products.map((pName, ci) => {
                          const val = matR[ri][ci];
                          const isZero = val === 0;
                          return (
                            <td
                              key={ci}
                              style={{
                                padding: '10px 14px',
                                fontWeight: isZero ? 800 : 500,
                                color: isZero ? 'var(--destructive)' : 'var(--foreground)',
                                background: isZero ? 'rgba(235, 87, 87, 0.12)' : 'transparent'
                              }}
                            >
                              {val} {isZero && '⚠️ (Hết)'}
                            </td>
                          );
                        })}
                        <td style={{padding: '10px 14px', fontWeight: 700, color: 'var(--primary)'}}>
                          {totalRemainPerStore[ri]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{background: 'var(--accent)', fontWeight: 700}}>
                      <td style={{padding: '10px 14px', textAlign: 'left'}}>Tổng tiêu thụ tháng:</td>
                      {products.map((_, ci) => (
                        <td key={ci} style={{padding: '10px 14px'}}>
                          {totalConsumedPerProduct[ci]}
                        </td>
                      ))}
                      <td style={{padding: '10px 14px', color: 'var(--primary)', fontSize: 16}}>
                        {totalSystemRemain} (Tổng tồn)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* ECONOMIC ANALYSIS REPORT */}
              <div style={{background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 18, marginTop: 12}}>
                <h4 style={{margin: '0 0 10px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8}}>
                  📊 Báo cáo phân tích kinh tế & Đề xuất quản trị:
                </h4>
                <ol style={{paddingLeft: 22, margin: 0, fontSize: 14.5, lineHeight: 1.6}}>
                  <li style={{marginBottom: 8}}>
                    <strong>Cảnh báo khẩn cấp sản phẩm E</strong>: Cả 3 cửa hàng đều đã bán hết sạch 100% lượng hàng tồn kho ban đầu ($r_{15} = 0, r_{25} = 0, r_{35} = 0$).
                    <br />
                    👉 <em>Kiến nghị: Bộ phận cung ứng cần khẩn cấp nhập thêm sản phẩm E để tránh đứt gãy doanh thu.</em>
                  </li>
                  <li style={{marginBottom: 8}}>
                    <strong>Sản phẩm tiêu thụ chủ lực</strong>: Sản phẩm <strong>D</strong> và <strong>F</strong> có lượng tiêu thụ lớn nhất toàn hệ thống (mỗi sản phẩm tiêu thụ <strong>110 đơn vị</strong>).
                  </li>
                  <li style={{marginBottom: 8}}>
                    <strong>Đánh giá tồn kho từng cửa hàng</strong>:
                    <br />
                    • <strong>Cửa hàng 1</strong>: Còn tồn nhiều nhất với <strong>{totalRemainPerStore[0]} đơn vị</strong> (chiếm 38.4% tổng tồn). Cần đẩy mạnh bán hàng hoặc điều chuyển nội bộ sang các cửa hàng khác.
                    <br />
                    • <strong>Cửa hàng 2</strong>: Tồn kho thấp nhất (<strong>{totalRemainPerStore[1]} đơn vị</strong>), tốc độ quay vòng vốn nhanh.
                    <br />
                    • <strong>Cửa hàng 3</strong>: Còn tồn <strong>{totalRemainPerStore[2]} đơn vị</strong>.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
