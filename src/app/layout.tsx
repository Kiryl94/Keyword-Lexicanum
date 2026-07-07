import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppNav } from '@/components/AppNav';
import { OfflineBanner } from '@/components/OfflineBanner';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
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
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Lexicanum',
  },
};

export const viewport: Viewport = {
  themeColor: '#16213e',
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
        <ServiceWorkerRegister />
        <OfflineBanner />
        <AppNav />
        {children}
      </body>
    </html>
  );
}
