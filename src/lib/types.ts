export type Priority = 'low' | 'medium' | 'high';

export interface TaskData {
  title: string;
  dueDate: Date;
  planningStartDate?: Date;
  planningEndDate?: Date;
  priority: Priority;
}

export interface Task extends TaskData {
  id: string;
  completed: boolean;
}

export interface PersonalActivity {
  id: string;
  title: string;
  completed: boolean;
}
