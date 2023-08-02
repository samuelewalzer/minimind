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
    parentTaskId: Task['id'];
}

export interface AppStore {
    tasks: Task[];
}

export const appStore: AppStore = {
    tasks: [],
};

export interface SubtaskSuggestion {
    name: string;
    probability: number;
}

export interface SmartResponse {
    id: string;
    name: string;
    probability: number;
    subtasks: SubtaskSuggestion[];
}