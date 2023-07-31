// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { Subtask, Task } from './appStore';

const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})

declare global {
    interface Window {
        api: {
            // Tasks
            addTask: (task: Task) => void;
            getTasks: () => Promise<Task[]>;
            deleteTask: (taskId: string) => void;
            editTask: (task: Task) => void;

            // Subtasks
            addSubtask: (subtask: Subtask) => void;
            deleteSubtask: (subtaskId: string) => void;
            editSubtask: (subtask: Subtask) => void;
            getSubtasksFromParent: (parentTaskId: string) => Promise<Subtask[]>;
        }
    }
}

contextBridge.exposeInMainWorld('api', {

    //Bridges for Tasks
    addTask: async (task: Task) => {
        await ipcRenderer.invoke('ADD_TASK', task);
    },
    
    getTasks: async () => {
        return await ipcRenderer.invoke('GET_TASKS');
    },
    
    editTask: async (task: Task) => {
        await ipcRenderer.invoke('EDIT_TASK', task);
    },

    deleteTask: async (taskId: string) => {
        await ipcRenderer.invoke('DELETE_TASK', taskId);
    },

    // Bridges for Subtasks
    addSubtask: async (subtask: Subtask) => {
        await ipcRenderer.invoke('ADD_SUBTASK', subtask);
    },

    deleteSubtask: async (taskId: string) => {
        await ipcRenderer.invoke('DELETE_TASK', taskId);
    },
    
    editSubtask: async (subtask: Subtask) => {
        await ipcRenderer.invoke('EDIT_SUBTASK', subtask);
    },

    getSubtasksFromParent: async (parentTaskId: string) => {
        await ipcRenderer.invoke('GET_SUBTASKS_FROM_PARENT', parentTaskId);
    },
})