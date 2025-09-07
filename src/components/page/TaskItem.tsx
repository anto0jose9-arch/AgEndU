"use client";

import type { Task } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Flag, Trash2, Edit, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

export function TaskItem({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) {
  
  const priorityVariantMap = {
    high: 'destructive' as const,
    medium: 'secondary' as const,
    low: 'outline' as const,
  };
  
  const priorityIconColor = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-blue-500',
  }
  
  const priorityTextMap = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  }

  return (
    <div className={cn("flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50", task.completed && 'completed')}>
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        aria-label={`Marcar ${task.title} como ${task.completed ? 'incompleta' : 'completa'}`}
        className="mt-1"
      />
      <div className="flex-1 grid gap-1">
        <div className='flex items-center gap-2 flex-wrap'>
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              "font-medium cursor-pointer animated-strikethrough",
              task.completed && "text-muted-foreground",
              task.priority === 'high' && !task.completed && "font-bold"
            )}
          >
            {task.title}
          </label>
           <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
             {task.plannedDates.length > 0 && 
                <>
                <Separator orientation='vertical' className='h-4' />
                <div className="flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span>{task.plannedDates.map(d => format(d, 'd MMM', {locale: es})).join(', ')}</span>
                </div>
                </>
            }
            {task.dueDate && (
                 <>
                <Separator orientation='vertical' className='h-4' />
                <span>Entrega: {format(task.dueDate, 'PPP', { locale: es })}</span>
                </>
            )}
            </div>
        </div>
      </div>
      <Badge variant={priorityVariantMap[task.priority]} className="capitalize flex items-center gap-1 shrink-0">
        <Flag className={cn("h-3 w-3", priorityIconColor[task.priority])} />
        {priorityTextMap[task.priority]}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Opciones de tarea</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit} disabled={task.completed}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
