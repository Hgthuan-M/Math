'use client';
import {useState} from 'react';
import {Tabs,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {MathFormula} from './math';
import {NumberField,fmt} from './labs';

type Shape='triangle'|'rectangle'|'circle'|'cylinder';
const names:Record<Shape,string>={triangle:'Tam giác',rectangle:'Hình chữ nhật',circle:'Hình tròn',cylinder:'Hình trụ'};
const latex:Record<Shape,string>={triangle:String.raw`S=\frac{ah}{2}`,rectangle:String.raw`S=ab`,circle:String.raw`S=\pi r^2`,cylinder:String.raw`V=\pi r^2h`};

function ShapePicture({shape,a,b}:{shape:Shape;a:number;b:number}){
 const label=shape==='circle'?`Hình tròn bán kính ${fmt(a)} cm`:shape==='cylinder'?`Hình trụ bán kính ${fmt(a)} cm và chiều cao ${fmt(b)} cm`:shape==='triangle'?`Tam giác đáy ${fmt(a)} cm, chiều cao ${fmt(b)} cm`:`Hình chữ nhật dài ${fmt(a)} cm, rộng ${fmt(b)} cm`;
 const w=shape==='triangle'||shape==='rectangle'?Math.max(105,Math.min(255,185*a/Math.max(a,b))):170;
 const h=shape==='triangle'||shape==='rectangle'?Math.max(85,Math.min(170,145*b/Math.max(a,b))):150;
 const x=175-w/2,y=195-h;
 return <figure className="geometry-calc-figure"><svg viewBox="0 0 350 240" role="img" aria-label={label}>
  {shape==='triangle'&&<><path d={`M${x} 195L${x+w*.58} ${y}L${x+w} 195Z`} className="shape-fill"/><path d={`M${x+w*.58} ${y}V195`} className="shape-dash"/><path d={`M${x+w*.58} 181h14v14`} className="shape-right"/><text x="176" y="220" textAnchor="middle">a = {fmt(a)} cm</text><text x={x+w*.58+17} y={y+h/2}>h = {fmt(b)} cm</text></>}
  {shape==='rectangle'&&<><rect x={x} y={y} width={w} height={h} className="shape-fill"/><text x="175" y="220" textAnchor="middle">a = {fmt(a)} cm</text><text x={Math.max(7,x-5)} y={y+h/2} textAnchor="end">b = {fmt(b)} cm</text></>}
  {shape==='circle'&&<><circle cx="175" cy="115" r="78" className="shape-fill"/><circle cx="175" cy="115" r="3" fill="currentColor"/><path d="M175 115L251 98" className="shape-dash"/><text x="210" y="92">r = {fmt(a)} cm</text></>}
  {shape==='cylinder'&&<><path d="M95 63V179Q175 221 255 179V63" className="shape-fill"/><ellipse cx="175" cy="63" rx="80" ry="25" className="shape-fill"/><path d="M175 63L251 63" className="shape-dash"/><text x="196" y="55">r = {fmt(a)} cm</text><text x="268" y="126">h = {fmt(b)} cm</text></>}
 </svg><figcaption>Hình cập nhật theo số liệu nhập; chỉ minh họa, không dùng để đo tỉ lệ.</figcaption></figure>;
}

export function GeometryCalculator(){
 const [shape,setShape]=useState<Shape>('triangle'),[a,setA]=useState(8),[b,setB]=useState(5);
 const result=shape==='triangle'?a*b/2:shape==='rectangle'?a*b:shape==='circle'?Math.PI*a*a:Math.PI*a*a*b;
 const name=shape==='cylinder'?'Thể tích':'Diện tích';
 const substituted=shape==='triangle'?String.raw`S=\frac{${a}\times${b}}{2}=${fmt(result)}`:shape==='rectangle'?String.raw`S=${a}\times${b}=${fmt(result)}`:shape==='circle'?String.raw`S=\pi\times${a}^2\approx${fmt(result)}`:String.raw`V=\pi\times${a}^2\times${b}\approx${fmt(result)}`;
 return <section className="panel geometry-calc"><div className="section-title"><div><span className="tag">HÌNH HỌC TƯƠNG TÁC</span><h2>Tính và xem hình</h2></div></div><Tabs value={shape} onValueChange={v=>setShape(v as Shape)}><TabsList aria-label="Chọn hình để tính" className="geometry-calc-tabs">{(Object.keys(names) as Shape[]).map(s=><TabsTrigger key={s} value={s}>{names[s]}</TabsTrigger>)}</TabsList><TabsContent value={shape}><div className="geometry-calc-grid"><div className="geometry-calc-controls"><p>Nhập kích thước theo xăng-ti-mét. Hình và kết quả sẽ đổi ngay.</p><div className="control-row"><NumberField label={shape==='triangle'?'Đáy a (cm)':shape==='rectangle'?'Chiều dài a (cm)':'Bán kính r (cm)'} value={a} onChange={setA} min={0.01} max={100000} step={0.1}/>{shape!=='circle'&&<NumberField label={shape==='rectangle'?'Chiều rộng b (cm)':'Chiều cao h (cm)'} value={b} onChange={setB} min={0.01} max={100000} step={0.1}/>}</div><div className="geometry-calc-formula"><span>Công thức</span><MathFormula latex={latex[shape]}/><span>Thay số</span><MathFormula latex={substituted}/></div><div className="metric"><span>{name}</span><strong>{fmt(result)} {shape==='cylinder'?'cm³':'cm²'}</strong></div></div><ShapePicture shape={shape} a={a} b={b}/></div></TabsContent></Tabs></section>;
}
