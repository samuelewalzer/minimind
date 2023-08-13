// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { SmartResponse, Subtask, Task } from "./appStore";

import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

declare global {
  interface Window {
    api: {
      // Tasks
      addTask: (task: Task) => void;
      getTasks: () => Promise<Task[]>;
      toggleTaskCompletion: (taskId: string, completedStatus: boolean) => void;
      deleteTask: (taskId: string) => void;
      editTask: (task: Task) => void;
      taskHasSubtasks: (taskId: string) => Promise<boolean> 


      // Subtasks
      toggleSubtaskCompletion: (taskId: string) => void;
      getSubtasksFromParent: (parentTaskId: string) => Promise<Subtask[]>;

      // Gamification api
      getCompletedTodayCount: () => Promise<number>;

      // SmartInput
      // This method adds all the smart responses to the database in order to analyze them and returns the current smart response to display in the UI
      addSmartResponse: (input: string) => Promise<SmartResponse>;
    };
  }
}

contextBridge.exposeInMainWorld("api", {
  //Bridges for Tasks
  addTask: async (task: Task) => {
    await ipcRenderer.invoke("ADD_TASK", task);
  },

  getTasks: async () => {
    return await ipcRenderer.invoke("GET_TASKS");
  },

  editTask: async (task: Task) => {
    await ipcRenderer.invoke("EDIT_TASK", task);
  },

  toggleTaskCompletion: async (taskId: string, completedStatus: boolean) => {
    await ipcRenderer.invoke("TOGGLE_TASK_COMPLETED", taskId, completedStatus);
  },

  deleteTask: async (taskId: string) => {
    await ipcRenderer.invoke("DELETE_TASK", taskId);
  },

  taskHasSubtasks: async (taskId: string) => {
    return await ipcRenderer.invoke("TASK_HAS_SUBTASKS", taskId);
  },


  // Bridges for Subtasks
  addSubtask: async (subtask: Subtask) => {
    await ipcRenderer.invoke("ADD_SUBTASK", subtask);
  },

  deleteSubtask: async (taskId: string) => {
    await ipcRenderer.invoke("DELETE_TASK", taskId);
  },

  getSubtasksFromParent: async (parentTaskId: string) => {
    return await ipcRenderer.invoke("GET_SUBTASKS_FROM_PARENT", parentTaskId);
  },

  toggleSubtaskCompletion: async (subtaskId: string) => {
    return await ipcRenderer.invoke("TOGGLE_SUBTASK_COMPLETION", subtaskId);
  },

  // Bridge for gamification
  getCompletedTodayCount: async () => {
    return await ipcRenderer.invoke("GET_COMPLETED_TODAY_COUNT");
  },

  // Bridge for SmartResponse
  addSmartResponse: async (input: string) => {
    return await ipcRenderer.invoke("ADD_SMART_RESPONSE", input);
  },
});
