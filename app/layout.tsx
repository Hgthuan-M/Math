import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MATH HANDBOOK THCS · Toán Cấp 2 Dễ Hiểu & Thông Minh',
  description: 'Sổ tay toán học thông minh dành cho học sinh THCS Lớp 6 - 9. Hình học trực quan, 7 hằng đẳng thức, Pytago, Vi-ét, đấu trường 60s và Gia sư AI giải đề bằng ảnh.',
  icons: {icon: '/favicon.svg'},
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lexend:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
