'use client';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {useMemo} from 'react';
export function MathFormula({latex,block=true}:{latex:string;block?:boolean}){const html=useMemo(()=>katex.renderToString(latex,{throwOnError:false,displayMode:block,output:'htmlAndMathml',trust:false}),[latex,block]);return <span className={block?'math-render block':'math-render'} dangerouslySetInnerHTML={{__html:html}}/>}
