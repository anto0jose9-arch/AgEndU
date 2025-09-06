'use client';

import * as React from 'react';
import { useAppContext } from '@/contexts/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PersonalActivities() {
  const { personalActivities, addPersonalActivity, togglePersonalActivity, deletePersonalActivity } = useAppContext();
  const [newActivity, setNewActivity] = React.useState('');

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      addPersonalActivity(newActivity.trim());
      setNewActivity('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Personal Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddActivity} className="flex gap-2 mb-4">
          <Input
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="Add a personal task..."
          />
          <Button type="submit" size="icon" aria-label="Add Activity">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
        <ScrollArea className="h-48 pr-4">
          <div className="space-y-4">
            {personalActivities.length > 0 ? (
              personalActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 animate-in fade-in">
                  <Checkbox
                    id={`activity-${activity.id}`}
                    checked={activity.completed}
                    onCheckedChange={() => togglePersonalActivity(activity.id)}
                    aria-label={`Mark ${activity.title} as ${activity.completed ? 'incomplete' : 'complete'}`}
                  />
                  <label
                    htmlFor={`activity-${activity.id}`}
                    className={`flex-grow text-sm ${activity.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {activity.title}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePersonalActivity(activity.id)}
                    aria-label={`Delete ${activity.title}`}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No personal activities yet.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
