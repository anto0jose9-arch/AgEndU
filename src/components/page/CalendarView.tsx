"use client";
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import type { Task } from '@/lib/types';
import { isSameDay } from 'date-fns';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const plannedDates = tasks.flatMap(task => task.plannedDates);
  const dueDates = tasks.map(task => task.dueDate).filter((d): d is Date => !!d);

  const tasksForSelectedDay = date
    ? tasks.filter(task => 
        task.plannedDates.some(pd => isSameDay(pd, date!)) || 
        (task.dueDate && isSameDay(task.dueDate, date!))
      )
    : [];
  
  const priorityVariantMap = {
    high: 'destructive' as const,
    medium: 'secondary' as const,
    low: 'outline' as const,
  };

  const modifiers = {
    planned: plannedDates,
    due: dueDates,
    completed: tasks.filter(t => t.completed && t.dueDate).map(t => t.dueDate!),
    high: tasks.filter(t => t.priority === 'high' && !t.completed && t.dueDate).map(t => t.dueDate!),
    medium: tasks.filter(t => t.priority === 'medium' && !t.completed && t.dueDate).map(t => t.dueDate!),
    low: tasks.filter(t => t.priority === 'low' && !t.completed && t.dueDate).map(t => t.dueDate!),
  };

  const modifiersStyles = {
    planned: { 
      textDecoration: 'underline',
      textDecorationStyle: 'wavy' as const,
      textDecorationColor: 'hsl(var(--accent))'
    },
    due: { 
      fontWeight: 'bold' as const,
    },
    completed: {
      textDecoration: 'line-through',
      color: 'hsl(var(--muted-foreground))'
    },
    high: { backgroundColor: 'rgba(255, 77, 77, 0.5)' },
    medium: { backgroundColor: 'rgba(255, 179, 77, 0.4)' },
    low: { backgroundColor: 'rgba(77, 179, 255, 0.3)' }
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col items-center p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
        />
        {date && tasksForSelectedDay.length > 0 && (
          <div className="mt-4 w-full px-2">
            <h4 className="font-semibold text-sm mb-2">Tareas para {date.toLocaleDateString()}:</h4>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {tasksForSelectedDay.map(task => (
                  <div key={task.id} className={`p-2 rounded-md border flex justify-between items-center ${task.completed ? 'bg-muted/50' : 'bg-background'}`}>
                    <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</span>
                    <Badge variant={priorityVariantMap[task.priority]} className="capitalize text-xs">{task.priority}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
