'use client';
import {useState,useMemo} from 'react';
import {fmt,NumberField} from './labs';
import {MathFormula,MathText} from './math';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';

export function VectorCalculator() {
  return (
    <div className="vector-calc-container">
      <Tabs defaultValue="distance">
        <TabsList className="max-w-full overflow-x-auto justify-start">
          <TabsTrigger value="distance">Khoảng cách từ điểm đến mặt phẳng</TabsTrigger>
          <TabsTrigger value="plane-3pts">Mặt phẳng đi qua 3 điểm A, B, C</TabsTrigger>
        </TabsList>

        <TabsContent value="distance">
          <PointToPlaneDistance />
        </TabsContent>

        <TabsContent value="plane-3pts">
          <PlaneThrough3Points />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PointToPlaneDistance() {
  const [m, setM] = useState({x: 1, y: 0, z: 2});
  const [p, setP] = useState({a: 2, b: 2, c: -1, d: 3});

  const numVal = p.a * m.x + p.b * m.y + p.c * m.z + p.d;
  const absNum = Math.abs(numVal);
  const sumSq = p.a ** 2 + p.b ** 2 + p.c ** 2;
  const denVal = Math.sqrt(sumSq);

  const isValid = sumSq > 0;
  const dist = isValid ? absNum / denVal : 0;

  return (
    <section className="panel prose">
      <h2>Khoảng cách từ điểm M đến mặt phẳng (α)</h2>
      <MathFormula
        latex={String.raw`d(M, (\alpha)) = \frac{|Ax_0 + By_0 + Cz_0 + D|}{\sqrt{A^2 + B^2 + C^2}}`}
      />

      <div className="two-columns" style={{marginTop: 18}}>
        <div>
          <h3>Tọa độ điểm M(x₀, y₀, z₀)</h3>
          <div className="control-row">
            <NumberField label="x₀" value={m.x} onChange={x => setM(v => ({...v, x}))} min={-100} max={100} step={0.5} />
            <NumberField label="y₀" value={m.y} onChange={y => setM(v => ({...v, y}))} min={-100} max={100} step={0.5} />
            <NumberField label="z₀" value={m.z} onChange={z => setM(v => ({...v, z}))} min={-100} max={100} step={0.5} />
          </div>

          <h3 style={{marginTop: 18}}>Hệ số mặt phẳng: Ax + By + Cz + D = 0</h3>
          <div className="control-row">
            <NumberField label="A" value={p.a} onChange={a => setP(v => ({...v, a}))} min={-100} max={100} step={0.5} />
            <NumberField label="B" value={p.b} onChange={b => setP(v => ({...v, b}))} min={-100} max={100} step={0.5} />
            <NumberField label="C" value={p.c} onChange={c => setP(v => ({...v, c}))} min={-100} max={100} step={0.5} />
            <NumberField label="D" value={p.d} onChange={d => setP(v => ({...v, d}))} min={-100} max={100} step={0.5} />
          </div>

          <p className="small muted">
            Mặt phẳng: {p.a}x {p.b >= 0 ? `+ ${p.b}` : `− ${Math.abs(p.b)}`}y {p.c >= 0 ? `+ ${p.c}` : `− ${Math.abs(p.c)}`}z {p.d >= 0 ? `+ ${p.d}` : `− ${Math.abs(p.d)}`} = 0
          </p>
        </div>

        <div>
          <h3>Các bước thế số chi tiết</h3>
          {isValid ? (
            <>
              <ol className="steps">
                <li>
                  <strong>Tính tử số (Thế tọa độ điểm M):</strong>
                  <br />
                  |{p.a}({m.x}) + ({p.b})({m.y}) + ({p.c})({m.z}) + ({p.d})| = |{numVal}| = {absNum}
                </li>
                <li>
                  <strong>Tính mẫu số (Độ dài vectơ pháp tuyến n⃗ = ({p.a}, {p.b}, {p.c})):</strong>
                  <br />
                  √({p.a}² + {p.b}² + {p.c}²) = √({p.a ** 2} + {p.b ** 2} + {p.c ** 2}) = √{sumSq} ≈ {denVal.toFixed(4)}
                </li>
                <li>
                  <strong>Thực hiện phép chia:</strong>
                  <br />
                  d = {absNum} / {denVal.toFixed(4)} = {fmt(dist)}
                </li>
              </ol>

              <div className="metric highlight-metric">
                <span>Khoảng cách d(M, (α))</span>
                <strong style={{color: '#555ce5', fontSize: '22px'}}>{fmt(dist)}</strong>
              </div>
            </>
          ) : (
            <p className="warning-box">A, B, C không thể đồng thời bằng 0. Vectơ pháp tuyến phải khác 0.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function PlaneThrough3Points() {
  const [a, setA] = useState({x: 1, y: 0, z: 2});
  const [b, setB] = useState({x: 2, y: 1, z: 1});
  const [c, setC] = useState({x: 0, y: 3, z: -1});

  // Vector AB = B - A
  const ab = useMemo(() => ({x: b.x - a.x, y: b.y - a.y, z: b.z - a.z}), [a, b]);
  // Vector AC = C - A
  const ac = useMemo(() => ({x: c.x - a.x, y: c.y - a.y, z: c.z - a.z}), [a, c]);

  // Normal vector n = [AB, AC]
  const n = useMemo(() => ({
    x: ab.y * ac.z - ab.z * ac.y,
    y: ab.z * ac.x - ab.x * ac.z,
    z: ab.x * ac.y - ab.y * ac.x,
  }), [ab, ac]);

  const lenN = Math.hypot(n.x, n.y, n.z);
  const isCollinear = lenN === 0;

  // D = - (A*x_A + B*y_A + C*z_A)
  const d = -(n.x * a.x + n.y * a.y + n.z * a.z);

  return (
    <section className="panel prose">
      <h2>Phương trình mặt phẳng đi qua 3 điểm A, B, C</h2>
      <p>Nhập tọa độ 3 điểm phân biệt không thẳng hàng trong không gian Oxyz:</p>

      <div className="two-columns">
        <div>
          <h3>Điểm A(x_A, y_A, z_A)</h3>
          <div className="control-row">
            <NumberField label="x_A" value={a.x} onChange={x => setA(v => ({...v, x}))} min={-100} max={100} step={1} />
            <NumberField label="y_A" value={a.y} onChange={y => setA(v => ({...v, y}))} min={-100} max={100} step={1} />
            <NumberField label="z_A" value={a.z} onChange={z => setA(v => ({...v, z}))} min={-100} max={100} step={1} />
          </div>

          <h3 style={{marginTop: 14}}>Điểm B(x_B, y_B, z_B)</h3>
          <div className="control-row">
            <NumberField label="x_B" value={b.x} onChange={x => setB(v => ({...v, x}))} min={-100} max={100} step={1} />
            <NumberField label="y_B" value={b.y} onChange={y => setB(v => ({...v, y}))} min={-100} max={100} step={1} />
            <NumberField label="z_B" value={b.z} onChange={z => setB(v => ({...v, z}))} min={-100} max={100} step={1} />
          </div>

          <h3 style={{marginTop: 14}}>Điểm C(x_C, y_C, z_C)</h3>
          <div className="control-row">
            <NumberField label="x_C" value={c.x} onChange={x => setC(v => ({...v, x}))} min={-100} max={100} step={1} />
            <NumberField label="y_C" value={c.y} onChange={y => setC(v => ({...v, y}))} min={-100} max={100} step={1} />
            <NumberField label="z_C" value={c.z} onChange={z => setC(v => ({...v, z}))} min={-100} max={100} step={1} />
          </div>
        </div>

        <div>
          <h3>Lời giải chi tiết từng bước</h3>
          {isCollinear ? (
            <p className="warning-box">
              ⚠️ Ba điểm A, B, C thẳng hàng vì tích có hướng [AB⃗, AC⃗] = (0, 0, 0). Không tồn tại duy nhất một mặt phẳng!
            </p>
          ) : (
            <>
              <ol className="steps">
                <li>
                  <strong>Tìm hai vectơ chỉ phương trong mặt phẳng:</strong>
                  <br />
                  AB⃗ = ({b.x} − {a.x}, {b.y} − {a.y}, {b.z} − {a.z}) = ({ab.x}, {ab.y}, {ab.z})
                  <br />
                  AC⃗ = ({c.x} − {a.x}, {c.y} − {a.y}, {c.z} − {a.z}) = ({ac.x}, {ac.y}, {ac.z})
                </li>
                <li>
                  <strong>Tính vectơ pháp tuyến n⃗ = [AB⃗, AC⃗]:</strong>
                  <br />
                  n⃗ = ({ab.y}×{ac.z} − {ab.z}×{ac.y}, {ab.z}×{ac.x} − {ab.x}×{ac.z}, {ab.x}×{ac.y} − {ab.y}×{ac.x})
                  <br />
                  = ({n.x}, {n.y}, {n.z})
                </li>
                <li>
                  <strong>Lập phương trình mặt phẳng qua A({a.x}, {a.y}, {a.z}):</strong>
                  <br />
                  {n.x}(x − {a.x}) + ({n.y})(y − {a.y}) + ({n.z})(z − {a.z}) = 0
                </li>
                <li>
                  <strong>Khai triển và rút gọn:</strong>
                  <br />
                  {n.x}x {n.y >= 0 ? `+ ${n.y}` : `− ${Math.abs(n.y)}`}y {n.z >= 0 ? `+ ${n.z}` : `− ${Math.abs(n.z)}`}z {d >= 0 ? `+ ${d}` : `− ${Math.abs(d)}`} = 0
                </li>
              </ol>

              <div className="metric highlight-metric">
                <span>Phương trình tổng quát mặt phẳng (ABC)</span>
                <strong style={{color: '#31a58d', fontSize: '18px'}}>
                  {n.x}x {n.y >= 0 ? `+ ${n.y}` : `− ${Math.abs(n.y)}`}y {n.z >= 0 ? `+ ${n.z}` : `− ${Math.abs(n.z)}`}z {d >= 0 ? `+ ${d}` : `− ${Math.abs(d)}`} = 0
                </strong>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
