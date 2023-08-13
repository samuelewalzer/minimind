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
}

export interface Subtask {
    id: string;
    createdDate: string;
    completed: boolean;
    completedDate: string;
    name: string;
    parentTaskId: Task['id'];
    deleted?: boolean;
}

export interface AppStore {
    tasks: Task[];
}

export const appStore: AppStore = {
    tasks: [],
};

export interface SubtaskSuggestion {
    name: string;
}

export interface SmartResponse {
    id: string;
    name: string;
    probability: number;
    subtasks: SubtaskSuggestion[];
}