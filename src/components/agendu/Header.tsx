'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { ThemeCustomizer } from './ThemeCustomizer';

export function Header() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline text-primary">AgEndU</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsTaskFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
          <ThemeCustomizer />
        </div>
      </header>
      <TaskForm open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen} />
    </>
  );
}
