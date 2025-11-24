export interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Task {
    _id: string;
    userId: string;
    projectId?: string | null;
    title: string;
    description?: string;
    priority: 1 | 2 | 3 | 4;
    dueDate?: string | null;
    completed: boolean;
    completedAt?: string | null;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    project?: Project;
}

export interface Project {
    _id: string;
    userId: string;
    name: string;
    color: string;
    isFavorite: boolean;
    taskCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface ApiError {
    error: string;
    details?: any;
}

export interface TaskFilters {
    projectId?: string | null;
    priority?: number;
    completed?: boolean;
    dueDate?: string;
    q?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface TasksResponse {
    tasks: Task[];
    pagination: PaginationInfo;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    priority?: number;
    dueDate?: string | null;
    projectId?: string | null;
    tags?: string[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> { }

export interface CreateProjectData {
    name: string;
    color?: string;
    isFavorite?: boolean;
}

export interface UpdateProjectData extends Partial<CreateProjectData> { }
