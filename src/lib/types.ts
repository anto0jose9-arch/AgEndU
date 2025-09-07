export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  dueDate: Date | null;
  plannedDates: Date[];
  priority: TaskPriority;
  completed: boolean;
  completionDate: Date | null;
}

export interface PersonalActivity {
  id: string;
  title: string;
  completed: boolean;
  completionDate: Date | null;
}

export type ThemeSettings = {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  foregroundColor: string;
};

export type AppSettings = {
  appearance: 'light' | 'dark';
  theme: ThemeSettings;
};
