'use client';

import { Header } from '@/components/agendu/Header';
import { TaskList } from '@/components/agendu/TaskList';
import { CalendarView } from '@/components/agendu/CalendarView';
import { UpcomingSummary } from '@/components/agendu/UpcomingSummary';
import { PersonalActivities } from '@/components/agendu/PersonalActivities';

export function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-3">
          <TaskList />
        </div>
        <div className="md:col-span-1 flex flex-col gap-8">
          <CalendarView />
        </div>
        <div className="md:col-span-2 flex flex-col gap-8">
          <UpcomingSummary />
          <PersonalActivities />
        </div>
      </div>
    </div>
  );
}
