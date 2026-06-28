import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppNav } from '@/components/AppNav';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Keyword Lexicanum',
  description: 'In-context tabletop rules keyword lookup',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#0f0f1a] text-[#f5f5f5]">
        <AppNav />
        {children}
      </body>
    </html>
  );
}
