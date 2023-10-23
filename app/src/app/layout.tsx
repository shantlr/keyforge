import { config } from '@fortawesome/fontawesome-svg-core';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';

import { QueryProvider } from '@/components/providers/queryClient';
import { ReduxProvider } from '@/components/providers/redux';

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Keyforge',
  description: 'Custom your qmk keymap',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="expanded-container">
      <body
        className={clsx(
          inter.className,
          'bg-mainbg text-slate-400 expanded-container'
        )}
      >
        <QueryProvider>
          <ReduxProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
