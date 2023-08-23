export interface Task {
    id: string;
    createdDate: string;
    completed: boolean;
    completedDate: string;
    name: string;
    deadline: string;
    priority: string;
    subtasks: Subtask[];
    notes: string;
    deleted?: boolean;
    checkCount: number;
}

export interface Subtask {
    id: string;
    createdDate: string;
    name: string;
    completed: boolean;
    completedDate: string;
    parentTaskId: Task['id'];
    deleted?: boolean;
}

export interface AppStore {
    tasks: Task[];
}

export const appStore: AppStore = {
    tasks: [],
};

export interface SmartResponse {
    requestId: string,
    id: string;
    createdDate: string;
    name: string;
    probability: number;
    subtasks: SmartSubtask[];
}

export interface SmartSubtask {
    id: string;
    createdDate: string;
    name: string;
    probability: number;
    parentTaskId: Task['id'],
}