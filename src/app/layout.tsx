import type { Metadata } from 'next';
import './globals.css';
import { VisitorProvider } from '@/contexts/VisitorContext';
import CustomCursor from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: 'Portfolio | Ahmad Ali Shah',
  description:
    'Personal portfolio of Ahmad Ali Shah — Full-Stack & Systems Architect at FAST-NUCES. High-performance, frame-scrubbed web experiences.',
  keywords: ['Ahmad Ali Shah', 'Portfolio', 'Full-Stack Developer', 'React', 'Next.js', 'FAST-NUCES', 'Systems Architect'],
  authors: [{ name: 'Ahmad Ali Shah' }],
  openGraph: {
    title: 'Portfolio | Ahmad Ali Shah',
    description: 'Personal portfolio of Ahmad Ali Shah — Full-Stack & Systems Architect.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <VisitorProvider>
          <CustomCursor />
          {children}
        </VisitorProvider>
      </body>
    </html>
  );
}
