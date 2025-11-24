import api from './api';
import {
    Task,
    TasksResponse,
    CreateTaskData,
    UpdateTaskData,
    TaskFilters,
} from '../types';

export const taskService = {
    async getTasks(filters?: TaskFilters): Promise<TasksResponse> {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });
        }

        const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
        return response.data;
    },

    async getTask(id: string): Promise<Task> {
        const response = await api.get<{ task: Task }>(`/tasks/${id}`);
        return response.data.task;
    },

    async createTask(data: CreateTaskData): Promise<Task> {
        const response = await api.post<{ task: Task; message: string }>('/tasks', data);
        return response.data.task;
    },

    async updateTask(id: string, data: UpdateTaskData): Promise<Task> {
        const response = await api.put<{ task: Task; message: string }>(`/tasks/${id}`, data);
        return response.data.task;
    },

    async deleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },

    async toggleComplete(id: string): Promise<Task> {
        const response = await api.patch<{ task: Task; message: string }>(`/tasks/${id}/toggle`);
        return response.data.task;
    },
};
