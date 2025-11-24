import api from './api';
import { Project, CreateProjectData, UpdateProjectData } from '../types';

export const projectService = {
    async getProjects(): Promise<Project[]> {
        const response = await api.get<{ projects: Project[] }>('/projects');
        return response.data.projects;
    },

    async getProject(id: string): Promise<Project> {
        const response = await api.get<{ project: Project }>(`/projects/${id}`);
        return response.data.project;
    },

    async createProject(data: CreateProjectData): Promise<Project> {
        const response = await api.post<{ project: Project; message: string }>('/projects', data);
        return response.data.project;
    },

    async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
        const response = await api.put<{ project: Project; message: string }>(`/projects/${id}`, data);
        return response.data.project;
    },

    async deleteProject(id: string, deleteTasks = false): Promise<void> {
        await api.delete(`/projects/${id}?deleteTasks=${deleteTasks}`);
    },
};
