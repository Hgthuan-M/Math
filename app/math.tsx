'use client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {useMemo,useState} from 'react';
import {Copy,Check,Code2} from 'lucide-react';

/**
 * Render standard W3C MathML markup string with KaTeX scalable font layout (htmlAndMathml).
 * This ensures determinants and matrices stretch vertically across all rows properly.
 */
export function toMathML(latex: string, block = false): string {
  if (!latex || !latex.trim()) return '';
  try {
    return katex.renderToString(latex.trim(), {
      throwOnError: false,
      displayMode: block,
      output: 'htmlAndMathml',
      trust: false,
    });
  } catch {
    return '';
  }
}

/**
 * Generate pure MathML XML (<math>...</math>) for clipboard copy and external documents.
 */
export function toPureMathML(latex: string, block = false): string {
  if (!latex || !latex.trim()) return '';
  try {
    return katex.renderToString(latex.trim(), {
      throwOnError: false,
      displayMode: block,
      output: 'mathml',
      trust: false,
    });
  } catch {
    return '';
  }
}

/**
 * Extract clean pure MathML XML (<math ...>...</math>) without external span wrapper.
 */
export function extractPureMathML(mathmlHtml: string): string {
  const match = mathmlHtml.match(/<math[\s\S]*?<\/math>/i);
  return match ? match[0] : mathmlHtml;
}

/**
 * Core component to render formulas using native MathML format.
 */
export function MathFormula({
  latex,
  unicodeMath,
  block = true,
  className = '',
}: {
  latex: string;
  unicodeMath?: string;
  block?:boolean;
  className?: string;
}) {
  const mathml = useMemo(() => toMathML(latex, block), [latex, block]);

  if (!mathml && unicodeMath) {
    return <span className={block ? `unicode-math block ${className}` : `unicode-math ${className}`}>{unicodeMath}</span>;
  }

  return (
    <span
      className={block ? `math-render block ${className}` : `math-render inline ${className}`}
      dangerouslySetInnerHTML={{__html: mathml}}
    />
  );
}

/**
 * Sanitize common unicode math symbols and expressions into LaTeX syntax.
 */
export function sanitizeToLatex(str: string): string {
  let s = str
    // 1. Convert 2D array representation [[a, b], [c, d]] to pmatrix
    .replace(/\[\[([\s\S]+?)\]\]/g, (_m, inner) => {
      const rows = inner.split(/\],\s*\[/);
      const latexRows = rows.map((r: string) =>
        r.split(',').map((c: string) => c.trim()).join(' & ')
      ).join(' \\\\ ');
      return `\\begin{pmatrix} ${latexRows} \\end{pmatrix}`;
    })
    // 2. Linear algebra functions
    .replace(/\bdet\(([a-zA-Z0-9_\^\{\}\s\+\-]+?)\)/g, '\\det($1)')
    .replace(/\btr\(([a-zA-Z0-9_\^\{\}\s\+\-]+?)\)/g, '\\operatorname{tr}($1)')
    .replace(/\badj\(([a-zA-Z0-9_\^\{\}\s\+\-]+?)\)/g, '\\operatorname{adj}($1)')
    .replace(/\brank\(([a-zA-Z0-9_\^\{\}\s\+\-]+?)\)/g, '\\operatorname{rank}($1)')
    // Transpose and inverse
    .replace(/\(([A-Za-z]+)\)ᵀ/g, '($1)^T')
    .replace(/([A-Za-z])ᵀ/g, '$1^T')
    .replace(/\(([A-Za-z]+)\)⁻¹/g, '($1)^{-1}')
    .replace(/([A-Za-z])⁻¹/g, '$1^{-1}')
    // Common subscripts (e.g. a11 -> a_{11}, c12 -> c_{12})
    .replace(/\b([a-zA-Z])([0-9])([0-9])\b/g, '$1_{$2$3}')
    // 3. Mathematical superscripts and subscripts
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')
    .replace(/ⁿ/g, '^n')
    .replace(/₁/g, '_1')
    .replace(/₂/g, '_2')
    .replace(/₃/g, '_3')
    .replace(/₄/g, '_4')
    .replace(/ᵢ/g, '_i')
    .replace(/ⱼ/g, '_j')
    .replace(/ₙ/g, '_n')
    .replace(/×/g, ' \\times ')
    .replace(/−/g, ' - ')
    .replace(/·/g, ' \\cdot ')
    .replace(/±/g, ' \\pm ')
    .replace(/≠/g, ' \\neq ')
    .replace(/≤/g, ' \\le ')
    .replace(/≥/g, ' \\ge ')
    .replace(/≈/g, ' \\approx ')
    .replace(/∞/g, ' \\infty ')
    .replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/√([0-9a-zA-Z]+)/g, '\\sqrt{$1}')
    .replace(/π/g, ' \\pi ')
    .replace(/θ/g, ' \\theta ')
    .replace(/Δ/g, ' \\Delta ')
    .replace(/λ/g, ' \\lambda ')
    .replace(/σ/g, ' \\sigma ')
    .replace(/μ/g, ' \\mu ')
    .replace(/ℝ/g, ' \\mathbb{R} ')
    .replace(/ℤ/g, ' \\mathbb{Z} ')
    .replace(/⇒/g, ' \\implies ')
    .replace(/⇔/g, ' \\iff ');

  return s;
}

type TextPart =
  | { type: 'text'; content: string }
  | { type: 'mathml'; content: string; raw: string; block: boolean };

/**
 * Parse any string containing regular text and math, converting formulas to MathML.
 */
export function parseTextToMathML(text: string): TextPart[] {
  if (!text) return [];

  // 1. First, check for explicit $...$ or $$...$$ delimiters
  const tokenRegex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;
  const rawParts: Array<{ type: 'text'; content: string } | { type: 'math'; latex: string; block: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      rawParts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      rawParts.push({ type: 'math', latex: token.slice(2, -2), block: true });
    } else if (token.startsWith('\\[') && token.endsWith('\\]')) {
      rawParts.push({ type: 'math', latex: token.slice(2, -2), block: true });
    } else if (token.startsWith('\\(') && token.endsWith('\\)')) {
      rawParts.push({ type: 'math', latex: token.slice(2, -2), block: false });
    } else {
      rawParts.push({ type: 'math', latex: token.slice(1, -1), block: false });
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    rawParts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  // 2. For plain text parts, recognize equation clauses (e.g. "c² = 3² + 4² = 25")
  const result: TextPart[] = [];
  for (const p of rawParts) {
    if (p.type === 'math') {
      const mml = toMathML(p.latex, p.block);
      if (mml) {
        result.push({ type: 'mathml', content: mml, raw: p.latex, block: p.block });
      } else {
        result.push({ type: 'text', content: p.latex });
      }
      continue;
    }

    const t = p.content;
    // Check if line has "Prefix: MathExpression" (e.g. "• Thay số: c² = 3² + 4² = 25.")
    const colonMatch = t.match(/^([^:]*:\s*)([a-zA-Z0-9_\(\)\{\}\[\]\.,\s\+\-−×÷\/\^²³⁴ⁿ₁₂₃ᵢⱼₙ±=<>≤≥√πθΔ|λσ]+?)([\.;]?\s*)$/);
    if (colonMatch && /[=+\-−×÷\^²³√]/.test(colonMatch[2]) && colonMatch[2].length >= 3 && !/[a-zA-Z]{6,}/.test(colonMatch[2])) {
      if (colonMatch[1]) result.push({ type: 'text', content: colonMatch[1] });
      const latex = sanitizeToLatex(colonMatch[2].trim());
      const mml = toMathML(latex, false);
      if (mml) {
        result.push({ type: 'mathml', content: mml, raw: colonMatch[2], block: false });
      } else {
        result.push({ type: 'text', content: colonMatch[2] });
      }
      if (colonMatch[3]) result.push({ type: 'text', content: colonMatch[3] });
    } else {
      // Check for standalone equations like "det(A) = 3 × 4 − 2 × 1 = 10"
      const eqMatch = t.match(/^(\s*)([a-zA-Z0-9_\(\)\{\}\[\]\.,\s\+\-−×÷\/\^²³⁴ⁿ₁₂₃ᵢⱼₙ±=<>≤≥√πθΔ|λσ]+?=[a-zA-Z0-9_\(\)\{\}\[\]\.,\s\+\-−×÷\/\^²³⁴ⁿ₁₂₃ᵢⱼₙ±=<>≤≥√πθΔ|λσ]+?)([\.;]?\s*)$/);
      if (eqMatch && !/[a-zA-Z]{5,}/.test(eqMatch[2])) {
        if (eqMatch[1]) result.push({ type: 'text', content: eqMatch[1] });
        const latex = sanitizeToLatex(eqMatch[2].trim());
        const mml = toMathML(latex, false);
        if (mml) {
          result.push({ type: 'mathml', content: mml, raw: eqMatch[2], block: false });
        } else {
          result.push({ type: 'text', content: eqMatch[2] });
        }
        if (eqMatch[3]) result.push({ type: 'text', content: eqMatch[3] });
      } else {
        result.push({ type: 'text', content: t });
      }
    }
  }

  return result;
}

function renderFormattedText(str: string) {
  // Support inline **bold** and *italic*
  const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**') && seg.length >= 4) {
      return <strong key={i}>{seg.slice(2, -2)}</strong>;
    }
    if (seg.startsWith('*') && seg.endsWith('*') && seg.length >= 2) {
      return <em key={i}>{seg.slice(1, -1)}</em>;
    }
    return seg;
  });
}

/**
 * Universal component that renders text with all mathematical formulas transformed into MathML.
 */
export function MathText({text, className = ''}: {text: string; className?: string}) {
  const parts = useMemo(() => parseTextToMathML(text), [text]);

  if (!parts.length) return null;

  return (
    <span className={className}>
      {parts.map((p, idx) => {
        if (p.type === 'text') {
          return <span key={idx}>{renderFormattedText(p.content)}</span>;
        }
        return (
          <span
            key={idx}
            className={p.block ? 'mathml-block' : 'mathml-inline'}
            dangerouslySetInnerHTML={{__html: p.content}}
          />
        );
      })}
    </span>
  );
}

/**
 * Component to copy MathML markup code to clipboard.
 */
export function CopyMathMLButton({latex, label = 'Sao chép MathML'}: {latex: string; label?: string}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const rawMathML = extractPureMathML(toPureMathML(latex, true));
    try {
      await navigator.clipboard.writeText(rawMathML);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  }

  return (
    <button
      className="secondary-btn small-btn"
      onClick={handleCopy}
      title="Sao chép mã chuẩn W3C MathML để dán vào Word, tài liệu khoa học hoặc HTML"
      style={{display:'inline-flex',alignItems:'center',gap:5}}
    >
      {copied ? <Check size={14} style={{color:'#29a393'}}/> : <Code2 size={14}/>}
      <span>{copied ? 'Đã chép MathML!' : label}</span>
    </button>
  );
}

const legends: Record<string, string> = {
  'geo-triangle-right-area': 'a, b: hai cạnh góc vuông · S: diện tích',
  'geo-triangle-equilateral-area': 'a: cạnh tam giác đều · h: chiều cao · S: diện tích',
  'geo-right-triangle-relations': 'h: đường cao · b\', c\': hình chiếu hai cạnh góc vuông lên cạnh huyền a',
  'geo-square': 'a: cạnh hình vuông · P: chu vi · S: diện tích',
  'geo-rectangle': 'a: chiều dài · b: chiều rộng · P: chu vi · S: diện tích',
  'geo-parallelogram': 'a: cạnh đáy · b: cạnh bên · h: chiều cao tương ứng',
  'geo-rhombus': 'a: độ dài cạnh · d₁, d₂: hai đường chéo vuông góc',
  'geo-trapezoid': 'a, b: độ dài hai đáy song song · h: chiều cao vuông góc',
  'geo-circle-perimeter': 'r: bán kính · d: đường kính · C: chu vi',
  'geo-circle-area': 'r: bán kính · S: diện tích hình tròn',
  'geo-circle-arc-sector': 'l: độ dài cung n° · S_quat: diện tích hình quạt tròn bán kính r góc n°',
  'geo-solid-cuboid': 'a, b, c: ba kích thước dài, rộng, cao · V: thể tích · S_tp: diện tích toàn phần',
  'geo-solid-cube': 'a: độ dài cạnh · V: thể tích · S_tp: diện tích toàn phần (6 mặt)',
  'geo-solid-cylinder': 'r: bán kính đáy · h: chiều cao · V: thể tích · S_xq: diện tích xung quanh',
  'geo-solid-cone': 'r: bán kính đáy · h: chiều cao · l: đường sinh · S_xq: diện tích xung quanh',
  'geo-solid-sphere': 'r: bán kính cầu · V: thể tích khối cầu · S: diện tích mặt cầu',
  'geo-solid-prism': 'S_day: diện tích mặt đáy · h: chiều cao lăng trụ đứng',
  'geo-quadrilaterals': 'HCN: hình chữ nhật · HBH: hình bình hành · HT: hình thang',
  'geo-solids': 'hop: hộp chữ nhật · tru: hình trụ · non: hình nón · cau: hình cầu',
  'geo-pyramid': 'LT: lăng trụ · C: hình chóp',
  'geo-triple': 'hop: hình hộp · TD: tứ diện',
};

export function FormulaLegend({id}: {id: string}) {
  return legends[id] ? <small className="formula-legend">{legends[id]}</small> : null;
}
