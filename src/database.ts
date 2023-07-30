import sqlite3 from 'sqlite3';
import { Task } from './appStore';

class Database {
  private db: sqlite3.Database;
 
  constructor() {
    this.db = new sqlite3.Database('./mydatabase.db', (error) => {
      if (error) {
        console.error('Error opening the database:', error);
      } else {
        this.initTables();
      }
    });
  }

  private initTables(): void {
    console.log('Initializing database tables');
    // Create the tasks table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        completed BOOLEAN,
        name TEXT,
        deadline TEXT,
        priority TEXT,
        subtasks TEXT,
        notes TEXT,
        FOREIGN KEY (subtasks) REFERENCES subtasks(id)
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
            console.log(`Task ${task.name} added (${task.id})`)
            resolve();
          }
        },
      );
    });
  }

  editTask( updatedTask: Task): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
        UPDATE tasks SET completed = ?, name = ?, deadline = ?, priority = ?, subtasks = ?, notes = ? WHERE id = ?
        `,
        [updatedTask.completed, updatedTask.name, updatedTask.deadline.toISOString(), updatedTask.priority, updatedTask.subtasks, updatedTask.notes, updatedTask.id],
        error => {
          if (error) {
            reject(error);
          } else {
            console.log(`Task ${updatedTask.name} edited (${updatedTask.id})`)
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

  getTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM tasks',
        (error: Error | null, rows: any[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  getTask(taskId: string): Promise<Task> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * from tasks WHERE id = ?', 
        [taskId],
        (error, task: Task ) => {
          if (error) {
            reject(error);
          } else {
            resolve(task);
          }
        }
      );
    })
  }


}

export const database = new Database();