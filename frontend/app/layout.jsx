/**
 * Root Layout
 * Main layout with theme provider and global components
 */

import './globals.css';
import Header from '@/app/components/Header';
import { Providers } from '@/app/providers';

export const metadata = {
  title: 'DeployGEN - Automated Software Installation',
  description: 'Select apps, generate secure tokens, and install everything with one click',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="50" font-weight="bold" text-anchor="middle" dy=".3em" fill="%237c3aed">D</text></svg>'
  }
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
