import sqlite3 from 'sqlite3';
import { Task } from './appStore';

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.initTables();
  }

  private initTables(): void {
    // Create the tasks table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        completed BOOLEAN,
        name TEXT,
        deadline TEXT,
        priority TEXT,
        notes TEXT
      )
    `);

    // Create the subtasks table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id TEXT PRIMARY KEY,
        completed BOOLEAN,
        name TEXT,
        parentTaskId TEXT,
        FOREIGN KEY (parentTaskId) REFERENCES tasks(id)
      )
    `);
  }

  addTask(task: Task): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
        INSERT INTO tasks (id, completed, name, deadline, priority, notes) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [task.id, task.completed, task.name, task.deadline.toISOString(), task.priority, task.notes],
        error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  editTask(taskId: string, updatedTask: Task): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
        UPDATE tasks SET name = ?, completed = ?, deadline = ?, priority = ?, notes = ? WHERE id = ?
        `,
        [updatedTask.name, updatedTask.completed, updatedTask.deadline.toISOString(), updatedTask.priority, updatedTask.notes, taskId],
        error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  deleteTask(taskId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
        DELETE FROM tasks WHERE id = ?
        `,
        [taskId],
        error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

export const database = new Database();