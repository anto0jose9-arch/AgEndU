'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useAppContext } from '@/contexts/app-provider';
import { summarizeUpcomingDeadlines } from '@/ai/flows/upcoming-deadlines-summary';

export function UpcomingSummary() {
  const { tasks } = useAppContext();
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [includePlanned, setIncludePlanned] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const relevantTasks = tasks.filter(task => !task.completed).map(task => ({
      title: task.title,
      dueDate: task.dueDate.toISOString(),
      priority: task.priority,
    }));
    
    if (relevantTasks.length === 0) {
        setSummary('No upcoming deadlines. Great job!');
        return;
    }

    startTransition(async () => {
      setError(null);
      try {
        const result = await summarizeUpcomingDeadlines({
          tasks: relevantTasks,
          includePlannedDates: includePlanned,
        });
        setSummary(result.summary);
      } catch (e) {
        console.error(e);
        setError('Could not generate summary. Please try again later.');
        setSummary('');
      }
    });
  }, [tasks, includePlanned]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">Upcoming Summary</CardTitle>
                <CardDescription>An AI-powered look at your week.</CardDescription>
            </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="include-planned"
              checked={includePlanned}
              onCheckedChange={setIncludePlanned}
              aria-label="Include planned dates"
            />
            <Label htmlFor="include-planned">Include Planned</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[70%]" />
          </div>
        ) : error ? (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}
