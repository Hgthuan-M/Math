'use client';
import {useState} from 'react';
import {ArrowRight,Copy,Check} from 'lucide-react';
import {geometryTopics,geometryFormulas} from '@/lib/geometry-content';
import type {Formula} from '@/lib/content';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import {MathFormula,FormulaLegend} from './math';

export function CopyFormula({text}:{text:string}) {
 const [state,setState]=useState('');
 return <div className="formula-copy"><button className="secondary-btn" onClick={async()=>{try{await navigator.clipboard.writeText(text);setState('Đã sao chép công thức.')}catch{setState('Chưa sao chép được. Bạn có thể bôi đen công thức rồi nhấn Ctrl+C.')}}}>{state.startsWith('Đã')?<Check size={16}/>:<Copy size={16}/>}Sao chép UnicodeMath</button><span role="status">{state}</span></div>;
}

export function Geometry({openLesson,onQuiz}:{openLesson:(id:string)=>void;onQuiz:(topic:string)=>void}) {
 return <><div className="page-heading"><p className="eyebrow">TỪ HÌNH VẼ ĐẾN LẬP LUẬN</p><h1>Hình học</h1><p>30 bài nền tảng từ THCS, THPT đến đại học cơ bản. Học qua giả thiết, công thức, ví dụ và bài tự luyện.</p></div>
 <Tabs defaultValue="geometry-middle"><TabsList aria-label="Cấp học hình học" className="geometry-levels">{geometryTopics.map(t=><TabsTrigger key={t.id} value={t.id}>{t.level}</TabsTrigger>)}</TabsList>
 {geometryTopics.map(t=><TabsContent key={t.id} value={t.id}><section className="panel geometry-intro"><div><span className={'tag '+t.color}>{t.level}</span><h2>{t.name}</h2><p>{t.description}</p></div><button className="primary-btn" onClick={()=>onQuiz(t.id)}>Luyện tập nhóm này <ArrowRight size={17}/></button></section><div className="formula-grid">{geometryFormulas.filter(f=>f.topic===t.id).map((f,i)=><article key={f.id} className="panel formula-card"><span className="eyebrow">BÀI {i+1} · {t.level}</span><button className="formula-open" onClick={()=>openLesson(f.id)}><h3>{f.name}</h3><MathFormula latex={f.latex} unicodeMath={f.unicodeMath}/><FormulaLegend id={f.id}/><p>{f.theory}</p><span className="text-btn">Mở bài học <ArrowRight size={16}/></span></button></article>)}</div></TabsContent>)}
 </Tabs><p className="small geometry-note">Phạm vi đại học gồm hình học giải tích, đại số tuyến tính ứng dụng và nhập môn hình học vi phân; chưa bao quát toàn bộ các học phần hình học chuyên sâu.</p></>;
}

export function GeometryDiagram({kind}:{kind:Formula['diagram']}) {
 if(!kind)return null;
 const title:Record<string,string>={'right-triangle':'Tam giác vuông với hai cạnh a, b và cạnh huyền c','triangle-height':'Tam giác có đáy a và chiều cao h','circle':'Đường tròn tâm O, bán kính r','solid':'Khối hộp có ba kích thước a, b, h','vectors':'Hai vector u và v cùng gốc','curve':'Đường cong và tiếp tuyến tại P'};
 return <figure className="geometry-diagram"><svg viewBox="0 0 420 230" role="img" aria-label={title[kind]}>
 <g fill="none" stroke="currentColor" strokeWidth="2.5">
 {kind==='right-triangle'&&<><path d="M70 180V45L345 180Z"/><path d="M70 160H90V180"/><g fill="currentColor" stroke="none" fontSize="18"><text x="43" y="112">a</text><text x="195" y="206">b</text><text x="222" y="98">c</text></g></>}
 {kind==='triangle-height'&&<><path d="M55 180L190 40L360 180Z"/><path d="M190 40V180" strokeDasharray="6 5"/><path d="M190 162H208V180"/><g fill="currentColor" stroke="none" fontSize="18"><text x="210" y="208">a</text><text x="198" y="110">h</text></g></>}
 {kind==='circle'&&<><circle cx="205" cy="110" r="80"/><path d="M205 110L270 64"/><circle cx="205" cy="110" r="3"/><g fill="currentColor" stroke="none" fontSize="18"><text x="185" y="132">O</text><text x="242" y="78">r</text></g></>}
 {kind==='solid'&&<><path d="M95 185V80H290V185ZM95 80L155 40H345V145L290 185M290 80L345 40"/><path d="M95 185L155 145V40M155 145H345" strokeDasharray="5 5"/><g fill="currentColor" stroke="none" fontSize="18"><text x="183" y="210">a</text><text x="324" y="184">b</text><text x="68" y="140">h</text></g></>}
 {kind==='vectors'&&<><path d="M70 185L335 135M70 185L180 40"/><path d="M321 129L335 135L326 146M164 46L180 40L178 57"/><g fill="currentColor" stroke="none" fontSize="18"><text x="205" y="145">u</text><text x="118" y="95">v</text><text x="48" y="205">O</text></g></>}
 {kind==='curve'&&<><path d="M45 190C100 180 130 65 215 100S325 180 375 40"/><path d="M140 67L285 130" strokeDasharray="6 5"/><circle cx="215" cy="100" r="4"/><g fill="currentColor" stroke="none" fontSize="18"><text x="210" y="85">P</text><text x="265" y="116">Tiếp tuyến</text></g></>}
 </g></svg><figcaption>{title[kind]}. Hình minh họa, không theo tỉ lệ.</figcaption></figure>;
}
