export interface Task {
    id: string;
    completed: boolean;
    name: string;
    deadline: Date;
    priority: string;
    subtasks: Subtask[];
    notes: string;
}

export interface Subtask {
    id: string;
    completed: boolean;
    name: string;
    parentTask: Task;
}

export interface AppStore {
    tasks: Task[];
}

export const appStore: AppStore = {
    tasks: [],
};