'use client';

import { Dashboard } from '@/components/agendu/Dashboard';
import { AppProvider } from '@/contexts/app-provider';

export default function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <AppProvider>
        <Dashboard />
      </AppProvider>
    </main>
  );
}
