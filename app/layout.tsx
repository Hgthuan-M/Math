import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'MATH HANDBOOK PRO · Hiểu sâu, nhớ lâu',description:'Sổ tay toán học tương tác, bài giảng, quiz và đồ thị từ THCS đến đại học cơ bản.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi" suppressHydrationWarning><body>{children}</body></html>}
