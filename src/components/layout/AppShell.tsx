'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen bg-transparent text-white">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      <Header />
      <div className="pt-20 sm:pt-24 pb-16 md:pb-0 flex-1 flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent text-white">{children}</div>}>
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
};
