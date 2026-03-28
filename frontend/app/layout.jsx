/**
 * Root Layout
 * Main layout with theme provider and global components
 */

import './globals.css';
import Header from '@/app/components/Header';
import { Providers } from '@/app/providers';

export const metadata = {
  title: 'AppManager - Automated Software Installation',
  description: 'Select apps, generate secure tokens, and install everything with one click',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
