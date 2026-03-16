import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './global.css';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { ModeToggle } from '@/features/theme-toggle/mode-toggle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-3 backdrop-blur">
              <div>
                <h1 className="text-xl font-semibold">Realtime Board</h1>
                <p className="text-sm text-muted-foreground">
                  Jira-like kanban layout with light/dark themes.
                </p>
              </div>
              <ModeToggle />
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
