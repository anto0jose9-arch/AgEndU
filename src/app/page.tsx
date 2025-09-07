"use client";

import { useMemo, useEffect, useState } from 'react';
import { Header } from '@/components/page/Header';
import { TaskList } from '@/components/page/TaskList';
import { UpcomingDeadlines } from '@/components/page/UpcomingDeadlines';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CalendarSidebar } from '@/components/page/CalendarSidebar';
import { PersonalActivitiesPanel } from '@/components/page/PersonalActivitiesPanel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTaskManager } from '@/hooks/use-task-manager';
import { useLocalStorage } from '@/hooks/use-local-storage';


export default function Home() {
  const {
    tasks,
    personalActivities,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleToggleCompleteTask,
    handleClearCompletedTasks,
    handleAddPersonalActivity,
    handleDeletePersonalActivity,
    handleToggleCompletePersonalActivity,
    handleClearCompletedPersonalActivities,
    isMounted: isTasksMounted,
  } = useTaskManager();

  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notifications-enabled', true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const pendingPersonalActivitiesCount = useMemo(() => {
    return personalActivities.filter(act => !act.completed).length;
  }, [personalActivities]);

  const isDataReady = isMounted && isTasksMounted;

  return (
      <SidebarProvider>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <CalendarSidebar tasks={tasks} />
          
          <main className="flex-1 p-4 md:p-8">
            {!isDataReady ? (
                <div className="max-w-7xl mx-auto space-y-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-8">
                    <TaskList
                        tasks={tasks}
                        onAddTask={handleAddTask}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onToggleComplete={handleToggleCompleteTask}
                        onClearCompleted={handleClearCompletedTasks}
                    />
                    <UpcomingDeadlines tasks={tasks} />
                </div>
            )}
          </main>

          <Sheet>
             <SheetTrigger asChild>
                <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
                    <ClipboardList className="h-7 w-7" />
                    <span className="sr-only">Abrir actividades personales</span>
                    {isDataReady && notificationsEnabled && pendingPersonalActivitiesCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {pendingPersonalActivitiesCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>Actividades Personales</SheetTitle>
                </SheetHeader>
                 <PersonalActivitiesPanel 
                    activities={personalActivities}
                    onAddActivity={handleAddPersonalActivity}
                    onDeleteActivity={handleDeletePersonalActivity}
                    onToggleComplete={handleToggleCompletePersonalActivity}
                    onClearCompleted={handleClearCompletedPersonalActivities}
                    notificationsEnabled={notificationsEnabled}
                    onNotificationsChange={setNotificationsEnabled}
                />
            </SheetContent>
          </Sheet>
        </div>
      </SidebarProvider>
  );
}
