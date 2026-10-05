'use client';
import {useState,useRef,useCallback,useMemo} from 'react';
import {fmt,NumberField} from './labs';
import {MathFormula} from './math';
import {RotateCcw,Compass,Layers} from 'lucide-react';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function Vector3DLab() {
  const [u, setU] = useState<Vec3>({x: 2.5, y: 1.0, z: 2.0});
  const [v, setV] = useState<Vec3>({x: 0.5, y: 3.0, z: 1.0});

  // Rotation angles for 3D camera (degrees)
  const [yaw, setYaw] = useState(35);
  const [pitch, setPitch] = useState(25);
  const [scale, setScale] = useState(38);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{x: number; y: number; startYaw: number; startPitch: number} | null>(null);

  const svgWidth = 520;
  const svgHeight = 340;
  const cx = 260;
  const cy = 180;

  // 3D projection function
  const project = useCallback((p: Vec3): {x: number; y: number} => {
    const radYaw = (yaw * Math.PI) / 180;
    const radPitch = (pitch * Math.PI) / 180;

    // Rotate around Z axis (Yaw)
    const x1 = p.x * Math.cos(radYaw) - p.y * Math.sin(radYaw);
    const y1 = p.x * Math.sin(radYaw) + p.y * Math.cos(radYaw);
    const z1 = p.z;

    // Rotate around X axis (Pitch)
    const x2 = x1;
    const y2 = y1 * Math.cos(radPitch) - z1 * Math.sin(radPitch);
    const z2 = y1 * Math.sin(radPitch) + z1 * Math.cos(radPitch);

    // Screen coordinates (Z points up on screen)
    return {
      x: cx + x2 * scale,
      y: cy - z2 * scale,
    };
  }, [yaw, pitch, scale, cx, cy]);

  // Pointer drag to rotate 3D view
  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      startYaw: yaw,
      startPitch: pitch,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setYaw((dragRef.current.startYaw + dx * 0.6) % 360);
    setPitch(Math.max(-80, Math.min(80, dragRef.current.startPitch + dy * 0.5)));
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  // Calculations
  const dotProduct = u.x * v.x + u.y * v.y + u.z * v.z;
  const lenU = Math.hypot(u.x, u.y, u.z);
  const lenV = Math.hypot(v.x, v.y, v.z);

  const cosTheta = lenU > 0 && lenV > 0 ? Math.max(-1, Math.min(1, dotProduct / (lenU * lenV))) : 0;
  const angleRad = Math.acos(cosTheta);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Cross Product: w = [u, v]
  const cross: Vec3 = {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  };
  const lenCross = Math.hypot(cross.x, cross.y, cross.z);
  const areaParallelogram = lenCross;
  const areaTriangle = lenCross / 2;

  // Projected Points
  const pO = project({x: 0, y: 0, z: 0});
  const pU = project(u);
  const pV = project(v);
  const pUV = project({x: u.x + v.x, y: u.y + v.y, z: u.z + v.z});

  // Scale down cross product visually if too long so it stays nicely inside view
  const crossDisplayScale = lenCross > 4 ? 4 / lenCross : 1;
  const displayCross: Vec3 = {
    x: cross.x * crossDisplayScale,
    y: cross.y * crossDisplayScale,
    z: cross.z * crossDisplayScale,
  };
  const pCross = project(displayCross);

  // 3D Axis points
  const axisLen = 4;
  const pX = project({x: axisLen, y: 0, z: 0});
  const pY = project({x: 0, y: axisLen, z: 0});
  const pZ = project({x: 0, y: 0, z: axisLen});

  const pXneg = project({x: -axisLen, y: 0, z: 0});
  const pYneg = project({x: 0, y: -axisLen, z: 0});
  const pZneg = project({x: 0, y: 0, z: -axisLen});

  return (
    <div className="lab-layout">
      <section className="panel graph-panel prose">
        <div className="section-title">
          <div>
            <span className="tag">HÌNH HỌC KHÔNG GIAN 3D</span>
            <h2>Vectơ & Tích có hướng trong Oxyz</h2>
          </div>
          <div className="control-row">
            <button
              className="icon-button"
              aria-label="Đặt lại góc nhìn"
              onClick={() => {
                setYaw(35);
                setPitch(25);
                setScale(38);
                setU({x: 2.5, y: 1.0, z: 2.0});
                setV({x: 0.5, y: 3.0, z: 1.0});
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* 3D SVG Viewport */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="interactive-graph"
          role="img"
          aria-label={`Không gian 3D: vector u=(${u.x}, ${u.y}, ${u.z}), v=(${v.x}, ${v.y}, ${v.z}). Kéo chuột để xoay 3D.`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{cursor: 'grab'}}
        >
          {/* Axis X, Y, Z negative (dashed) */}
          <line x1={pO.x} y1={pO.y} x2={pXneg.x} y2={pXneg.y} stroke="#ff6b6b" strokeDasharray="3 3" opacity="0.3" />
          <line x1={pO.x} y1={pO.y} x2={pYneg.x} y2={pYneg.y} stroke="#51cf66" strokeDasharray="3 3" opacity="0.3" />
          <line x1={pO.x} y1={pO.y} x2={pZneg.x} y2={pZneg.y} stroke="#339af0" strokeDasharray="3 3" opacity="0.3" />

          {/* Parallelogram spanned by u and v */}
          <polygon
            points={`${pO.x},${pO.y} ${pU.x},${pU.y} ${pUV.x},${pUV.y} ${pV.x},${pV.y}`}
            fill="#8870e8"
            fillOpacity="0.25"
            stroke="#8870e8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Coordinate Axes */}
          {/* Ox (Red) */}
          <line x1={pO.x} y1={pO.y} x2={pX.x} y2={pX.y} stroke="#ff6b6b" strokeWidth="2" />
          <text x={pX.x + 8} y={pX.y + 4} fontSize="12" fill="#ff6b6b" fontWeight="bold">X</text>

          {/* Oy (Green) */}
          <line x1={pO.x} y1={pO.y} x2={pY.x} y2={pY.y} stroke="#51cf66" strokeWidth="2" />
          <text x={pY.x + 8} y={pY.y + 4} fontSize="12" fill="#51cf66" fontWeight="bold">Y</text>

          {/* Oz (Blue) */}
          <line x1={pO.x} y1={pO.y} x2={pZ.x} y2={pZ.y} stroke="#339af0" strokeWidth="2" />
          <text x={pZ.x + 4} y={pZ.y - 6} fontSize="12" fill="#339af0" fontWeight="bold">Z</text>

          {/* Origin O */}
          <circle cx={pO.x} cy={pO.y} r="3" fill="currentColor" opacity="0.7" />
          <text x={pO.x - 12} y={pO.y + 14} fontSize="11" fill="currentColor" opacity="0.6">O</text>

          {/* Vector u (Cyan / Blue) */}
          <line x1={pO.x} y1={pO.y} x2={pU.x} y2={pU.y} stroke="#38bdf8" strokeWidth="3" />
          <circle cx={pU.x} cy={pU.y} r="5" fill="#38bdf8" stroke="white" strokeWidth="2" />
          <text x={pU.x + 8} y={pU.y - 4} fontSize="13" fill="#38bdf8" fontWeight="bold">u⃗</text>

          {/* Vector v (Emerald Green) */}
          <line x1={pO.x} y1={pO.y} x2={pV.x} y2={pV.y} stroke="#2dd4bf" strokeWidth="3" />
          <circle cx={pV.x} cy={pV.y} r="5" fill="#2dd4bf" stroke="white" strokeWidth="2" />
          <text x={pV.x + 8} y={pV.y - 4} fontSize="13" fill="#2dd4bf" fontWeight="bold">v⃗</text>

          {/* Cross Product Vector w = [u, v] (Amber Gold) */}
          {lenCross > 0.01 && (
            <g>
              <line x1={pO.x} y1={pO.y} x2={pCross.x} y2={pCross.y} stroke="#f59e0b" strokeWidth="3.5" />
              <circle cx={pCross.x} cy={pCross.y} r="6" fill="#f59e0b" stroke="white" strokeWidth="2" />
              <text x={pCross.x + 8} y={pCross.y - 6} fontSize="13" fill="#f59e0b" fontWeight="bold">
                [u⃗, v⃗] (⊥ u⃗, v⃗)
              </text>
            </g>
          )}

          {/* Drag hint indicator */}
          <g transform="translate(15, 25)" opacity="0.65">
            <rect width="145" height="34" rx="6" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
            <text x="8" y="16" fontSize="10" fill="var(--foreground)">Xoay: Yaw {yaw.toFixed(0)}°, Pitch {pitch.toFixed(0)}°</text>
            <text x="8" y="28" fontSize="9" fill="var(--muted-foreground)">👆 Kéo chuột trên hình để xoay</text>
          </g>
        </svg>

        {/* Quick Presets */}
        <div style={{marginTop: 12}}>
          <span className="small muted">Bộ vectơ mẫu:</span>
          <div className="control-row" style={{margin: '6px 0 0', gap: 8}}>
            <button
              className="secondary-btn small-btn"
              onClick={() => {
                setU({x: 2, y: 0, z: 0});
                setV({x: 0, y: 2, z: 0});
              }}
            >
              Trục vuông góc (i⃗, j⃗)
            </button>
            <button
              className="secondary-btn small-btn"
              onClick={() => {
                setU({x: 2, y: 0, z: 0});
                setV({x: 1, y: 1.732, z: 0});
              }}
            >
              Góc 60° chuẩn
            </button>
            <button
              className="secondary-btn small-btn"
              onClick={() => {
                setU({x: 2, y: 1, z: 2});
                setV({x: 1, y: 3, z: 0.5});
              }}
            >
              Không gian 3D
            </button>
          </div>
        </div>
      </section>

      {/* Numerical and formula controls */}
      <aside className="panel prose">
        <span className="tag">TÍNH TOÁN KHÔNG GIAN</span>

        <h3 style={{marginTop: 10, color: '#38bdf8'}}>Vectơ u⃗ = ({u.x}, {u.y}, {u.z})</h3>
        <div className="control-row" style={{margin: '4px 0 12px'}}>
          <NumberField label="x₁" value={u.x} onChange={x => setU(prev => ({...prev, x}))} min={-10} max={10} step={0.5} />
          <NumberField label="y₁" value={u.y} onChange={y => setU(prev => ({...prev, y}))} min={-10} max={10} step={0.5} />
          <NumberField label="z₁" value={u.z} onChange={z => setU(prev => ({...prev, z}))} min={-10} max={10} step={0.5} />
        </div>

        <h3 style={{color: '#2dd4bf'}}>Vectơ v⃗ = ({v.x}, {v.y}, {v.z})</h3>
        <div className="control-row" style={{margin: '4px 0 14px'}}>
          <NumberField label="x₂" value={v.x} onChange={x => setV(prev => ({...prev, x}))} min={-10} max={10} step={0.5} />
          <NumberField label="y₂" value={v.y} onChange={y => setV(prev => ({...prev, y}))} min={-10} max={10} step={0.5} />
          <NumberField label="z₂" value={v.z} onChange={z => setV(prev => ({...prev, z}))} min={-10} max={10} step={0.5} />
        </div>

        <div className="metric">
          <span>Độ dài |u⃗|</span>
          <strong>{fmt(lenU)}</strong>
        </div>

        <div className="metric">
          <span>Độ dài |v⃗|</span>
          <strong>{fmt(lenV)}</strong>
        </div>

        <div className="metric">
          <span>Tích vô hướng u⃗ · v⃗</span>
          <strong style={{color: dotProduct === 0 ? '#51cf66' : 'inherit'}}>
            {fmt(dotProduct)} {dotProduct === 0 ? '(Vuông góc!)' : ''}
          </strong>
        </div>

        <div className="metric">
          <span>Góc giữa hai vectơ θ</span>
          <strong>{angleDeg.toFixed(1)}° ({angleRad.toFixed(3)} rad)</strong>
        </div>

        <div className="metric highlight-metric" style={{marginTop: 10}}>
          <span>Tích có hướng [u⃗, v⃗]</span>
          <strong style={{color: '#f59e0b'}}>
            ({fmt(cross.x)}, {fmt(cross.y)}, {fmt(cross.z)})
          </strong>
        </div>

        <div className="metric">
          <span>Diện tích hình bình hành</span>
          <strong>{fmt(areaParallelogram)}</strong>
        </div>

        <div className="metric">
          <span>Diện tích tam giác ½|[u⃗, v⃗]|</span>
          <strong>{fmt(areaTriangle)}</strong>
        </div>

        <p className="small muted">
          Vectơ tích có hướng [u⃗, v⃗] luôn vuông góc với cả u⃗ và v⃗ (độ dài bằng diện tích hình bình hành dựng bởi hai vectơ).
        </p>
      </aside>
    </div>
  );
}
