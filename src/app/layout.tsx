import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import { ThemeProvider } from '@/app/providers/theme-provider';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Real time board',
  description:
    'Kanban-style board where multiple users can drag tasks and see changes instantly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
