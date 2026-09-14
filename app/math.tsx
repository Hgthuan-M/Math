'use client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {useMemo} from 'react';
export function MathFormula({latex,unicodeMath,block=true}:{latex:string;unicodeMath?:string;block?:boolean}){
 const html=useMemo(()=>latex.trim()?katex.renderToString(latex,{throwOnError:false,displayMode:block,output:'htmlAndMathml',trust:false}):'',[latex,block]);
 return html?<span className={block?'math-render block':'math-render'} dangerouslySetInnerHTML={{__html:html}}/>:<span className={block?'unicode-math block':'unicode-math'}>{unicodeMath}</span>;
}

const legends:Record<string,string>={
 'geo-quadrilaterals':'HCN: hình chữ nhật · HBH: hình bình hành · HT: hình thang',
 'geo-solids':'hop: hộp chữ nhật · tru: hình trụ · non: hình nón · cau: hình cầu',
 'geo-pyramid':'LT: lăng trụ · C: hình chóp',
 'geo-triple':'hop: hình hộp · TD: tứ diện',
};
export function FormulaLegend({id}:{id:string}){return legends[id]?<small className="formula-legend">{legends[id]}</small>:null;}
