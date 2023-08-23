import sqlite3 from "sqlite3";
import { SmartResponse, SmartSubtask, Subtask, Task } from "./appStore";
import { nanoid } from "nanoid";
import electron from "electron";
import path from "path";

class Database {
  private db: sqlite3.Database;

  constructor() {
    const userDataPath = electron.app.getPath("userData");
    const dbPath = path.join(userDataPath, "mydatabase.db");
    this.db = new sqlite3.Database(dbPath, (error) => {
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
        createdDate TEXT,
        name TEXT,
        completed INTERGER DEFAULT 0,
        completedDate TEXT,
        deadline TEXT,
        priority TEXT,
        subtasks LIST,
        notes TEXT,
        deleted INTEGER DEFAULT 0,
        checkCount INTEGER DEFAULT 0,
        FOREIGN KEY (subtasks) REFERENCES subtasks(id)
      )
    `);

    // Create the subtasks table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id TEXT PRIMARY KEY,
        createdDate TEXT,
        name TEXT,
        completed INTERGER DEFAULT 0,
        completedDate TEXT,
        parentTaskId TEXT,
        deleted INTEGER DEFAULT 0,
        FOREIGN KEY (parentTaskId) REFERENCES tasks(id)
      )
    `);

    // Create the smartResponses table if it doesn't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS smartResponseTasks (
        requestId Text,
        id TEXT PRIMARY KEY,
        createdDate TEXT,
        name TEXT,
        probability NUMBER,
        subtasks LIST,
        FOREIGN KEY (subtasks) REFERENCES smartResponseSubtasks(id)
      )
    `);
    this.db.run(`
      CREATE TABLE IF NOT EXISTS smartResponseSubtasks (
        id TEXT PRIMARY KEY,
        createdDate TEXT,
        name TEXT,
        probability NUMBER,
        parentTaskId TEXT,
        FOREIGN KEY (parentTaskId) REFERENCES smartResponseTask(id)
        )
    `);
  }

  // METHODS FOR TASKS
  async addTask(task: Task): Promise<void> {
    try {
      const temporarySubtasks = [...task.subtasks];
      await new Promise((resolve, reject) => {
        this.db.run(
          `
        INSERT INTO tasks (id, createdDate, completed, name, deadline, priority, subtasks, notes, checkCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            task.id,
            task.createdDate,
            task.completed,
            task.name,
            task.deadline,
            task.priority,
            task.subtasks,
            task.notes,
            task.checkCount,
          ],
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(error);
            }
          }
        );
      });
      for (const subtask of temporarySubtasks) {
        await new Promise((resolve, reject) => {
          this.db.run(
            `
          INSERT INTO subtasks (id, createdDate, completed, name, parentTaskId, deleted) VALUES (?, ?, ?, ?, ?, ?)
          `,
            [
              subtask.id,
              new Date().toISOString(),
              subtask.completed,
              subtask.name,
              task.id,
              subtask.deleted || false,
            ],
            (error) => {
              if (error) {
                reject(error);
              } else {
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
              resolve(error);
            }
          }
        );
      });

      for (const subtask of temporarySubtasks) {
        const idExistsInSubtasks: boolean = await this.idExistsInSubtasks(
          subtask.id
        );
        // if the subtask has an id and is marked deleted, delete it
        if (subtask.deleted) {
          await this.deleteSubtask(subtask.id);
        }

        // if the subtask doesn't exist in the db yet, it should be inserted
        else if (!idExistsInSubtasks) {
          const id = `subtask-${nanoid()}`;
          await new Promise((resolve, reject) => {
            this.db.run(
              `
              INSERT INTO subtasks (id, createdDate, completed, name, parentTaskId) VALUES (?, ?, ?, ?, ?)
              `,
              [
                id,
                subtask.createdDate,
                subtask.completed,
                subtask.name,
                updatedTask.id,
              ],
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(error);
                }
              }
            );
          });
        } else if (subtask.id) {
          // if the subtask has an id and is not marked delete, update it
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
      this.db.run(
        `
        UPDATE tasks SET deleted = 1 WHERE id = ?
        `,
        [taskId],
        (error) => {
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
        `SELECT * FROM tasks 
        ORDER BY 
          CASE
            WHEN deadline == "" THEN 1
            ELSE 0
          END,
          deadline,
          CASE
            WHEN priority = "high" THEN 1
            WHEN priority = "middle" THEN 2
            WHEN priority = "low" THEN 3
            ELSE 4
          END
        `,
        (error: Error | null, rows: Task[]) => {
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
    completedStatus: boolean
  ): Promise<void> {
    const newCompletionStatus = !completedStatus;
    const completedDate = newCompletionStatus ? new Date().toISOString() : null;
    const existsInTasks = await this.idExistsInTasks(taskId);

    if (!existsInTasks) {
      console.error(`Task ID ${taskId} not found in tasks table.`);
      return;
    }

    return new Promise((resolve, reject) => {
      this.db.run(
        `
        UPDATE tasks SET completed = ?, completedDate = ? WHERE id = ?
        `,
        [newCompletionStatus, completedDate, taskId],
        (error) => {
          if (error) {
            reject(error);
          } else {
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

  // function to know if task has checkbox or icon to visualize whether it has subtasks or not
  async taskHasSubtasks(taskId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `
          SELECT COUNT(*) as count FROM subtasks WHERE parentTaskId = ? AND deleted = 0
          `,
        [taskId],
        (error, row) => {
          if (error) {
            reject(error);
          } else {
            resolve((row as { count?: number }).count > 0);
          }
        }
      );
    });
  }

  // METHODS FOR SUBTASKS
  async deleteSubtask(subtaskId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
        UPDATE subtasks SET deleted = 1 WHERE id = ?
        `,
        [subtaskId],
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getSubtaskById(subtaskId: string): Promise<Subtask> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `
        SELECT * FROM subtasks WHERE id = ?
        `,
        [subtaskId],
        (error, subtask) => {
          if (error) {
            reject(error);
          } else {
            resolve(subtask as Subtask);
          }
        }
      );
    });
  }

  private async idExistsInSubtasks(subtaskId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `
        SELECT id FROM subtasks WHERE id = ?
        `,
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
        `
        SELECT * FROM subtasks WHERE parentTaskId = ?
        `,
        [parentTaskId],
        (error: Error | null, rows: Subtask[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  async toggleSubtaskCompletion(taskId: string): Promise<void> {
    const subtaskInDb = await this.getSubtaskById(taskId);
    const newCompletionStatus = !subtaskInDb.completed;
    const completedDate = newCompletionStatus ? new Date().toISOString() : null;

    if (!subtaskInDb) {
      console.error(`${taskId} not found in tasks table.`);
      return;
    }

    return new Promise((resolve, reject) => {
      this.db.run(
        `
        UPDATE subtasks SET completed = ?, completedDate = ? WHERE id = ?
        `,
        [newCompletionStatus, completedDate, taskId],
        (error) => {
          if (error) {
            reject(error);
          } else {
            this.checkAllSubtasksCompleted(subtaskInDb.parentTaskId);
            resolve();
          }
        }
      );
    });
  }

  // METHODS FOR TOGGLING BEHAVIOR

  private async checkAllSubtasksCompleted(parentTaskId: string) {
    try {
      const [completedCount, totalCount] = await Promise.all([
        this.getSubtaskCount(parentTaskId, true),
        this.getSubtaskCount(parentTaskId, false),
      ]);

      if (completedCount === totalCount) {
        await this.toggleTaskCompletion(parentTaskId, false);
      } else {
        await this.toggleTaskCompletion(parentTaskId, true);
      }
    } catch (error) {
      console.error("Error checking subtasks completion:", error);
    }
  }

  private getSubtaskCount(
    parentId: string,
    completedOnly: boolean
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT COUNT(*) as count FROM subtasks WHERE parentTaskId = ? AND deleted = 0
      `;

      if (completedOnly) {
        sql += " AND completed = 1";
      }

      this.db.get(sql, [parentId], (error, count) => {
        if (error) {
          reject(error);
        } else {
          resolve((count as { count?: number }).count);
        }
      });
    });
  }

  // FUNCTIONS FOR GAMIFICATION
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
      // Fetch tasks completed today
      this.db.all(
        `
        SELECT * FROM tasks WHERE completedDate >= ? AND completedDate < ? AND deleted = 0
        `,
        [startDate, endDate],
        async (error, taskRows: Task[]) => {
          if (error) {
            reject(error);
            return;
          }

          let taskCount = 0;
          for (const task of taskRows) {
            if (!(await this.taskHasSubtasks(task.id))) {
              taskCount++;
            }
          }

          // Count subtasks completed today
          this.db.get(
            `
            SELECT COUNT(*) as count FROM subtasks WHERE completedDate >= ? AND completedDate < ? and deleted = 0
            `,
            [startDate, endDate],
            (subtaskError, subtaskRow) => {
              if (subtaskError) {
                reject(subtaskError);
                return;
              }
              // Sum the counts and resolve
              const totalCount =
                taskCount + (subtaskRow as { count?: number }).count;
              resolve(totalCount);
            }
          );
        }
      );
    });
  }

  // METHODS FOR SMARTRESPONSE
  async addSmartResponse(
    smartTask: SmartResponse,
    smartSubtasks: SmartSubtask[]
  ): Promise<SmartResponse> {
    return new Promise((resolve, reject) => {
      // insert the main task into smartResponseTasks table
      this.db.run(
        `
        INSERT INTO smartResponseTasks (requestId, id, createdDate, name, probability, subtasks) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          smartTask.requestId,
          smartTask.id,
          smartTask.createdDate,
          smartTask.name,
          smartTask.probability,
          smartSubtasks,
        ],
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(smartTask);
          }
        }
      );

      // insert subtasks into smartResponseSubtasks table
      for (const subtask of smartSubtasks) {
        new Promise((resolveSubtask, rejectSubtask) => {
          this.db.run(
            `
            INSERT INTO smartResponseSubtasks (id, createdDate, name, probability, parentTaskId) VALUES (?, ?, ?, ?, ?)
            `,
            [
              subtask.id,
              subtask.createdDate,
              subtask.name,
              subtask.probability,
              subtask.parentTaskId,
            ],
            (error) => {
              if (error) {
                rejectSubtask(error);
              } else {
                resolveSubtask(smartSubtasks);
              }
            }
          );
        });
      }
    });
  }
}

export const database = new Database();
