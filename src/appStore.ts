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

export interface SmartSubtask {
    id: string;
    name: string;
    probability: number;
}

export interface SmartResponse {
    id: string;
    name: string;
    probability: number;
    subtasks: SmartSubtask[];
}
