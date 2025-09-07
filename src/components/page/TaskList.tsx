"use client";

import { useState, useMemo } from 'react';
import type { Task, TaskPriority } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, ListFilter, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { subHours } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskListProps {
  tasks: Task[];
  onAddTask: (data: Omit<Task, 'id' | 'completed' | 'completionDate'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onClearCompleted: () => void;
}

type FilterStatus = 'all' | 'completed' | 'pending';

export function TaskList({ tasks, onAddTask, onUpdateTask, onDeleteTask, onToggleComplete, onClearCompleted }: TaskListProps) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');

  const completedTasksCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    const twentyFourHoursAgo = subHours(new Date(), 24);

    return tasks
      .filter(task => {
        const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
        
        if (filterStatus === 'all') return priorityMatch;
        if (filterStatus === 'completed') return task.completed && priorityMatch;
        if (filterStatus === 'pending') {
          const isPending = !task.completed || (task.completionDate && task.completionDate > twentyFourHoursAgo);
          return isPending && priorityMatch;
        }

        return priorityMatch;
      })
      .sort((a, b) => (a.dueDate ? a.dueDate.getTime() : Infinity) - (b.dueDate ? b.dueDate.getTime() : Infinity))
      .sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1));
  }, [tasks, filterStatus, filterPriority]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdate = (data: Omit<Task, 'id' | 'completed' | 'completionDate'>) => {
    if (editingTask) {
      onUpdateTask({ ...editingTask, ...data });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <CardTitle>Mis Tareas Académicas</CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled={completedTasksCount === 0}>
                  <Trash className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente {completedTasksCount} tarea(s) completada(s). Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearCompleted}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
                  <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="pending">Pendientes</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="completed">Completadas</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filtrar por Prioridad</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterPriority} onValueChange={(value) => setFilterPriority(value as TaskPriority | 'all')}>
                  <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="high">Alta</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="medium">Media</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="low">Baja</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Tarea
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Añadir Nueva Tarea</DialogTitle>
                    </DialogHeader>
                    <TaskForm onSubmit={onAddTask} onClose={() => setAddDialogOpen(false)} />
                </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedTasks.length > 0 ? (
            <div className="space-y-2">
                {filteredAndSortedTasks.map((task, index) => (
                    <div key={task.id}>
                    <TaskItem
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDeleteTask}
                        onEdit={() => handleEdit(task)}
                    />
                    {index < filteredAndSortedTasks.length - 1 && <Separator />}
                    </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No hay tareas que coincidan con los filtros actuales.</p>
              <p className="text-sm">Intenta ajustar tus filtros o añadir una nueva tarea.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
          </DialogHeader>
          <TaskForm task={editingTask!} onSubmit={handleUpdate} onClose={() => setEditingTask(null)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
