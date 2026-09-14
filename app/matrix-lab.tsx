'use client';
import {useState,useRef} from 'react';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {RotateCcw,ZoomIn,ZoomOut} from 'lucide-react';
import {fmt} from './labs';
import {MathText, MathFormula} from './math';
import {EconomicMathKT105} from './matrix-kt105';

function toPmatrix(mat: number[][]): string {
  const rows = mat.map(row => row.map(v => fmt(v)).join(' & ')).join(' \\\\ ');
  return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
}

function toBmatrix(mat: number[][]): string {
  const rows = mat.map(row => row.map(v => fmt(v)).join(' & ')).join(' \\\\ ');
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

function toVmatrix(mat: number[][]): string {
  const rows = mat.map(row => row.map(v => fmt(v)).join(' & ')).join(' \\\\ ');
  return `\\begin{vmatrix} ${rows} \\end{vmatrix}`;
}

// ==========================================
// 1. MÁY TÍNH MA TRẬN (MATRIX CALCULATOR)
// ==========================================

type MatrixSize = 2 | 3 | 4 | 5;

const SUB_DIGITS = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
function toSub(num: number): string {
  return String(num).split('').map(d => SUB_DIGITS[Number(d)] || d).join('');
}

const DEFAULT_A: Record<MatrixSize, number[][]> = {
  2: [
    [2, 1],
    [5, 3]
  ],
  3: [
    [1, 2, 0],
    [0, 1, 1],
    [2, 0, 1]
  ],
  4: [
    [1, 0, 2, 1],
    [2, 1, 0, 1],
    [1, 1, 1, 0],
    [0, 2, 1, 2]
  ],
  5: [
    [2, 1, 0, 0, 1],
    [1, 2, 1, 0, 0],
    [0, 1, 2, 1, 0],
    [0, 0, 1, 2, 1],
    [1, 0, 0, 1, 2]
  ]
};

const DEFAULT_B: Record<MatrixSize, number[][]> = {
  2: [
    [1, 2],
    [3, 4]
  ],
  3: [
    [2, 0, 1],
    [1, 1, 0],
    [0, 2, 1]
  ],
  4: [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [1, 0, 0, 1]
  ],
  5: [
    [1, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 1],
    [1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1]
  ]
};

function computeGaussianElimination(mat: number[][]) {
  const n = mat.length;
  const m = mat.map(row => [...row]);
  let det = 1;
  let swaps = 0;

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(m[r][i]) > Math.abs(m[pivot][i])) {
        pivot = r;
      }
    }
    if (Math.abs(m[pivot][i]) < 1e-12) {
      return { det: 0, triangular: m, rank: i };
    }
    if (pivot !== i) {
      [m[i], m[pivot]] = [m[pivot], m[i]];
      swaps++;
      det = -det;
    }
    det *= m[i][i];
    const pivotVal = m[i][i];
    for (let r = i + 1; r < n; r++) {
      const factor = m[r][i] / pivotVal;
      for (let c = i; c < n; c++) {
        m[r][c] -= factor * m[i][c];
      }
    }
  }
  const cleanDet = Math.abs(det - Math.round(det)) < 1e-9 ? Math.round(det) : Math.round(det * 10000) / 10000;
  return { det: cleanDet, swaps, rank: n };
}

function computeInverse(mat: number[][]): number[][] | null {
  const n = mat.length;
  const aug = mat.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  ]);

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(aug[r][i]) > Math.abs(aug[pivot][i])) {
        pivot = r;
      }
    }
    if (Math.abs(aug[pivot][i]) < 1e-10) return null;
    if (pivot !== i) {
      [aug[i], aug[pivot]] = [aug[pivot], aug[i]];
    }
    const div = aug[i][i];
    for (let c = 0; c < 2 * n; c++) {
      aug[i][c] /= div;
    }
    for (let r = 0; r < n; r++) {
      if (r !== i) {
        const factor = aug[r][i];
        for (let c = 0; c < 2 * n; c++) {
          aug[r][c] -= factor * aug[i][c];
        }
      }
    }
  }

  return aug.map(row =>
    row.slice(n).map(val => (Math.abs(val) < 1e-10 ? 0 : Math.round(val * 10000) / 10000))
  );
}

export function MatrixCalculator() {
  const [mode, setMode] = useState<'calc' | 'kt105'>('calc');
  const [size, setSize] = useState<MatrixSize>(2);
  const [matricesA, setMatricesA] = useState<Record<MatrixSize, number[][]>>(DEFAULT_A);
  const [matricesB, setMatricesB] = useState<Record<MatrixSize, number[][]>>(DEFAULT_B);
  const [op, setOp] = useState<'det' | 'inv' | 'mul' | 'eigen' | 'transpose'>('det');

  const matA = matricesA[size];
  const matB = matricesB[size];

  function updateA(r: number, c: number, v: number) {
    setMatricesA(prev => ({
      ...prev,
      [size]: prev[size].map((row, ri) =>
        row.map((val, ci) => (ri === r && ci === c ? v : val))
      )
    }));
  }

  function updateB(r: number, c: number, v: number) {
    setMatricesB(prev => ({
      ...prev,
      [size]: prev[size].map((row, ri) =>
        row.map((val, ci) => (ri === r && ci === c ? v : val))
      )
    }));
  }

  function handleSetSize(newSize: MatrixSize) {
    setSize(newSize);
    if (newSize > 2 && op === 'eigen') {
      setOp('det');
    }
  }

  function setPresetInvertible() {
    setMatricesA(prev => ({ ...prev, [size]: DEFAULT_A[size] }));
  }

  function setPresetSingular() {
    setMatricesA(prev => {
      const cur = prev[size].map(r => [...r]);
      if (cur.length > 1) cur[1] = [...cur[0]];
      return { ...prev, [size]: cur };
    });
  }

  function setPresetIdentity() {
    setMatricesA(prev => ({
      ...prev,
      [size]: Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => (r === c ? 1 : 0))
      )
    }));
  }

  function setPresetZero() {
    setMatricesA(prev => ({
      ...prev,
      [size]: Array.from({ length: size }, () => Array(size).fill(0))
    }));
  }

  // Determinant calculation
  const detVal = (size === 2)
    ? (matA[0][0] * matA[1][1] - matA[0][1] * matA[1][0])
    : (size === 3)
    ? (
        matA[0][0] * (matA[1][1] * matA[2][2] - matA[1][2] * matA[2][1])
        - matA[0][1] * (matA[1][0] * matA[2][2] - matA[1][2] * matA[2][0])
        + matA[0][2] * (matA[1][0] * matA[2][1] - matA[1][1] * matA[2][0])
      )
    : computeGaussianElimination(matA).det;

  // Trace
  const trVal = matA.reduce((sum, row, i) => sum + (row[i] ?? 0), 0);

  // Transpose
  const transMat = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => matA[c][r])
  );

  // Inverse
  const invMat = Math.abs(detVal) > 1e-9 ? computeInverse(matA) : null;

  // Multiplication
  const mulMat = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      let sum = 0;
      for (let k = 0; k < size; k++) {
        sum += matA[r][k] * matB[k][c];
      }
      return Math.round(sum * 10000) / 10000;
    })
  );

  // 2x2 Eigenvalues
  const deltaEigen = trVal * trVal - 4 * detVal;
  const isEigenReal = deltaEigen >= 0;
  const lambda1 = isEigenReal ? (trVal + Math.sqrt(deltaEigen)) / 2 : null;
  const lambda2 = isEigenReal ? (trVal - Math.sqrt(deltaEigen)) / 2 : null;

  return (
    <section className="panel prose">
      <div className="section-title">
        <div>
          <h2>Máy tính Ma trận tương tác</h2>
          <p className="small">Tính định thức, ma trận nghịch đảo, nhân hai ma trận, vết và bài tập Toán Kinh Tế (KT105) chuẩn giáo trình.</p>
        </div>
        <div className="control-row">
          <button
            className={`secondary-btn small-btn ${mode === 'calc' ? 'active font-bold' : ''}`}
            onClick={() => setMode('calc')}
          >
            Ma trận vuông (2×2 đến 5×5)
          </button>
          <button
            className={`secondary-btn small-btn ${mode === 'kt105' ? 'active font-bold' : ''}`}
            onClick={() => setMode('kt105')}
            style={mode === 'kt105' ? {background: 'var(--accent)', color: 'var(--primary)', borderColor: 'var(--primary)'} : {}}
          >
            📊 BT KT105 Toán Kinh Tế 1
          </button>
        </div>
      </div>

      {mode === 'kt105' ? (
        <EconomicMathKT105 />
      ) : (
        <>
          <div className="control-row" style={{justifyContent: 'flex-end', margin: '0 0 16px', gap: '8px'}}>
            <span className="small muted" style={{marginRight: '4px'}}>Chọn cấp ma trận:</span>
            {([2, 3, 4, 5] as const).map(s => (
              <button
                key={s}
                className={`secondary-btn small-btn ${size === s ? 'active font-bold' : ''}`}
                onClick={() => handleSetSize(s)}
              >
                Cấp {s} × {s}
              </button>
            ))}
          </div>

          <div className="matrix-calc-grid">
            {/* INPUT MATRICES */}
            <div className="matrix-input-box">
              <div className="matrix-card">
                <div className="matrix-card-header">
                  <span className="tag">MA TRẬN A</span>
                  <span className="matrix-dim-badge">{size} × {size}</span>
                </div>
                <div className="matrix-bracket-wrap">
                  <div className={`matrix-bracket mat-size-${size}`}>
                    {matA.map((row, ri) => (
                      <div key={ri} className="matrix-row">
                        {row.map((val, ci) => (
                          <input
                            key={ci}
                            type="number"
                            value={val}
                            className={`matrix-cell cell-sz-${size}`}
                            placeholder={`a${toSub(ri + 1)}${toSub(ci + 1)}`}
                            title={`Hàng ${ri + 1}, Cột ${ci + 1}`}
                            onChange={e => updateA(ri, ci, Number(e.target.value) || 0)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="matrix-presets-section">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted-foreground)' }}>
                    <span>Mẫu thiết lập nhanh:</span>
                    <button className="text-btn small" onClick={setPresetZero}>Xóa về 0</button>
                  </div>
                  <div className="matrix-presets-buttons">
                    <button className="secondary-btn small-btn" onClick={setPresetInvertible}>Khả nghịch</button>
                    <button className="secondary-btn small-btn" onClick={setPresetSingular}>det = 0</button>
                    <button className="secondary-btn small-btn" onClick={setPresetIdentity}>Đơn vị I</button>
                  </div>
                </div>
              </div>

              {op === 'mul' && (
                <div className="matrix-card">
                  <div className="matrix-card-header">
                    <span className="tag">MA TRẬN B</span>
                    <span className="matrix-dim-badge">{size} × {size}</span>
                  </div>
                  <div className="matrix-bracket-wrap">
                    <div className={`matrix-bracket mat-size-${size}`}>
                      {matB.map((row, ri) => (
                        <div key={ri} className="matrix-row">
                          {row.map((val, ci) => (
                            <input
                              key={ci}
                              type="number"
                              value={val}
                              className={`matrix-cell cell-sz-${size}`}
                              placeholder={`b${toSub(ri + 1)}${toSub(ci + 1)}`}
                              title={`Hàng ${ri + 1}, Cột ${ci + 1}`}
                              onChange={e => updateB(ri, ci, Number(e.target.value) || 0)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="matrix-presets-section">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted-foreground)' }}>
                      <span>Mẫu ma trận B:</span>
                      <button className="text-btn small" onClick={() => setMatricesB(prev => ({ ...prev, [size]: Array.from({ length: size }, () => Array(size).fill(0)) }))}>Xóa về 0</button>
                    </div>
                    <div className="matrix-presets-buttons">
                      <button className="secondary-btn small-btn" onClick={() => setMatricesB(prev => ({ ...prev, [size]: DEFAULT_B[size] }))}>Mặc định</button>
                      <button className="secondary-btn small-btn" onClick={() => setMatricesB(prev => ({ ...prev, [size]: Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => (r === c ? 1 : 0))) }))}>Đơn vị I</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* OPERATIONS & OUTPUT */}
            <div className="matrix-result-box">
              <div className="control-row" style={{ margin: '0 0 16px' }}>
                <button className={`pill-toggle ${op === 'det' ? 'active f' : ''}`} onClick={() => setOp('det')}>det(A)</button>
                <button className={`pill-toggle ${op === 'inv' ? 'active F' : ''}`} onClick={() => setOp('inv')}>A⁻¹ (Nghịch đảo)</button>
                <button className={`pill-toggle ${op === 'mul' ? 'active d' : ''}`} onClick={() => setOp('mul')}>A × B (Nhân)</button>
                <button className={`pill-toggle ${op === 'transpose' ? 'active area' : ''}`} onClick={() => setOp('transpose')}>Aᵀ (Chuyển vị)</button>
                {size === 2 && <button className={`pill-toggle ${op === 'eigen' ? 'active tan' : ''}`} onClick={() => setOp('eigen')}>λ (Giá trị riêng)</button>}
              </div>

              {/* TAB: DETERMINANT */}
              {op === 'det' && (
                <div className="example-solution-box" style={{ marginTop: 0 }}>
                  <div className="example-solution-title">
                    <strong>Định thức det(A) cấp {size} × {size}</strong>
                  </div>
                  <div className="example-solution-content">
                    {size === 2 ? (
                      <>
                        <MathFormula latex={`\\det(A) = \\begin{vmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{vmatrix} = ${toVmatrix(matA)} = (${matA[0][0]})(${matA[1][1]}) - (${matA[0][1]})(${matA[1][0]}) = ${fmt(detVal)}`} block={true} />
                        <div className="solution-step">
                          <MathFormula latex={`\\operatorname{tr}(A) = a_{11} + a_{22} = ${matA[0][0]} + ${matA[1][1]} = ${fmt(trVal)}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathText text={`• **Kết luận**: ${Math.abs(detVal) > 1e-9 ? '$\\det(A) \\neq 0 \\implies$ Ma trận $A$ **khả nghịch** (không suy biến, tồn tại ma trận nghịch đảo $A^{-1}$).' : '$\\det(A) = 0 \\implies$ Ma trận $A$ **suy biến** (không tồn tại ma trận nghịch đảo).'}`} />
                        </div>
                      </>
                    ) : size === 3 ? (
                      <>
                        <MathFormula latex={`\\det(A) = \\begin{vmatrix} a_{11} & a_{12} & a_{13} \\\\ a_{21} & a_{22} & a_{23} \\\\ a_{31} & a_{32} & a_{33} \\end{vmatrix} = ${toVmatrix(matA)}`} block={true} />
                        <div className="solution-step">
                          <MathText text="• Khai triển Laplace theo Hàng 1:" />
                          <MathFormula latex={`\\det(A) = a_{11} C_{11} + a_{12} C_{12} + a_{13} C_{13}`} block={true} />
                          <MathFormula latex={`= (${matA[0][0]}) \\begin{vmatrix} ${matA[1][1]} & ${matA[1][2]} \\\\ ${matA[2][1]} & ${matA[2][2]} \\end{vmatrix} - (${matA[0][1]}) \\begin{vmatrix} ${matA[1][0]} & ${matA[1][2]} \\\\ ${matA[2][0]} & ${matA[2][2]} \\end{vmatrix} + (${matA[0][2]}) \\begin{vmatrix} ${matA[1][0]} & ${matA[1][1]} \\\\ ${matA[2][0]} & ${matA[2][1]} \\end{vmatrix}`} block={true} />
                          <MathFormula latex={`= (${matA[0][0]})(${matA[1][1]*matA[2][2] - matA[1][2]*matA[2][1]}) - (${matA[0][1]})(${matA[1][0]*matA[2][2] - matA[1][2]*matA[2][0]}) + (${matA[0][2]})(${matA[1][0]*matA[2][1] - matA[1][1]*matA[2][0]}) = ${fmt(detVal)}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathFormula latex={`\\operatorname{tr}(A) = a_{11} + a_{22} + a_{33} = ${matA[0][0]} + ${matA[1][1]} + ${matA[2][2]} = ${fmt(trVal)}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathText text={`• **Kết luận**: ${Math.abs(detVal) > 1e-9 ? '$\\det(A) \\neq 0 \\implies$ Ma trận $A$ **khả nghịch** (hạng $\\operatorname{rank}(A) = 3$).' : '$\\det(A) = 0 \\implies$ Ma trận $A$ **suy biến** (hạng $\\operatorname{rank}(A) < 3$).'}`} />
                        </div>
                      </>
                    ) : (
                      <>
                        <MathFormula latex={`\\det(A) = ${toVmatrix(matA)} = ${fmt(detVal)}`} block={true} />
                        <div className="solution-step">
                          <MathText text={`• Phương pháp: Khử Gauss (Gauss Elimination) đưa ma trận cấp ${size}×${size} về dạng tam giác trên $U$, khi đó $\\det(A) = (-1)^s \\prod_{i=1}^{${size}} u_{ii}$:`} />
                          <MathFormula latex={`\\det(A) = ${fmt(detVal)}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathFormula latex={`\\operatorname{tr}(A) = \\sum_{i=1}^{${size}} a_{ii} = ${matA.map((r, i) => fmt(r[i])).join(' + ')} = ${fmt(trVal)}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathText text={`• **Kết luận**: ${Math.abs(detVal) > 1e-9 ? `$\\det(A) = ${fmt(detVal)} \\neq 0 \\implies$ Ma trận $A$ **khả nghịch** (hạng $\\operatorname{rank}(A) = ${size}$, hệ phương trình $A X = B$ có nghiệm duy nhất).` : `$\\det(A) = 0 \\implies$ Ma trận $A$ **suy biến** (hạng $\\operatorname{rank}(A) < ${size}$, không khả nghịch).`}`} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: INVERSE */}
              {op === 'inv' && (
                <div className="example-solution-box" style={{ marginTop: 0 }}>
                  <div className="example-solution-title">
                    <strong>Ma trận nghịch đảo A⁻¹ cấp {size} × {size}</strong>
                  </div>
                  <div className="example-solution-content">
                    {Math.abs(detVal) < 1e-9 || !invMat ? (
                      <div className="warning-box" style={{ margin: 0 }}>
                        <MathFormula latex={`\\det(A) = 0 \\implies \\nexists A^{-1}`} block={true} />
                        <p style={{ margin: '6px 0 0', textAlign: 'center' }}>⚠️ Ma trận có định thức bằng 0 (ma trận suy biến). <strong>Không tồn tại ma trận nghịch đảo!</strong></p>
                      </div>
                    ) : size === 2 ? (
                      <>
                        <div className="solution-step">
                          <MathText text={`• **Bước 1**: Kiểm tra định thức: $\\det(A) = ${fmt(detVal)} \\neq 0$ (thỏa mãn điều kiện khả nghịch).`} />
                        </div>
                        <div className="solution-step">
                          <MathText text="• **Bước 2**: Tìm ma trận phụ hợp $\\operatorname{adj}(A)$ (đổi chỗ chéo chính, đổi dấu chéo phụ):" />
                          <MathFormula latex={`\\operatorname{adj}(A) = \\begin{pmatrix} a_{22} & -a_{12} \\\\ -a_{21} & a_{11} \\end{pmatrix} = \\begin{pmatrix} ${matA[1][1]} & ${-matA[0][1]} \\\\ ${-matA[1][0]} & ${matA[0][0]} \\end{pmatrix}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathText text={`• **Bước 3**: Áp dụng công thức $A^{-1} = \\frac{1}{\\det(A)} \\operatorname{adj}(A)$:`} />
                          <MathFormula latex={`A^{-1} = \\frac{1}{${fmt(detVal)}} \\begin{pmatrix} ${matA[1][1]} & ${-matA[0][1]} \\\\ ${-matA[1][0]} & ${matA[0][0]} \\end{pmatrix} = ${toPmatrix(invMat)}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathText text="• **Kiểm tra**: $A \\cdot A^{-1} = I_2$:" />
                          <MathFormula latex={`${toPmatrix(matA)} \\cdot ${toPmatrix(invMat)} = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}`} block={true} />
                        </div>
                      </>
                    ) : size === 3 ? (
                      <>
                        <div className="solution-step">
                          <MathText text={`• **Bước 1**: Kiểm tra định thức: $\\det(A) = ${fmt(detVal)} \\neq 0$ (khả nghịch).`} />
                        </div>
                        <div className="solution-step">
                          <MathText text="• **Bước 2**: Tính ma trận phụ hợp $\\operatorname{adj}(A) = C^T$ (chuyển vị của ma trận phần bù đại số):" />
                          <MathFormula latex={`\\operatorname{adj}(A) = \\begin{pmatrix} ${fmt(invMat[0][0]*detVal)} & ${fmt(invMat[0][1]*detVal)} & ${fmt(invMat[0][2]*detVal)} \\\\ ${fmt(invMat[1][0]*detVal)} & ${fmt(invMat[1][1]*detVal)} & ${fmt(invMat[1][2]*detVal)} \\\\ ${fmt(invMat[2][0]*detVal)} & ${fmt(invMat[2][1]*detVal)} & ${fmt(invMat[2][2]*detVal)} \\end{pmatrix}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathText text="• **Bước 3**: Nhân với $\\frac{1}{\\det(A)}$ để có ma trận nghịch đảo $A^{-1}$:" />
                          <MathFormula latex={`A^{-1} = \\frac{1}{${fmt(detVal)}} \\operatorname{adj}(A) = ${toPmatrix(invMat)}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathText text="• **Kiểm tra**: $A \\cdot A^{-1} = I_3$:" />
                          <MathFormula latex={`${toPmatrix(matA)} \\cdot ${toPmatrix(invMat)} = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}`} block={true} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="solution-step">
                          <MathText text={`• **Bước 1**: Kiểm tra định thức: $\\det(A) = ${fmt(detVal)} \\neq 0$ (khả nghịch).`} />
                        </div>
                        <div className="solution-step">
                          <MathText text={`• **Bước 2**: Áp dụng thuật toán khử toàn phần Gauss-Jordan trên ma trận bổ sung $[A \\mid I_{${size}}] \\xrightarrow{\\text{biến đổi sơ cấp dòng}} [I_{${size}} \\mid A^{-1}]$:`} />
                        </div>
                        <div className="solution-step">
                          <MathText text={`• **Bước 3**: Kết quả ma trận nghịch đảo $A^{-1}$ cấp ${size}×${size}:`} />
                          <MathFormula latex={`A^{-1} = ${toPmatrix(invMat)}`} block={true} />
                        </div>
                        <div className="solution-step">
                          <MathText text={`• **Kiểm tra tích**: $A \\cdot A^{-1} = I_{${size}}$ (Ma trận đơn vị).`} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: MULTIPLICATION */}
              {op === 'mul' && (
                <div className="example-solution-box" style={{ marginTop: 0 }}>
                  <div className="example-solution-title">
                    <strong>Tích hai ma trận C = A · B (Cấp {size} × {size})</strong>
                  </div>
                  <div className="example-solution-content">
                    <div className="solution-step">
                      <MathText text="• Công thức tích ma trận: phần tử $c_{ij} = \\sum_{k=1}^n a_{ik} b_{kj}$ (Hàng $i$ của $A$ nhân vô hướng với Cột $j$ của $B$):" />
                    </div>
                    <MathFormula latex={`C = A \\cdot B = ${toPmatrix(matA)} \\cdot ${toPmatrix(matB)} = ${toPmatrix(mulMat)}`} block={true} />
                    <div className="solution-step" style={{ marginTop: 12 }}>
                      <MathText text="• Chi tiết tính toán các phần tử hàng 1 của tích $C$:" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                        {Array.from({ length: size }, (_, c) => (
                          <div key={c} className="code-box" style={{ padding: '6px 12px' }}>
                            <MathFormula
                              latex={`c_{1${c + 1}} = ${matA[0].map((v, k) => `(${fmt(v)})(${fmt(matB[k][c])})`).join(' + ')} = ${fmt(mulMat[0][c])}`}
                              block={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: TRANSPOSE */}
              {op === 'transpose' && (
                <div className="example-solution-box" style={{ marginTop: 0 }}>
                  <div className="example-solution-title">
                    <strong>Ma trận chuyển vị Aᵀ (Cấp {size} × {size})</strong>
                  </div>
                  <div className="example-solution-content">
                    <div className="solution-step">
                      <MathText text="• Định nghĩa: Hoán đổi vị trí hàng và cột: $(A^T)_{ij} = a_{ji}$ (Hàng $i$ trở thành Cột $i$)." />
                    </div>
                    <MathFormula latex={`A^T = \\left( ${toPmatrix(matA)} \\right)^T = ${toPmatrix(transMat)}`} block={true} />
                    <div className="solution-step" style={{ marginTop: 10 }}>
                      <MathText text={
                        matA.every((r, ri) => r.every((v, ci) => v === transMat[ri][ci]))
                          ? '• Vì $A^T = A$ nên $A$ là **ma trận đối xứng** (Symmetric Matrix).'
                          : '• Vì $A^T \\neq A$ nên $A$ không phải ma trận đối xứng.'
                      } />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: EIGENVALUES (2x2) */}
              {op === 'eigen' && size === 2 && (
                <div className="example-solution-box" style={{ marginTop: 0 }}>
                  <div className="example-solution-title">
                    <strong>Giá trị riêng (Eigenvalues) của A</strong>
                  </div>
                  <div className="example-solution-content">
                    <div className="solution-step">
                      <MathText text="• **Phương trình đặc trưng**: $\\det(A - \\lambda I) = 0$" />
                      <MathFormula latex={`\\det(A - \\lambda I) = \\begin{vmatrix} ${matA[0][0]} - \\lambda & ${matA[0][1]} \\\\ ${matA[1][0]} & ${matA[1][1]} - \\lambda \\end{vmatrix} = 0`} block={true} />
                    </div>
                    <div className="solution-step">
                      <MathText text="• Khai triển thành phương trình bậc hai theo $\\lambda$:" />
                      <MathFormula latex={`\\lambda^2 - \\operatorname{tr}(A)\\lambda + \\det(A) = 0 \\iff \\lambda^2 - (${fmt(trVal)})\\lambda + (${fmt(detVal)}) = 0`} block={true} />
                    </div>
                    <div className="solution-step">
                      <MathText text={`• Biệt thức: $\\Delta = (\\operatorname{tr} A)^2 - 4\\det(A) = (${fmt(trVal)})^2 - 4(${fmt(detVal)}) = ${fmt(deltaEigen)}$`} />
                    </div>
                    {isEigenReal ? (
                      <>
                        <div className="solution-step">
                          <MathText text="• $\\Delta \\ge 0$: Ma trận có hai giá trị riêng thực:" />
                          <MathFormula latex={`\\lambda_1 = \\frac{${fmt(trVal)} + \\sqrt{${fmt(deltaEigen)}}}{2} = ${fmt(lambda1!)}, \\quad \\lambda_2 = \\frac{${fmt(trVal)} - \\sqrt{${fmt(deltaEigen)}}}{2} = ${fmt(lambda2!)}`} block={true} />
                        </div>
                        <div className="solution-step small muted">
                          <MathFormula latex={`\\text{Kiểm tra: } \\lambda_1 + \\lambda_2 = ${fmt(lambda1! + lambda2!)} = \\operatorname{tr}(A); \\quad \\lambda_1 \\cdot \\lambda_2 = ${fmt(lambda1! * lambda2!)} = \\det(A).`} block={true} />
                        </div>
                      </>
                    ) : (
                      <div className="solution-step">
                        <MathText text="• $\\Delta < 0$: Ma trận có cặp giá trị riêng phức liên hợp:" />
                        <MathFormula latex={`\\lambda_{1,2} = \\alpha \\pm \\beta i = ${fmt(trVal / 2)} \\pm ${fmt(Math.sqrt(-deltaEigen) / 2)}i`} block={true} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// =======================================================
// 2. PHÒNG THÍ NGHIỆM BIẾN HÌNH MA TRẬN 2D (MATRIX LAB)
// =======================================================

export function MatrixLab(){
  const [a,setA]=useState(1);
  const [b,setB]=useState(0.5);
  const [c,setC]=useState(0);
  const [d,setD]=useState(1);
  const [scale,setScale]=useState(35);
  const [pan,setPan]=useState({x:0,y:0});

  const svg=useRef<SVGSVGElement>(null);
  const cx = 260 + pan.x, cy = 170 + pan.y;

  const detVal = a*d - b*c;
  const absDet = Math.abs(detVal);

  // Basis vectors transformed:
  // i_hat = (1, 0) -> (a, c)
  // j_hat = (0, 1) -> (b, d)
  const iX = cx + a*scale;
  const iY = cy - c*scale;
  const jX = cx + b*scale;
  const jY = cy - d*scale;
  const cornerX = cx + (a+b)*scale;
  const cornerY = cy - (c+d)*scale;

  // Transformed parallelogram path
  const polyPoints = `${cx},${cy} ${iX},${iY} ${cornerX},${cornerY} ${jX},${jY}`;

  // Grid lines: transform lines of x in [-6, 6] and y in [-6, 6]
  const gridRange = [-5,-4,-3,-2,-1,0,1,2,3,4,5];

  function applyPreset(pa:number, pb:number, pc:number, pd:number){
    setA(pa); setB(pb); setC(pc); setD(pd);
  }

  return (
    <div className="lab-layout">
      <section className="panel graph-panel">
        <div className="section-title">
          <div>
            <h3>Mô phỏng: Ma trận biến hình 2D</h3>
            <p className="small">
              <MathText text="Xem cách ma trận $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ làm biến dạng không gian 2 chiều và diện tích bình hành $(|\det A|)$." />
            </p>
          </div>
          <div className="control-row">
            <button className="icon-button" aria-label="Phóng to" onClick={()=>setScale(s=>Math.min(s*1.25,100))}><ZoomIn size={17}/></button>
            <button className="icon-button" aria-label="Thu nhỏ" onClick={()=>setScale(s=>Math.max(s/1.25,12))}><ZoomOut size={17}/></button>
            <button className="icon-button" aria-label="Đặt lại" onClick={()=>{setScale(35);setPan({x:0,y:0});setA(1);setB(0.5);setC(0);setD(1)}}><RotateCcw size={16}/></button>
          </div>
        </div>

        <svg ref={svg} viewBox="0 0 520 340" className="interactive-graph" role="img" aria-label="Mặt phẳng biến hình ma trận tuyến tính 2D">
          {/* Background transformed grid */}
          <g className="transformed-grid" opacity=".18">
            {gridRange.map(gx=>(
              <line
                key={'gx'+gx}
                x1={cx + (a*gx + b*(-6))*scale}
                y1={cy - (c*gx + d*(-6))*scale}
                x2={cx + (a*gx + b*6)*scale}
                y2={cy - (c*gx + d*6)*scale}
                stroke="currentColor"
                strokeWidth={gx===0?'1.5':'1'}
              />
            ))}
            {gridRange.map(gy=>(
              <line
                key={'gy'+gy}
                x1={cx + (a*(-6) + b*gy)*scale}
                y1={cy - (c*(-6) + d*gy)*scale}
                x2={cx + (a*6 + b*gy)*scale}
                y2={cy - (c*6 + d*gy)*scale}
                stroke="currentColor"
                strokeWidth={gy===0?'1.5':'1'}
              />
            ))}
          </g>

          {/* Original Cartesian Axes for reference */}
          <line x1="0" y1={cy} x2="520" y2={cy} stroke="currentColor" opacity=".25" strokeDasharray="3 3"/>
          <line x1={cx} y1="0" x2={cx} y2="340" stroke="currentColor" opacity=".25" strokeDasharray="3 3"/>

          {/* Transformed Unit Square (Parallelogram) */}
          <polygon
            points={polyPoints}
            fill={detVal < 0 ? 'rgba(235, 87, 87, 0.25)' : 'rgba(99, 107, 231, 0.25)'}
            stroke={detVal < 0 ? '#eb5757' : '#636be7'}
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Basis Vector i: (1, 0) -> (a, c) (Orange) */}
          <line x1={cx} y1={cy} x2={iX} y2={iY} stroke="#e29b36" strokeWidth="3.5"/>
          <circle cx={iX} cy={iY} r="6" fill="#e29b36" stroke="white" strokeWidth="2"/>
          <text x={iX + 8} y={iY - 6} fill="#e29b36" fontSize="12" fontWeight="bold">î′=({a},{c})</text>

          {/* Basis Vector j: (0, 1) -> (b, d) (Teal) */}
          <line x1={cx} y1={cy} x2={jX} y2={jY} stroke="#29a393" strokeWidth="3.5"/>
          <circle cx={jX} cy={jY} r="6" fill="#29a393" stroke="white" strokeWidth="2"/>
          <text x={jX + 8} y={jY - 6} fill="#29a393" fontSize="12" fontWeight="bold">ĵ′=({b},{d})</text>

          {/* Origin Point */}
          <circle cx={cx} cy={cy} r="4" fill="currentColor"/>
          <text x={cx - 14} y={cy + 16} fill="currentColor" fontSize="11">O</text>
        </svg>

        <div className="graph-hint-row">
          <span className="small muted">
            💡 Vùng tô màu là <strong>hình vuông đơn vị</strong> biến thành <strong>hình bình hành</strong>. Diện tích của nó bằng đúng <strong>|det(A)| = {fmt(absDet)}</strong>.
          </span>
        </div>
      </section>

      <aside className="panel prose">
        <span className="tag">THAM SỐ BIẾN HÌNH</span>
        <h2>Ma trận biến đổi</h2>
        <MathFormula latex={`A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`} block={true} />

        <div className="matrix-bracket-wrap">
          <div className="matrix-bracket mat-size-2">
            <div className="matrix-row">
              <label className="matrix-cell-label">
                <span>a</span>
                <input type="number" step="0.1" value={a} className="matrix-cell" onChange={e=>setA(Number(e.target.value)||0)}/>
              </label>
              <label className="matrix-cell-label">
                <span>b</span>
                <input type="number" step="0.1" value={b} className="matrix-cell" onChange={e=>setB(Number(e.target.value)||0)}/>
              </label>
            </div>
            <div className="matrix-row">
              <label className="matrix-cell-label">
                <span>c</span>
                <input type="number" step="0.1" value={c} className="matrix-cell" onChange={e=>setC(Number(e.target.value)||0)}/>
              </label>
              <label className="matrix-cell-label">
                <span>d</span>
                <input type="number" step="0.1" value={d} className="matrix-cell" onChange={e=>setD(Number(e.target.value)||0)}/>
              </label>
            </div>
          </div>
        </div>

        <div className="metric">
          <span>Hệ số diện tích |det(A)|</span>
          <strong style={{color:'var(--primary)',fontSize:'18px'}}>
            <MathFormula latex={`|\\det(A)| = ${fmt(absDet)}`} block={false} />
          </strong>
        </div>
        <div className="metric">
          <span>Định thức det(A)</span>
          <strong>
            <MathFormula latex={`\\det(A) = ad - bc = ${fmt(detVal)}`} block={false} />
          </strong>
        </div>
        <div className="metric">
          <span>Định hướng (Orientation)</span>
          <strong>
            {detVal > 0 ? 'Thuận chiều (giữ nguyên)' : detVal < 0 ? 'Đảo chiều (lật ngược mặt)' : 'Xẹp thành 1 đường thẳng (det=0)'}
          </strong>
        </div>

        <h3 style={{marginTop:18}}>Chọn phép biến hình mẫu:</h3>
        <div className="control-row" style={{gap:6}}>
          <button className="secondary-btn small-btn" onClick={()=>applyPreset(1,0,0,1)}>Đồng nhất</button>
          <button className="secondary-btn small-btn" onClick={()=>applyPreset(0.707,-0.707,0.707,0.707)}>Xoay 45°</button>
          <button className="secondary-btn small-btn" onClick={()=>applyPreset(0,-1,1,0)}>Xoay 90°</button>
          <button className="secondary-btn small-btn" onClick={()=>applyPreset(1,1,0,1)}>Trượt ngang (Shear)</button>
          <button className="secondary-btn small-btn" onClick={()=>applyPreset(2,0,0,2)}>Co giãn 2x</button>
          <button className="secondary-btn small-btn" onClick={()=>applyPreset(1,0,0,-1)}>Đối xứng Ox</button>
          <button className="secondary-btn small-btn" onClick={()=>applyPreset(1,1,1,1)}>Suy biến (det=0)</button>
        </div>
      </aside>
    </div>
  );
}
