// taskService.tsx

import React, { useState, createContext, useContext, useMemo } from "react";
import { Task } from "./appStore";

interface TaskService {
  tasks: Task[];
  addTask(task: Task): void;
  editTask(task: Task): void;
  deleteTask(id: string): void;
  // ... other task related methods as needed
}

const TaskServiceContext = createContext<TaskService | null>(null);

export const useTaskService = (): TaskService => {
  const context = useContext(TaskServiceContext);
  if (!context) {
    throw new Error("useTaskService must be used within a TaskServiceProvider");
  }
  return context;
};

export const TaskServiceProvider: React.FC = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const editTask = (editedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === editedTask.id ? editedTask : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const content: TaskService = useMemo(() => ({
    tasks,
    addTask,
    editTask,
    deleteTask
  }), [tasks]);

  return (
    <TaskServiceContext.Provider value={content}>
      {children}
    </TaskServiceContext.Provider>
  );
};
