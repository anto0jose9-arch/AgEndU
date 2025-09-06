'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Task, PersonalActivity, TaskData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Mock Data for initial state
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Q3 report presentation',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    planningStartDate: new Date(),
    planningEndDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    title: 'Schedule team offsite event',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    title: 'Review and approve marketing budget',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    priority: 'medium',
    completed: true,
  },
];

const initialPersonalActivities: PersonalActivity[] = [
    { id: 'p1', title: 'Book dentist appointment', completed: false },
    { id: 'p2', title: 'Buy groceries', completed: true },
];

type AppContextType = {
  tasks: Task[];
  personalActivities: PersonalActivity[];
  addTask: (taskData: TaskData) => void;
  updateTask: (id: string, taskData: Partial<TaskData>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addPersonalActivity: (title: string) => void;
  deletePersonalActivity: (id: string) => void;
  togglePersonalActivity: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [personalActivities, setPersonalActivities] = useState<PersonalActivity[]>([]);
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('agendu-tasks');
      const storedActivities = localStorage.getItem('agendu-activities');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks, (key, value) => key.endsWith('Date') ? new Date(value) : value));
      } else {
        setTasks(initialTasks);
      }
      if (storedActivities) {
        setPersonalActivities(JSON.parse(storedActivities));
      } else {
        setPersonalActivities(initialPersonalActivities);
      }
    } catch (error) {
        console.error("Failed to load from localStorage", error);
        setTasks(initialTasks);
        setPersonalActivities(initialPersonalActivities);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('agendu-tasks', JSON.stringify(tasks));
        localStorage.setItem('agendu-activities', JSON.stringify(personalActivities));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [tasks, personalActivities, isLoaded]);

  const addTask = (taskData: TaskData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      completed: false,
      ...taskData,
    };
    setTasks((prev) => [...prev, newTask]);
    toast({ title: "Task Added", description: `"${newTask.title}" has been created.` });
  };

  const updateTask = (id: string, taskData: Partial<TaskData>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...taskData } : task))
    );
    toast({ title: "Task Updated", description: "Your task has been successfully updated." });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (taskToDelete) {
        toast({ title: "Task Deleted", description: `"${taskToDelete.title}" has been removed.`, variant: 'destructive' });
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const addPersonalActivity = (title: string) => {
    const newActivity: PersonalActivity = { id: crypto.randomUUID(), title, completed: false };
    setPersonalActivities(prev => [...prev, newActivity]);
  };

  const deletePersonalActivity = (id: string) => {
    setPersonalActivities(prev => prev.filter(a => a.id !== id));
  };
  
  const togglePersonalActivity = (id: string) => {
    setPersonalActivities(prev => prev.map(a => a.id === id ? {...a, completed: !a.completed} : a));
  };

  const value = {
    tasks,
    personalActivities,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addPersonalActivity,
    deletePersonalActivity,
    togglePersonalActivity,
  };

  if (!isLoaded) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
