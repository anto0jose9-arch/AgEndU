import { BookCheck, Settings, Calendar } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="border-b bg-card sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <SidebarTrigger side="settings" tooltip="Ajustes">
            <Settings />
          </SidebarTrigger>
          <SidebarTrigger side="left" tooltip="Calendario">
            <Calendar />
          </SidebarTrigger>
        </div>
        
        <div className="flex justify-center items-center gap-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <BookCheck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">AgEndU</h1>
        </div>

        <div className="w-[88px]"/>
      </div>
    </header>
  );
}
