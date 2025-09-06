'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppContext } from '@/contexts/app-provider';
import type { Task } from '@/lib/types';
import { format } from 'date-fns';
import { TaskForm } from './TaskForm';

const priorityStyles = {
  high: 'bg-red-500 hover:bg-red-600',
  medium: 'bg-yellow-500 hover:bg-yellow-600',
  low: 'bg-green-500 hover:bg-green-600',
};

export function TaskList() {
  const { tasks, toggleTask, deleteTask } = useAppContext();
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleFormOpenChange = (isOpen: boolean) => {
    setIsTaskFormOpen(isOpen);
    if (!isOpen) {
      setEditingTask(undefined);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => (a.completed ? 1 : -1) || new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Tasks</CardTitle>
          <CardDescription>
            Here's what you need to work on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead className="w-[120px]">Priority</TableHead>
                  <TableHead className="w-[150px]">Due Date</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((task) => (
                    <TableRow key={task.id} data-completed={task.completed} className="data-[completed=true]:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                        />
                      </TableCell>
                      <TableCell className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className={`${priorityStyles[task.priority]} text-primary-foreground capitalize`}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className={`${task.completed ? 'text-muted-foreground' : ''}`}>
                        {format(task.dueDate, 'PPP')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(task)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No tasks yet. Add one to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <TaskForm open={isTaskFormOpen} onOpenChange={handleFormOpenChange} task={editingTask} />
    </>
  );
}
