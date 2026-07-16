import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import MouseSpotlight from '@/components/MouseSpotlight';
import ParticleField from '@/components/ParticleField';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Thenula Dewanmith | Aspiring Security Engineer',
    description:
      'Exploring cybersecurity through hands-on projects, continuous learning, and a strong foundation in networking, Linux, and software development.',
    type: 'website',
    locale: 'en_US',
    images: ['/wolf-logo.png'],
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full scroll-smooth`}
    >
      <body className="font-sans bg-[#0b101a] text-[#f2f4f8] antialiased min-h-screen relative overflow-x-hidden">
        {/* Global interactive background effects */}
        <ParticleField />
        <MouseSpotlight />
        {/* Dot+ring cursor for touch/coarse-pointer devices */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
