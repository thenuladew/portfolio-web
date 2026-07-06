import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Thenula Dewanmith | Aspiring Security Engineer',
  description:
    'Portfolio of Thenula Dewanmith — an Aspiring Security Engineer, exploring cybersecurity through hands-on projects, continuous learning, and a strong foundation in networking, Linux, and software development.',
  keywords: [
    'Thenula Dewanmith',
    'Cybersecurity',
    'SLIIT',
    'Secure Software',
    'Network Security',
    'Information Security',
    'Sri Lanka',
    'Portfolio',
    'Security Engineer',
  ],
  authors: [{ name: 'Thenula Dewanmith' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Thenula Dewanmith | Aspiring Security Engineer',
    description:
      'Exploring cybersecurity through hands-on projects, continuous learning, and a strong foundation in networking, Linux, and software development.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="font-sans bg-[#090909] text-white antialiased min-h-screen relative overflow-x-hidden">
        {/* Dot+ring cursor for touch/coarse-pointer devices */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
