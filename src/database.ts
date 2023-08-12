import sqlite3 from "sqlite3";
import { SmartResponse, Subtask, Task } from "./appStore";
import { nanoid } from "nanoid";

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database("./mydatabase.db", (error) => {
      if (error) {
        console.error("Error opening the database:", error);
      } else {
        this.initTables();
      }
    });
  }

  private initTables(): void {
    console.log("Initializing database tables");
    // Create the tasks table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        completed INTERGER DEFAULT 0,
        completedDate TEXT,
        name TEXT,
        deadline TEXT,
        priority TEXT,
        subtasks LIST,
        notes TEXT,
        FOREIGN KEY (subtasks) REFERENCES subtasks(id)
      )
    `);

    // Create the subtasks table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id TEXT PRIMARY KEY,
        completed INTERGER DEFAULT 0,
        completedDate TEXT,
        name TEXT,
        parentTaskId TEXT,
        FOREIGN KEY (parentTaskId) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // Create the smartResponses table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS smartResponses (
        id TEXT PRIMARY KEY,
        name TEXT,
        probability NUMBER,
        subtasks LIST
      )
    `);
  }

  // methods for Tasks
  async addTask(task: Task): Promise<void> {
    try {
      console.log("database.ts - Task received:", task);
      const temporarySubtasks = [...task.subtasks];

      await new Promise((resolve, reject) => {
        this.db.run(
          `
        INSERT INTO tasks (id, completed, name, deadline, priority, subtasks, notes) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [
            task.id,
            task.completed,
            task.name,
            task.deadline,
            task.priority,
            task.subtasks,
            task.notes,
          ],
          (error) => {
            if (error) {
              reject(error);
            } else {
              console.log(`(db: addTask) Task ${task.name} added (${task.id})`);
              resolve(error);
            }
          }
        );
      });
      for (const subtask of temporarySubtasks) {
        await new Promise((resolve, reject) => {
          this.db.run(
            `
          INSERT INTO subtasks (id, completed, name, parentTaskId) VALUES (?, ?, ?, ?)
          `,
            [subtask.id, subtask.completed, subtask.name, task.id],
            (error) => {
              if (error) {
                reject(error);
              } else {
                console.log(
                  `(db: addTask) Subtask ${subtask.name} added (${subtask.id})`
                );
                resolve(error);
              }
            }
          );
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async editTask(updatedTask: Task): Promise<void> {
    try {
      const temporarySubtasks = updatedTask.subtasks ?? [];
      console.log("(db editTask) temporary subtasks: ", temporarySubtasks);
      // Update the task in the tasks table
      await new Promise((resolve, reject) => {
        this.db.run(
          `
                UPDATE tasks SET completed = ?, name = ?, deadline = ?, priority = ?, subtasks = ?, notes = ? WHERE id = ?
                `,
          [
            updatedTask.completed,
            updatedTask.name,
            updatedTask.deadline,
            updatedTask.priority,
            updatedTask.subtasks,
            updatedTask.notes,
            updatedTask.id,
          ],
          (error) => {
            if (error) {
              reject(error);
            } else {
              console.log(
                `(db: editTask) Task ${updatedTask.name} edited (${updatedTask.id})`
              );
              resolve(error);
            }
          }
        );
      });

      for (const subtask of temporarySubtasks) {
        // if the subtask has an id and is marked deleted, delete it
        if (subtask.deleted) {
          console.log("(db: editTask) trying to delete subtask");
          await new Promise((resolve, reject) => {
            this.db.run(
              `
              DELETE FROM subtasks WHERE id = ?
              `,
              [subtask.id],
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  console.log(
                    `(db: editTask) Subtask ${subtask.name} deleted (${subtask.id})`
                  );
                  resolve(error);
                }
              }
            );
          });
        }
        // if the subtask doesn't exist in the db yet, it should be inserted
        else if (this.idExistsInSubtasks(subtask.id)) {
          console.log("(db: editTask) trying to insert subtask: ", subtask);
          const id = `subtask-${nanoid()}`;
          await new Promise((resolve, reject) => {
            this.db.run(
              `
              INSERT INTO subtasks (id, completed, name, parentTaskId) VALUES (?, ?, ?, ?)
              `,
              [
                id,
                subtask.completed,
                subtask.name,
                updatedTask.id,
              ],
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  console.log(
                    `(db: editTask) Subtask ${subtask.name} added (${id})`
                  );
                  resolve(error);
                }
              }
            );
          });
        } else if (subtask.id) {
          // if the subtask has an id and is not marked delete, update it
          console.log("(db: editTask) trying to edit subtask");
          await new Promise((resolve, reject) => {
            this.db.run(
              `
              UPDATE subtasks SET name = ?, completed = ?, parentTaskId = ? WHERE id = ?
              `,
              [subtask.name, subtask.completed, updatedTask.id, subtask.id],
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  console.log(
                    `(db: editTask) Subtask ${subtask.name} edited (${subtask})`
                  );
                  resolve(error);
                }
              }
            );
          });
        }
      }
    } catch (error) {
      console.error("Error editing task:", error);
      throw error;
    }
  }

  deleteTask(taskId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("(db deleteTask) trying to delete task");
      this.db.run(
        `
        DELETE FROM tasks WHERE id = ?
        `,
        [taskId],
        (error) => {
          if (error) {
            reject(error);
          } else {
            console.log(`db deleteTask) task with id ${taskId} deleted`);
            resolve();
          }
        }
      );
    });
  }

  getTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM tasks ORDER BY deadline",
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

  async toggleTaskCompletion(
    taskId: string,
    completedStatus: string
  ): Promise<void> {
    const newCompletionStatus = !completedStatus;
    console.log("old completion status: ", completedStatus);
    console.log("new Completion status: ", newCompletionStatus);
    const completedDate = newCompletionStatus ? new Date().toISOString() : null;
    const existsInTasks = await this.idExistsInTasks(taskId);

    if (!existsInTasks) {
      console.error(`Task ID ${taskId} not found in tasks table.`);
      return;
    }

    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE tasks SET completed = ?, completedDate = ? WHERE id = ?",
        [newCompletionStatus, completedDate, taskId],
        (error) => {
          if (error) {
            reject(error);
          } else {
            console.log(
              `Task ${taskId} toggled successfully with date: ${completedDate}`
            );
            resolve();
          }
        }
      );
    });
  }

  private async idExistsInTasks(taskId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT id FROM tasks WHERE id = ?",
        [taskId],
        (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve(!!row);
          }
        }
      );
    });
  }

  // methods for Subtasks

  async toggleSubtaskCompletion(
    taskId: string,
    completedStatus: string
  ): Promise<void> {
    const newCompletionStatus = !completedStatus;
    console.log("old completion status: ", completedStatus);
    console.log("new Completion status: ", newCompletionStatus);
    const completedDate = newCompletionStatus ? new Date().toISOString() : null;
    const existsInSubtasks = await this.idExistsInSubtasks(taskId);

    if (!existsInSubtasks) {
      console.error(`${taskId} not found in tasks table.`);
      return;
    }

    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE subtasks SET completed = ?, completedDate = ? WHERE id = ?",
        [newCompletionStatus, completedDate, taskId],
        (error) => {
          if (error) {
            reject(error);
          } else {
            console.log(
              `${taskId} toggled successfully with date: ${completedDate}`
            );
            resolve();
          }
        }
      );
    });
  }

  private async idExistsInSubtasks(subtaskId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT id FROM subtasks WHERE id = ?",
        [subtaskId],
        (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve(!!row);
          }
        }
      );
    });
  }

  getSubtasksFromParent(parentTaskId: string): Promise<Subtask[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT * FROM subtasks WHERE parentTaskId = ?",
        [parentTaskId],
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

  // Function for gamification
  async getCompletedTodayCount(): Promise<number> {
    const today = new Date();
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString();
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    ).toISOString();

    return new Promise((resolve, reject) => {
      // Count tasks completed today
      this.db.get(
        "SELECT COUNT(*) as count FROM tasks WHERE completedDate >= ? AND completedDate < ?",
        [startDate, endDate],
        (error, taskRow) => {
          if (error) {
            reject(error);
            return;
          }

          // Count subtasks completed today
          this.db.get(
            "SELECT COUNT(*) as count FROM subtasks WHERE completedDate >= ? AND completedDate < ?",
            [startDate, endDate],
            (subtaskError, subtaskRow) => {
              if (subtaskError) {
                reject(subtaskError);
                return;
              }

              // Sum the counts and resolve
              const totalCount = (taskRow.count || 0) + (subtaskRow.count || 0);
              resolve(totalCount);
            }
          );
        }
      );
    });
  }

  // Functions for Smart Responses
  addSmartResponse(data: SmartResponse): Promise<SmartResponse> {
    return new Promise((resolve, reject) => {
      const id = `smartResponse-${nanoid()}`;
      this.db.run(
        `
        INSERT INTO smartResponses (id, name, probability, subtasks) VALUES (?, ?, ?, ?)
        `,
        [id, data.name, data.probability, data.subtasks],
        (error) => {
          if (error) {
            reject(error);
          } else {
            console.log(`SmartResponse ${data.name} added (${id})`);
            resolve(data);
          }
        }
      );
    });
  }
}

export const database = new Database();

// TODO: set this trigger using a SQL management tool
// CREATE TRIGGER IF NOT EXISTS delete_subtasts_on_parent_delet
// AFTER DELETE ON tasks
// FOR EACH ROW
// BEGIN
//   DELETE FROM subtasks WHERE parentTaskId = OLD.id;
// END;
