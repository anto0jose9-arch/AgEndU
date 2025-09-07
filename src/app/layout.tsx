"use client";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { useSettings, SettingsProvider } from '@/hooks/use-settings';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'AgEndU',
//   description: 'Organiza tus tareas académicas con AgEndU.',
// };

function AppLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <html lang="es">
        <body className={inter.className}>
          <div className="h-screen w-screen" />
        </body>
      </html>
    );
  }
  
  return (
    <html lang="es" className={cn(settings.appearance)}>
      <head>
          <title>AgEndU</title>
          <meta name="description" content="Organiza tus tareas académicas con AgEndU." />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SettingsProvider>
      <AppLayout>{children}</AppLayout>
    </SettingsProvider>
  );
}
