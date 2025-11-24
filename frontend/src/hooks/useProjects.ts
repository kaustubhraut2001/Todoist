import { useState, useEffect } from 'react';
import { Project } from '../types';
import { projectService } from '../services/projectService';
import toast from 'react-hot-toast';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to fetch projects';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const createProject = async (data: any) => {
        try {
            const newProject = await projectService.createProject(data);
            setProjects((prev) => [newProject, ...prev]);
            toast.success('Project created successfully');
            return newProject;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to create project';
            toast.error(message);
            throw err;
        }
    };

    const updateProject = async (id: string, data: any) => {
        try {
            const updatedProject = await projectService.updateProject(id, data);
            setProjects((prev) =>
                prev.map((project) => (project._id === id ? updatedProject : project))
            );
            toast.success('Project updated successfully');
            return updatedProject;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to update project';
            toast.error(message);
            throw err;
        }
    };

    const deleteProject = async (id: string, deleteTasks = false) => {
        try {
            await projectService.deleteProject(id, deleteTasks);
            setProjects((prev) => prev.filter((project) => project._id !== id));
            toast.success('Project deleted successfully');
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to delete project';
            toast.error(message);
            throw err;
        }
    };

    return {
        projects,
        loading,
        error,
        createProject,
        updateProject,
        deleteProject,
        refetch: fetchProjects,
    };
};
