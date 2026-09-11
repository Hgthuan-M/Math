import Handbook from '../handbook';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!['documents','geometry','topics','formulas','quiz','flashcards','labs','calculator','mindmap','tutor','profile','about','design'].includes(section))notFound();return <Handbook initialSection={section}/>}
