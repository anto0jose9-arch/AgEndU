"use client";

import { Calendar, X } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { CalendarView } from './CalendarView';
import { Task } from '@/lib/types';
import { SheetClose, SheetTitle } from '../ui/sheet';

interface CalendarSidebarProps {
    tasks: Task[];
}

export function CalendarSidebar({ tasks }: CalendarSidebarProps) {
  return (
    <Sidebar side="left">
        <SidebarHeader className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <SheetTitle className="text-lg font-semibold">Calendario</SheetTitle>
            </div>
             <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </SheetClose>
        </SidebarHeader>
        <SidebarContent>
          <SheetClose asChild>
            <CalendarView tasks={tasks} />
          </SheetClose>
        </SidebarContent>
    </Sidebar>
  );
}
