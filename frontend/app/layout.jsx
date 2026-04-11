/**
 * Root Layout
 * Main layout with theme provider and global components
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';
import Header from '@/app/components/Header';
import { Providers } from '@/app/providers';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/admin/maintenance');
        if (response.ok) {
          const data = await response.json();
          if (data.isEnabled && pathname !== '/maintenance') {
            setIsMaintenanceMode(true);
            router.push('/maintenance');
          }
        }
      } catch (error) {
        console.log('Maintenance check failed');
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, [pathname, router]);

  if (loading) return null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {pathname !== '/maintenance' && <Header />}
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
