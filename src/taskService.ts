import { appStore, Task, Subtask } from './appStore';
import { database } from './database';

class TaskService {

  addTask(task: Task): void {
    appStore.tasks.push(task);
    database.addTask(task)
      .then(() => {
        console.log('Task added successfully to the database');
      })
      .catch(error => {
        console.error('Error adding task to the database:', error);
      });
  }

  editTask(taskId: string, updatedTask: Task): void {
    const taskIndex = appStore.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      appStore.tasks[taskIndex] = updatedTask;
      database.editTask(taskId, updatedTask)
        .then(() => {
          console.log('Task updated successfully in the database');
        })
        .catch(error => {
          console.error('Error updating task in the database:', error);
        });
    }
  }

  deleteTask(taskId: string): void {
    const taskIndex = appStore.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      appStore.tasks.splice(taskIndex, 1);
      database.deleteTask(taskId)
        .then(() => {
          console.log('Task deleted successfully from the database');
        })
        .catch(error => {
          console.error('Error deleting task from the database:', error);
        });
    }
  }
}


export const taskService = new TaskService();
