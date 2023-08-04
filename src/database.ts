import sqlite3 from 'sqlite3';
import { SmartResponse, Subtask, Task } from './appStore';
import { nanoid } from 'nanoid';

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
    // TODO: change deadline to DATE
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        completed BOOLEAN,
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
        completed BOOLEAN,
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

  // functions for Tasks
  async addTask(task: Task): Promise<void> {
    const temporarySubtasks = [...task.subtasks];
    console.log(task);
    
    await new Promise((resolve, reject) => {
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
            if(error) {
              reject(error);
            } else {
              console.log(`Subtask ${subtask.name} added (${subtask.id})`)
              resolve(error);
            }
          }
        )
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  async editTask(updatedTask: Task): Promise<void> {
    try {
      const temporarySubtasks = updatedTask.subtasks ?? [];
      console.log(updatedTask)
      // Update the task in the tasks table
      await new Promise((resolve, reject) => {
        this.db.run(
                `
                UPDATE tasks SET completed = ?, name = ?, deadline = ?, priority = ?, subtasks = ?, notes = ? WHERE id = ?
                `,
                [
                  updatedTask.completed, 
                  updatedTask.name, 
                  updatedTask.deadline.toISOString(), 
                  updatedTask.priority, 
                  updatedTask.subtasks, 
                  updatedTask.notes, 
                  updatedTask.id
                ],
                (error) => {
                  if (error) {
                    reject(error);
                  } else {
                    console.log(`Task ${updatedTask.name} edited (${updatedTask.id})`)
                    resolve(error);
                  }
                }
              );
      });

      for (const subtask of temporarySubtasks) {
        // if the subtask doesn't have an id, it is a new one and should be inserted
        if(!subtask.id) {
          console.log("trying to insert subtask");
          await new Promise((resolve, reject) => {
            this.db.run(
              `
              INSERT INTO subtasks (id, completed, name, parentTaskId) VALUES (?, ?, ?, ?)
              `,
              [subtask.id, subtask.completed, subtask.name, updatedTask.id],
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  console.log(`Subtask ${subtask.name} added (${subtask.id})`)
                  resolve(error);
                }
              },
              );
            });
        // if the subtask has an id and is marked deleted, delete it 
        } else if (subtask.deleted) {
          console.log("trying to delete subtask");
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
                  console.log(`Subtask ${subtask.name} deleted (${subtask.id})`);
                  resolve(error);
                }
              });
            });
        } else {
          // if the subtask has an id and is not marked delete, update it
          console.log("trying to edit subtask");
          await new Promise((resolve, reject) => {
            this.db.run(
              `
              UPDATE subtasks SET name = ?, completed = ?, parentTaskId = ? WHERE id = ?
              `,
              [
                subtask.name,
                subtask.completed,
                updatedTask.id,
                subtask.id
              ],
              (error) => {
                if (error) {
                  reject(error);
                } else {
                  console.log(`Subtask ${subtask.name} edited (${subtask})`)
                  resolve(error);
                }
              }
            );
          });
        }
      }
    } catch (error) {
      console.error('Error editing task:', error)
      throw error;
    }
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

  // functions for Subtasks
  addSubtask(subtask: Subtask): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
        INSERT INTO subtasks (id, completed, name, parentTaskId) VALUES (?, ?, ?, ?)
        `,
        [subtask.id, subtask.completed, subtask.name, subtask.parentTaskId],
        error => {
          if (error) {
            reject(error);
          } else {
            console.log(`Subtask ${subtask.name} added (${subtask.id})`)
            resolve();
          }
        },
      );
    });
  }

  editSubtask( updatedSubtask: Subtask): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `
        UPDATE subtasks SET name = ?, completed = ?, parentTaskId = ? WHERE id = ?
        `,
        [updatedSubtask.name, updatedSubtask.completed, updatedSubtask.parentTaskId, updatedSubtask.id],
        error => {
          if (error) {
            reject(error);
          } else {
            console.log(`Subtask ${updatedSubtask.name} edited (${updatedSubtask.id})`)
            resolve();
          }
        }
      );
    });
  }

  async updateSubtasks(subtasks: Subtask[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        subtasks.forEach((subtask) => {
          // check is the subtask already exists and if not, add it to the db
          if(!subtask.id) {
             this.db.run(
              `
              INSERT INTO subtasks (id, completed, name, parentTaskId) VALUES (?, ?, ?, ?)
              `,
              [subtask.id, subtask.completed, subtask.name, subtask.parentTaskId],
              error => {
                if (error) {
                  reject(error);
                } else {
                  console.log(`Subtask ${subtask.name} added (${subtask.id})`)
                  resolve();
                }
              }
            );
          } else if (subtask.deleted){
            // the subtask has been deleted -> delete it from the db
            this.db.run(
              `
              DELETE FROM subtasks WHERE id = ?
              `,
              [subtask.id],
              error => {
                if (error) {
                  reject(error);
                } else {
                  console.log(`Subtask ${subtask.name} deleted (${subtask.id})`)
                  resolve();
                }
              }
            );
          } else {
            // the subtask exists -> update it
            this.db.run(
              `
              UPDATE subtasks SET name = ?, completed = ? WHERE id = ?
              `,
              [subtask.name, subtask.completed, subtask.id],
              error => {
                if (error) {
                  reject(error);
                } else {
                  console.log(`Subtask ${subtask.name} edited (${subtask.id})`)
                  resolve();
                }
              }
            );
          }
        });
      });

      // commit the transaction
      this.db.run('COMMIT', (error) => {
        if (error) {
          reject(error);
        } else {
          console.log(`Change submitted`)
          resolve();
        }
      })
    })
  }

  getSubtasksFromParent(parentTaskId: string): Promise<Subtask[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM subtasks WHERE parentTaskId = ?',
        [parentTaskId],
        (error: Error | null, rows: any[]) => {
          if (error) {
            reject(error);
          } else {
            // console.log(`Subtasks from parent ${parentTaskId} retrieved`);
            resolve(rows);
          }
        }
      );
    });
  }

  // function to handle submit of a new task or edit of an existing task

  // Functions for Smart Responses
  addSmartResponse(data: SmartResponse): Promise<SmartResponse> {
    return new Promise((resolve, reject) => {
      const id = `smartResponse-${nanoid()}`
      this.db.run(
        `
        INSERT INTO smartResponses (id, name, probability, subtasks) VALUES (?, ?, ?, ?)
        `,
        [id, data.name, data.probability, data.subtasks],
        error => {
          if (error) {
            reject(error);
          } else {
            console.log(`SmartResponse ${data.name} added (${id})`)
            resolve(data);
          }
        },
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