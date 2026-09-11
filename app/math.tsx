'use client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {useMemo} from 'react';
export function MathFormula({latex,unicodeMath,block=true}:{latex:string;unicodeMath?:string;block?:boolean}){const html=useMemo(()=>unicodeMath?'':katex.renderToString(latex,{throwOnError:false,displayMode:block,output:'htmlAndMathml',trust:false}),[latex,unicodeMath,block]);return unicodeMath?<span className={block?'unicode-math block':'unicode-math'}>{unicodeMath}</span>:<span className={block?'math-render block':'math-render'} dangerouslySetInnerHTML={{__html:html}}/>}
