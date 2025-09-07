"use client"

import { useCallback, useEffect, useMemo } from 'react';
import type { Task, PersonalActivity } from '@/lib/types';
import { addDays, subHours } from 'date-fns';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from "@/hooks/use-toast";

const initialTasks: Task[] = [
  { id: '1', title: 'Terminar tarea de Matemáticas', dueDate: addDays(new Date(), 2), plannedDates: [], priority: 'high', completed: false, completionDate: null },
  { id: '2', title: 'Preparar examen de Historia', dueDate: addDays(new Date(), 5), plannedDates: [addDays(new Date(), 3)], priority: 'medium', completed: false, completionDate: null },
  { id: '3', title: 'Escribir ensayo de Inglés', dueDate: addDays(new Date(), 10), plannedDates: [addDays(new Date(), 7)], priority: 'low', completed: true, completionDate: new Date() },
  { id: '4', title: 'Propuesta proyecto de Ciencias', dueDate: addDays(new Date(), 1), plannedDates: [], priority: 'high', completed: false, completionDate: null },
  { id: '5', title: 'Leer capítulo 5 de Biología', dueDate: addDays(new Date(), 3), plannedDates: [addDays(new Date(), 2)], priority: 'medium', completed: false, completionDate: null },
];

const initialPersonalActivities: PersonalActivity[] = [
    { id: 'p1', title: 'Ir al gimnasio', completed: false, completionDate: null },
    { id: 'p2', title: 'Comprar entradas para el cine', completed: true, completionDate: new Date() },
];

const dateReviver = (key: string, value: any) => {
  if (['dueDate', 'plannedDates', 'completionDate'].includes(key)) {
    if (Array.isArray(value)) return value.map(d => d ? new Date(d) : null);
    return value ? new Date(value) : null;
  }
  return value;
};

const playSound = (url: string) => {
  if (typeof window !== 'undefined') {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Error playing sound:", e));
  }
};

export function useTaskManager() {
  const [tasks, setTasks, isTasksMounted] = useLocalStorage<Task[]>('tasks', initialTasks, dateReviver);
  const [personalActivities, setPersonalActivities, isActivitiesMounted] = useLocalStorage<PersonalActivity[]>('personal-activities', initialPersonalActivities, dateReviver);
  const { toast } = useToast();

  const isMounted = isTasksMounted && isActivitiesMounted;

  const cleanupCompletedItems = useCallback(() => {
    const twentyFourHoursAgo = subHours(new Date(), 24);
    
    setTasks(currentTasks => 
      currentTasks.filter(task => 
        !task.completed || (task.completionDate && task.completionDate > twentyFourHoursAgo)
      )
    );

    setPersonalActivities(currentActivities => 
      currentActivities.filter(act => 
        !act.completed || (act.completionDate && act.completionDate > twentyFourHoursAgo)
      )
    );
  }, [setTasks, setPersonalActivities]);

  useEffect(() => {
    if (isMounted) {
      cleanupCompletedItems();
      const intervalId = setInterval(cleanupCompletedItems, 60 * 60 * 1000); 
      return () => clearInterval(intervalId);
    }
  }, [isMounted, cleanupCompletedItems]);


  const handleAddTask = useCallback((taskData: Omit<Task, 'id' | 'completed' | 'completionDate'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      completionDate: null,
      plannedDates: taskData.plannedDates || [],
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({ title: "Éxito", description: "Tarea añadida correctamente." });
  }, [setTasks, toast]);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
     toast({ title: "Éxito", description: "Tarea actualizada." });
  }, [setTasks, toast]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({ variant: "destructive", title: "Éxito", description: "Tarea eliminada." });
  }, [setTasks, toast]);

  const handleToggleCompleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
      const task = prevTasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        playSound('https://cdn.pixabay.com/download/audio/2021/08/04/audio_c3a377a0d8.mp3');
      }
      return prevTasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed, completionDate: !t.completed ? new Date() : null } : t
      );
    });
  }, [setTasks]);
  
  const handleClearCompletedTasks = useCallback(() => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    toast({ title: "Éxito", description: "Tareas completadas eliminadas." });
  }, [setTasks, toast]);

  const handleAddPersonalActivity = useCallback((activityData: Omit<PersonalActivity, 'id' | 'completed' | 'completionDate'>) => {
      const newActivity: PersonalActivity = {
          ...activityData,
          id: `p-${crypto.randomUUID()}`,
          completed: false,
          completionDate: null,
      };
      setPersonalActivities(prev => [newActivity, ...prev]);
      toast({ title: "Éxito", description: "Actividad personal añadida." });
  }, [setPersonalActivities, toast]);

  const handleDeletePersonalActivity = useCallback((activityId: string) => {
      setPersonalActivities(prev => prev.filter(act => act.id !== activityId));
      toast({ variant: "destructive", title: "Éxito", description: "Actividad personal eliminada." });
  }, [setPersonalActivities, toast]);

  const handleToggleCompletePersonalActivity = useCallback((activityId: string) => {
    setPersonalActivities(prev => {
      const activity = prev.find(a => a.id === activityId);
      if (activity && !activity.completed) {
        playSound('https://cdn.pixabay.com/download/audio/2021/08/04/audio_c3a377a0d8.mp3');
      }
      return prev.map(act =>
        act.id === activityId ? { ...act, completed: !act.completed, completionDate: !act.completed ? new Date() : null } : act
      );
    });
  }, [setPersonalActivities]);

  const handleClearCompletedPersonalActivities = useCallback(() => {
    setPersonalActivities(prev => prev.filter(act => !act.completed));
    toast({ title: "Éxito", description: "Actividades personales completadas eliminadas." });
  }, [setPersonalActivities, toast]);


  return {
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
    isMounted,
  };
}
