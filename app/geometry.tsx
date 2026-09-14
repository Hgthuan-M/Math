'use client';
import {useState, useMemo} from 'react';
import {ArrowRight, Copy, Check, Search, Sparkles, BookOpen} from 'lucide-react';
import {geometryTopics, geometryFormulas} from '@/lib/geometry-content';
import type {Formula} from '@/lib/content';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {MathFormula, FormulaLegend, MathText} from './math';

export function CopyFormula({text}: {text: string}) {
  const [state, setState] = useState('');
  return (
    <div className="formula-copy">
      <button
        className="secondary-btn small-btn"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setState('Đã sao chép');
            setTimeout(() => setState(''), 2000);
          } catch {
            setState('Lỗi sao chép');
          }
        }}
      >
        {state.startsWith('Đã') ? <Check size={14} /> : <Copy size={14} />}
        {state || 'Sao chép'}
      </button>
    </div>
  );
}

const middleSubCategories = [
  {id: 'all', label: 'Tất cả (24)'},
  {id: 'triangles', label: '📐 Tam giác & Lượng giác (9)'},
  {id: 'quads', label: '🔲 Tứ giác phẳng (5)'},
  {id: 'circles', label: '⭕ Đường tròn (4)'},
  {id: 'solids', label: '📦 Khối không gian (6)'},
];

function getFormulaSubCategory(id: string): string {
  if (
    [
      'geo-angles',
      'geo-pythagoras',
      'geo-triangle-area',
      'geo-triangle-right-area',
      'geo-triangle-equilateral-area',
      'geo-right-triangle-relations',
      'geo-right-trig',
      'geo-similarity',
      'geo-thales',
    ].includes(id)
  ) {
    return 'triangles';
  }
  if (
    [
      'geo-square',
      'geo-rectangle',
      'geo-parallelogram',
      'geo-rhombus',
      'geo-trapezoid',
      'geo-quadrilaterals',
    ].includes(id)
  ) {
    return 'quads';
  }
  if (
    [
      'geo-circle-perimeter',
      'geo-circle-area',
      'geo-circle-arc-sector',
      'geo-circle',
      'geo-inscribed-angle',
    ].includes(id)
  ) {
    return 'circles';
  }
  if (
    [
      'geo-solid-cuboid',
      'geo-solid-cube',
      'geo-solid-cylinder',
      'geo-solid-cone',
      'geo-solid-sphere',
      'geo-solid-prism',
      'geo-solids',
    ].includes(id)
  ) {
    return 'solids';
  }
  return 'other';
}

/**
 * Clean, educational SVG illustrations with labeled dimensions for each geometric formula.
 */
export function GeometryIllustration({id}: {id: string}) {
  const strokeColor = '#5368e6';
  const fillColor = 'rgba(83, 104, 230, 0.12)';
  const altStroke = '#10b981';
  const dashColor = '#de9c4c';

  switch (id) {
    // 1. Hình vuông
    case 'geo-square':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình vuông cạnh a">
          <rect x="75" y="25" width="90" height="90" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" rx="2" />
          <path d="M75 37 H87 V25 M165 37 H153 V25 M75 103 H87 V115 M165 103 H153 V115" fill="none" stroke={strokeColor} strokeWidth="1.2" />
          <text x="120" y="132" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="700">a (đáy)</text>
          <text x="56" y="74" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="700">a</text>
          <text x="120" y="75" textAnchor="middle" fill={strokeColor} fontSize="14" fontWeight="bold">S = a²</text>
        </svg>
      );

    // 2. Hình chữ nhật
    case 'geo-rectangle':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình chữ nhật dài a, rộng b">
          <rect x="50" y="35" width="140" height="70" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" rx="2" />
          <path d="M50 47 H62 V35 M190 47 H178 V35 M50 93 H62 V105 M190 93 H178 V105" fill="none" stroke={strokeColor} strokeWidth="1.2" />
          <text x="120" y="125" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="700">a (chiều dài)</text>
          <text x="32" y="74" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="700">b</text>
          <text x="120" y="75" textAnchor="middle" fill={strokeColor} fontSize="14" fontWeight="bold">S = a · b</text>
        </svg>
      );

    // 3. Hình bình hành
    case 'geo-parallelogram':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình bình hành đáy a, chiều cao h">
          <polygon points="65,105 185,105 210,35 90,35" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <line x1="90" y1="35" x2="90" y2="105" stroke={dashColor} strokeWidth="2" strokeDasharray="5 4" />
          <path d="M90 95 H100 V105" fill="none" stroke={dashColor} strokeWidth="1.2" />
          <text x="125" y="125" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">a (đáy)</text>
          <text x="45" y="70" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">b</text>
          <text x="76" y="70" textAnchor="middle" fill={dashColor} fontSize="14" fontWeight="700">h</text>
        </svg>
      );

    // 4. Hình thoi
    case 'geo-rhombus':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình thoi hai đường chéo d1, d2">
          <polygon points="120,15 205,70 120,125 35,70" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <line x1="120" y1="15" x2="120" y2="125" stroke={altStroke} strokeWidth="2" strokeDasharray="4 3" />
          <line x1="35" y1="70" x2="205" y2="70" stroke={altStroke} strokeWidth="2" strokeDasharray="4 3" />
          <path d="M120 62 H128 V70" fill="none" stroke={altStroke} strokeWidth="1.2" />
          <text x="135" y="45" fill={altStroke} fontSize="13" fontWeight="700">d₁</text>
          <text x="165" y="65" fill={altStroke} fontSize="13" fontWeight="700">d₂</text>
          <text x="65" y="40" fill="currentColor" fontSize="14" fontWeight="700">a</text>
        </svg>
      );

    // 5. Hình thang
    case 'geo-trapezoid':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình thang đáy bé a, đáy lớn b, chiều cao h">
          <polygon points="50,110 195,110 160,35 85,35" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <line x1="85" y1="35" x2="85" y2="110" stroke={dashColor} strokeWidth="2" strokeDasharray="5 4" />
          <path d="M85 100 H95 V110" fill="none" stroke={dashColor} strokeWidth="1.2" />
          <text x="122" y="27" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">a (đáy bé)</text>
          <text x="122" y="128" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">b (đáy lớn)</text>
          <text x="73" y="75" textAnchor="middle" fill={dashColor} fontSize="14" fontWeight="700">h</text>
        </svg>
      );

    // 6. Diện tích tam giác thường
    case 'geo-triangle-area':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Tam giác có đáy a và chiều cao h">
          <polygon points="45,115 195,115 140,25" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <line x1="140" y1="25" x2="140" y2="115" stroke={dashColor} strokeWidth="2" strokeDasharray="5 4" />
          <path d="M140 105 H150 V115" fill="none" stroke={dashColor} strokeWidth="1.2" />
          <text x="120" y="132" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="700">a (đáy)</text>
          <text x="156" y="70" textAnchor="middle" fill={dashColor} fontSize="15" fontWeight="700">h</text>
        </svg>
      );

    // 7. Diện tích tam giác vuông & Pythagoras
    case 'geo-triangle-right-area':
    case 'geo-pythagoras':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Tam giác vuông cạnh a, b và huyền c">
          <polygon points="65,115 65,30 190,115" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <path d="M65 103 H77 V115" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <text x="48" y="75" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="700">a</text>
          <text x="125" y="132" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="700">b</text>
          <text x="140" y="65" textAnchor="middle" fill={strokeColor} fontSize="15" fontWeight="700">c (huyền)</text>
        </svg>
      );

    // 8. Tam giác đều
    case 'geo-triangle-equilateral-area':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Tam giác đều ba cạnh a, đường cao h">
          <polygon points="50,115 190,115 120,25" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <line x1="120" y1="25" x2="120" y2="115" stroke={dashColor} strokeWidth="2" strokeDasharray="5 4" />
          <path d="M120 105 H130 V115" fill="none" stroke={dashColor} strokeWidth="1.2" />
          <text x="120" y="132" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">a</text>
          <text x="75" y="65" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">a</text>
          <text x="165" y="65" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">a</text>
          <text x="135" y="75" fill={dashColor} fontSize="13" fontWeight="700">h</text>
        </svg>
      );

    // 9. Hệ thức lượng tam giác vuông
    case 'geo-right-triangle-relations':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hệ thức lượng trong tam giác vuông">
          <polygon points="40,115 200,115 95,35" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <line x1="95" y1="35" x2="95" y2="115" stroke={dashColor} strokeWidth="2" strokeDasharray="5 4" />
          <path d="M95 105 H105 V115" fill="none" stroke={dashColor} strokeWidth="1.2" />
          <text x="110" y="78" fill={dashColor} fontSize="14" fontWeight="700">h</text>
          <text x="65" y="130" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">c′</text>
          <text x="150" y="130" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">b′</text>
          <text x="60" y="65" fill="currentColor" fontSize="14" fontWeight="700">c</text>
          <text x="155" y="65" fill="currentColor" fontSize="14" fontWeight="700">b</text>
        </svg>
      );

    // 10. Góc & tổng ba góc
    case 'geo-angles':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Tổng ba góc trong tam giác bằng 180°">
          <polygon points="45,115 195,115 115,25" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <path d="M60 115 A20 20 0 0 0 54 100" fill="none" stroke={dashColor} strokeWidth="2" />
          <path d="M180 115 A20 20 0 0 1 184 102" fill="none" stroke={dashColor} strokeWidth="2" />
          <path d="M107 38 A20 20 0 0 0 125 38" fill="none" stroke={dashColor} strokeWidth="2" />
          <text x="115" y="55" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">A</text>
          <text x="72" y="110" fill="currentColor" fontSize="14" fontWeight="700">B</text>
          <text x="165" y="110" fill="currentColor" fontSize="14" fontWeight="700">C</text>
        </svg>
      );

    // 11. Tỉ số lượng giác nhọn
    case 'geo-right-trig':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Tỉ số lượng giác góc nhọn trong tam giác vuông">
          <polygon points="50,115 50,35 190,115" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <path d="M50 103 H62 V115" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <path d="M165 115 A25 25 0 0 0 160 98" fill="none" stroke={dashColor} strokeWidth="2" />
          <text x="150" y="108" fill={dashColor} fontSize="14" fontWeight="700">α</text>
          <text x="32" y="75" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">Đối</text>
          <text x="115" y="132" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">Kề</text>
          <text x="135" y="65" textAnchor="middle" fill={strokeColor} fontSize="13" fontWeight="700">Huyền</text>
        </svg>
      );

    // 12. Chu vi đường tròn
    case 'geo-circle-perimeter':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Chu vi đường tròn C = 2πr">
          <circle cx="120" cy="70" r="48" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="120" cy="70" r="3.5" fill={strokeColor} />
          <line x1="120" y1="70" x2="168" y2="70" stroke={altStroke} strokeWidth="2" />
          <text x="145" y="64" textAnchor="middle" fill={altStroke} fontSize="14" fontWeight="700">r</text>
          <text x="120" y="70" dx="-8" dy="4" fill="currentColor" fontSize="13">O</text>
          <text x="120" y="133" textAnchor="middle" fill={strokeColor} fontSize="13" fontWeight="bold">C = 2πr = πd</text>
        </svg>
      );

    // 13. Diện tích hình tròn
    case 'geo-circle-area':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Diện tích hình tròn S = πr²">
          <circle cx="120" cy="70" r="50" fill={fillColor} stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="120" cy="70" r="3.5" fill={strokeColor} />
          <line x1="120" y1="70" x2="155" y2="35" stroke={altStroke} strokeWidth="2" />
          <text x="145" y="50" fill={altStroke} fontSize="14" fontWeight="700">r</text>
          <text x="120" y="75" textAnchor="middle" fill={strokeColor} fontSize="14" fontWeight="bold">S = πr²</text>
        </svg>
      );

    // 14. Cung tròn & Quạt tròn
    case 'geo-circle-arc-sector':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình quạt tròn và cung tròn">
          <path d="M120 70 L170 70 A50 50 0 0 0 145 27 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <path d="M170 70 A50 50 0 0 0 145 27" fill="none" stroke={dashColor} strokeWidth="3.5" />
          <circle cx="120" cy="70" r="3.5" fill={strokeColor} />
          <text x="133" y="62" fill="currentColor" fontSize="12" fontWeight="700">n°</text>
          <text x="140" y="85" textAnchor="middle" fill={altStroke} fontSize="13" fontWeight="700">r</text>
          <text x="175" y="42" fill={dashColor} fontSize="14" fontWeight="700">l (cung)</text>
        </svg>
      );

    // 15. Hình hộp chữ nhật
    case 'geo-solid-cuboid':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình hộp chữ nhật ba kích thước a, b, c">
          <polygon points="60,110 145,110 145,55 60,55" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <polygon points="145,110 185,85 185,30 145,55" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <polygon points="60,55 100,30 185,30 145,55" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <line x1="60" y1="110" x2="100" y2="85" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="100" y1="85" x2="185" y2="85" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="100" y1="85" x2="100" y2="30" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="100" y="125" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">a (dài)</text>
          <text x="172" y="105" fill="currentColor" fontSize="13" fontWeight="700">b</text>
          <text x="46" y="85" fill="currentColor" fontSize="13" fontWeight="700">c (cao)</text>
        </svg>
      );

    // 16. Hình lập phương
    case 'geo-solid-cube':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình lập phương cạnh a">
          <polygon points="75,105 135,105 135,45 75,45" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <polygon points="135,105 165,80 165,20 135,45" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <polygon points="75,45 105,20 165,20 135,45" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <line x1="75" y1="105" x2="105" y2="80" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="105" y1="80" x2="165" y2="80" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="105" y1="80" x2="105" y2="20" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="105" y="120" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="700">a</text>
          <text x="62" y="75" fill="currentColor" fontSize="14" fontWeight="700">a</text>
          <text x="155" y="100" fill="currentColor" fontSize="14" fontWeight="700">a</text>
        </svg>
      );

    // 17. Hình trụ
    case 'geo-solid-cylinder':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình trụ bán kính r, chiều cao h">
          <ellipse cx="120" cy="35" rx="45" ry="14" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <path d="M75 35 V105 A45 14 0 0 0 165 105 V35" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <path d="M75 105 A45 14 0 0 1 165 105" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="120" y1="35" x2="165" y2="35" stroke={altStroke} strokeWidth="2" />
          <text x="142" y="30" textAnchor="middle" fill={altStroke} fontSize="13" fontWeight="700">r</text>
          <line x1="175" y1="35" x2="175" y2="105" stroke={dashColor} strokeWidth="2" strokeDasharray="4 3" />
          <text x="187" y="74" fill={dashColor} fontSize="13" fontWeight="700">h</text>
        </svg>
      );

    // 18. Hình nón
    case 'geo-solid-cone':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình nón bán kính r, cao h, đường sinh l">
          <path d="M120 20 L75 105 A45 14 0 0 0 165 105 Z" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <path d="M75 105 A45 14 0 0 1 165 105" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="120" y1="20" x2="120" y2="105" stroke={dashColor} strokeWidth="2" strokeDasharray="4 3" />
          <line x1="120" y1="105" x2="165" y2="105" stroke={altStroke} strokeWidth="2" />
          <text x="142" y="120" textAnchor="middle" fill={altStroke} fontSize="13" fontWeight="700">r</text>
          <text x="110" y="65" fill={dashColor} fontSize="13" fontWeight="700">h</text>
          <text x="152" y="60" fill={strokeColor} fontSize="13" fontWeight="700">l</text>
        </svg>
      );

    // 19. Hình cầu
    case 'geo-solid-sphere':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình cầu tâm O, bán kính r">
          <circle cx="120" cy="70" r="48" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <ellipse cx="120" cy="70" rx="48" ry="14" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="5 3" />
          <line x1="120" y1="70" x2="154" y2="36" stroke={altStroke} strokeWidth="2" />
          <circle cx="120" cy="70" r="3" fill={strokeColor} />
          <text x="120" y="70" dx="-8" dy="4" fill="currentColor" fontSize="12">O</text>
          <text x="144" y="50" fill={altStroke} fontSize="13" fontWeight="700">r</text>
        </svg>
      );

    // 20. Hình lăng trụ đứng
    case 'geo-solid-prism':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình lăng trụ đứng đáy S, chiều cao h">
          <polygon points="70,40 130,25 155,50" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <polygon points="70,110 130,95 155,120" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <line x1="70" y1="40" x2="70" y2="110" stroke={strokeColor} strokeWidth="2" />
          <line x1="155" y1="50" x2="155" y2="120" stroke={strokeColor} strokeWidth="2" />
          <line x1="130" y1="25" x2="130" y2="95" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="110" y="42" fill={strokeColor} fontSize="12" fontWeight="bold">S_đáy</text>
          <text x="168" y="85" fill={dashColor} fontSize="14" fontWeight="700">h</text>
        </svg>
      );

    // 21. Khối chóp
    case 'geo-pyramid':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Hình chóp đỉnh S, đáy B, chiều cao h">
          <polygon points="65,105 145,115 185,95 105,85" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="65" y1="105" x2="145" y2="115" stroke={strokeColor} strokeWidth="2" />
          <line x1="145" y1="115" x2="185" y2="95" stroke={strokeColor} strokeWidth="2" />
          <line x1="125" y1="20" x2="65" y2="105" stroke={strokeColor} strokeWidth="2" />
          <line x1="125" y1="20" x2="145" y2="115" stroke={strokeColor} strokeWidth="2" />
          <line x1="125" y1="20" x2="185" y2="95" stroke={strokeColor} strokeWidth="2" />
          <line x1="125" y1="20" x2="105" y2="85" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="125" y1="20" x2="125" y2="100" stroke={dashColor} strokeWidth="2" strokeDasharray="4 3" />
          <text x="125" y="15" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">S</text>
          <text x="135" y="65" fill={dashColor} fontSize="13" fontWeight="700">h</text>
          <text x="125" y="125" textAnchor="middle" fill={strokeColor} fontSize="12" fontWeight="bold">B (đáy)</text>
        </svg>
      );

    // 22. Thales
    case 'geo-thales':
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Định lý Thales DE song song BC">
          <polygon points="45,115 195,115 120,25" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <line x1="75" y1="75" x2="165" y2="75" stroke={altStroke} strokeWidth="2.5" />
          <text x="120" y="20" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700">A</text>
          <text x="65" y="73" fill={altStroke} fontSize="13" fontWeight="700">D</text>
          <text x="172" y="73" fill={altStroke} fontSize="13" fontWeight="700">E</text>
          <text x="35" y="120" fill="currentColor" fontSize="13" fontWeight="700">B</text>
          <text x="200" y="120" fill="currentColor" fontSize="13" fontWeight="700">C</text>
          <text x="120" y="93" textAnchor="middle" fill={altStroke} fontSize="12" fontWeight="bold">DE ∥ BC</text>
        </svg>
      );

    // Default: Vector or geometric fallback
    default:
      return (
        <svg viewBox="0 0 240 140" role="img" aria-label="Minh họa hình học">
          <polygon points="55,110 185,110 120,35" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
          <circle cx="120" cy="70" r="30" fill="none" stroke={altStroke} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="120" y="125" textAnchor="middle" fill="currentColor" fontSize="12">Minh họa hình học</text>
        </svg>
      );
  }
}

export function GeometryDiagram({kind}: {kind?: string}) {
  if (!kind) return null;
  return (
    <div className="geometry-illustration-box" style={{margin: '12px 0'}}>
      <GeometryIllustration id={kind} />
    </div>
  );
}

export function Geometry({
  openLesson,
  onQuiz,
}: {
  openLesson: (id: string) => void;
  onQuiz: (topic: string) => void;
}) {
  const [level, setLevel] = useState('geometry-middle');
  const [middleSub, setMiddleSub] = useState('all');
  const [search, setSearch] = useState('');

  const currentTopic = geometryTopics.find((t) => t.id === level) || geometryTopics[0];

  const filteredFormulas = useMemo(() => {
    return geometryFormulas.filter((f) => {
      if (f.topic !== level) return false;
      if (level === 'geometry-middle' && middleSub !== 'all') {
        const sub = getFormulaSubCategory(f.id);
        if (sub !== middleSub) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchTheory = f.theory.toLowerCase().includes(q);
        const matchExample = f.example.toLowerCase().includes(q);
        return matchName || matchTheory || matchExample;
      }
      return true;
    });
  }, [level, middleSub, search]);

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">TỪ HÌNH VẼ ĐẾN LẬP LUẬN & TÍNH TOÁN</p>
        <h1>Hình học & Công thức tính</h1>
        <p>
          Tách riêng từng hình và từng công thức tính (Tam giác, Hình vuông, Chữ nhật, Bình hành, Hình thoi, Hình thang, Hình tròn, Trụ, Nón, Cầu...), kèm hình minh họa trực quan và ví dụ số học chi tiết từng bước.
        </p>
      </div>

      <Tabs value={level} onValueChange={setLevel}>
        <TabsList aria-label="Cấp học hình học" className="geometry-levels">
          {geometryTopics.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.level}
            </TabsTrigger>
          ))}
        </TabsList>

        <section className="panel geometry-intro" style={{marginTop: 20}}>
          <div>
            <span className={'tag ' + currentTopic.color}>{currentTopic.level}</span>
            <h2>{currentTopic.name}</h2>
            <p>{currentTopic.description}</p>
          </div>
          <button className="primary-btn" onClick={() => onQuiz(currentTopic.id)}>
            Luyện tập trắc nghiệm nhóm này <ArrowRight size={17} />
          </button>
        </section>

        <div className="geometry-filter-row">
          {level === 'geometry-middle' ? (
            <div className="geometry-subchips">
              {middleSubCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`geometry-subchip ${middleSub === cat.id ? 'active' : ''}`}
                  onClick={() => setMiddleSub(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="muted small">
              Hiển thị {filteredFormulas.length} công thức {currentTopic.name}
            </div>
          )}

          <div className="geometry-search">
            <Search size={16} className="muted" />
            <input
              type="text"
              placeholder="Tìm hình: thoi, thang, trụ, nón..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="text-btn small"
                onClick={() => setSearch('')}
                style={{padding: '0 4px'}}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredFormulas.length === 0 ? (
          <div className="panel empty-state" style={{marginTop: 20}}>
            <Search size={32} />
            <h3>Không tìm thấy công thức phù hợp</h3>
            <p className="muted">Thử từ khóa khác hoặc xóa bộ lọc để xem toàn bộ công thức.</p>
            <button
              className="secondary-btn"
              onClick={() => {
                setSearch('');
                setMiddleSub('all');
              }}
            >
              Xem tất cả công thức
            </button>
          </div>
        ) : (
          <div className="formula-grid">
            {filteredFormulas.map((f, i) => (
              <article key={f.id} className="geometry-card-dedicated">
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span className="eyebrow">
                      BÀI {i + 1} · {currentTopic.level}
                    </span>
                    <CopyFormula text={f.unicodeMath || f.latex} />
                  </div>

                  <h3>{f.name}</h3>

                  {/* MINH HỌA HÌNH HỌC TRỰC QUAN CHO TỪNG CÔNG THỨC */}
                  <div className="geometry-illustration-box">
                    <GeometryIllustration id={f.id} />
                  </div>

                  {/* CÔNG THỨC MATHML */}
                  <div className="math-render">
                    <MathFormula latex={f.latex} unicodeMath={f.unicodeMath} />
                  </div>

                  <FormulaLegend id={f.id} />

                  <div style={{margin: '12px 0 16px', fontSize: 14.5, lineHeight: 1.7}}>
                    <MathText text={f.theory} />
                  </div>

                  {/* DEDICATED EXAMPLE BOX FOR THIS EXACT FORMULA */}
                  <div className="geometry-dedicated-example">
                    <span className="geometry-example-tag">
                      <Sparkles size={14} /> Ví dụ minh họa có số cụ thể
                    </span>
                    <p className="geometry-example-problem">
                      <MathText text={f.example} />
                    </p>
                    {f.exampleSolution && (
                      <div className="geometry-example-solution">
                        <strong style={{color: 'var(--foreground)', display: 'block', marginBottom: 6}}>
                          Lời giải từng bước:
                        </strong>
                        <MathText text={f.exampleSolution} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="geometry-card-actions">
                  <span className="muted small">
                    {f.condition ? `Điều kiện: ${f.condition}` : 'Hình học phẳng'}
                  </span>
                  <button className="text-btn" onClick={() => openLesson(f.id)}>
                    <BookOpen size={15} /> Mở bài học chi tiết & Quiz <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Tabs>

      <p className="small geometry-note" style={{marginTop: 24}}>
        Mỗi công thức hình học được đi kèm hình vẽ minh họa trực quan và ví dụ số học thực tế, giúp người học dễ dàng nhận diện đại lượng, hiểu rõ công thức và vận dụng tính toán chính xác.
      </p>
    </>
  );
}
