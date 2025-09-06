'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useAppContext } from '@/contexts/app-provider';
import type { DateRange } from 'react-day-picker';

export function CalendarView() {
  const { tasks } = useAppContext();
  const [month, setMonth] = useState(new Date());

  const dueDates = tasks
    .filter((task) => !task.completed)
    .map((task) => task.dueDate);

  const planningRanges = tasks
    .filter((task) => !task.completed && task.planningStartDate && task.planningEndDate)
    .map((task) => ({
      from: task.planningStartDate!,
      to: task.planningEndDate!,
    })) as DateRange[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          month={month}
          onMonthChange={setMonth}
          mode="multiple"
          selected={dueDates}
          modifiers={{ 
            planning: planningRanges,
            due: dueDates,
          }}
          modifiersStyles={{
            due: {
                color: 'hsl(var(--primary-foreground))',
                backgroundColor: 'hsl(var(--primary))',
            },
            planning: { 
                backgroundColor: 'hsl(var(--accent) / 0.2)',
                border: '1px solid hsl(var(--accent))',
            },
          }}
          className="p-0"
        />
      </CardContent>
    </Card>
  );
}
