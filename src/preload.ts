// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { Task } from './appStore';

const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})

declare global {
    interface Window {
        api: {
            addTask: (task: Task) => void;
            getTasks: () => Promise<Task[]>;
            deleteTask: (taskId: string) => void;
            editTask: (task: Task) => void;
        }
    }
}

contextBridge.exposeInMainWorld('api', {
    addTask: async (task: Task) => {
        await ipcRenderer.invoke('ADD_TASK', task);
    },

    getTasks: async () => {
        return await ipcRenderer.invoke('GET_TASKS');
    },

    deleteTask: async (taskId: string) => {
        await ipcRenderer.invoke('DELETE_TASK', taskId);
    },

    editTask: async (task: Task) => {
        await ipcRenderer.invoke('EDIT_TASK', task);
    }
})