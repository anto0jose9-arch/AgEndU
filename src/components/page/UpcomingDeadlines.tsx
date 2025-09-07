"use client";

import type { Task } from '@/lib/types';
import { addDays, isWithinInterval, startOfToday, differenceInDays, endOfDay } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell, CalendarCheck2, History } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

type UpcomingEvent = {
  taskId: string;
  title: string;
  date: Date;
  type: 'due' | 'planned';
};

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const [showPlanned, setShowPlanned] = useState(false);

  const upcomingEvents = useMemo(() => {
    const today = startOfToday();
    const horizon = endOfDay(addDays(today, 7)); 

    let events: UpcomingEvent[] = [];

    tasks.forEach(task => {
      if (!task.completed) {
        // Add due date if it's within the horizon
        if (task.dueDate && isWithinInterval(task.dueDate, { start: today, end: horizon })) {
          events.push({
            taskId: task.id,
            title: task.title,
            date: task.dueDate,
            type: 'due',
          });
        }
        
        // Add planned dates if enabled and they are within the horizon
        if (showPlanned) {
          task.plannedDates.forEach(plannedDate => {
            if (isWithinInterval(plannedDate, { start: today, end: horizon })) {
              events.push({
                taskId: `${task.id}-planned-${plannedDate.toISOString()}`,
                title: task.title,
                date: plannedDate,
                type: 'planned',
              });
            }
          });
        }
      }
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [tasks, showPlanned]);

  const getUrgencyText = (date: Date) => {
    const daysLeft = differenceInDays(date, startOfToday());
    if (daysLeft < 0) return 'Vencido';
    if (daysLeft === 0) return 'Hoy';
    if (daysLeft === 1) return 'Mañana';
    return `En ${daysLeft} días`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-accent" />
            <CardTitle>Próximamente</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-planned-switch">Incluir planificadas</Label>
            <Switch
              id="show-planned-switch"
              checked={showPlanned}
              onCheckedChange={setShowPlanned}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <Alert variant="default" className="bg-accent/10 border-accent/20">
            <AlertDescription>
              <ul className="space-y-3">
                {upcomingEvents.map(event => (
                  <li key={event.taskId} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-2">
                       {event.type === 'due' ? <CalendarCheck2 className="h-4 w-4 text-destructive" /> : <History className="h-4 w-4 text-blue-500" />}
                       <span className="font-medium text-foreground">{event.title}</span>
                       {event.type === 'planned' && <span className="text-xs text-blue-500 font-semibold">(Planificado)</span>}
                    </div>
                    <span className="text-sm text-accent font-semibold pl-6 sm:pl-0">{getUrgencyText(event.date)}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {showPlanned 
                ? "No tienes entregas ni tareas planificadas en los próximos 7 días. ¡Todo en orden!"
                : "No tienes entregas en los próximos 7 días. ¡Buen trabajo!"
            }
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface UpcomingDeadlinesProps {
  tasks: Task[];
}
