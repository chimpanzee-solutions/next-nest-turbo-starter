import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { configureApiClient } from '@repo/openapi/api-client';

import { getServerApiClientConfig } from '@/lib/api/api-client-config';
import { Providers } from '@/providers/providers';
import './globals.css';

configureApiClient(getServerApiClientConfig());

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Starter App',
  description: 'Main application (Next.js)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
