import { useState, useEffect } from 'react';
import { Task, TaskFilters } from '../types';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = (filters?: TaskFilters) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0,
        pages: 0,
    });

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await taskService.getTasks(filters);
            setTasks(response.tasks);
            setPagination(response.pagination);
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to fetch tasks';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [JSON.stringify(filters)]);

    const createTask = async (data: any) => {
        try {
            const newTask = await taskService.createTask(data);
            setTasks((prev) => [newTask, ...prev]);
            toast.success('Task created successfully');
            return newTask;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to create task';
            toast.error(message);
            throw err;
        }
    };

    const updateTask = async (id: string, data: any) => {
        try {
            const updatedTask = await taskService.updateTask(id, data);
            setTasks((prev) =>
                prev.map((task) => (task._id === id ? updatedTask : task))
            );
            toast.success('Task updated successfully');
            return updatedTask;
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to update task';
            toast.error(message);
            throw err;
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await taskService.deleteTask(id);
            setTasks((prev) => prev.filter((task) => task._id !== id));
            toast.success('Task deleted successfully');
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to delete task';
            toast.error(message);
            throw err;
        }
    };

    const toggleComplete = async (id: string) => {
        try {
            const updatedTask = await taskService.toggleComplete(id);
            setTasks((prev) =>
                prev.map((task) => (task._id === id ? updatedTask : task))
            );
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to update task';
            toast.error(message);
            throw err;
        }
    };

    return {
        tasks,
        loading,
        error,
        pagination,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        refetch: fetchTasks,
    };
};
