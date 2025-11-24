import { useState, useEffect } from 'react';
import { Task, Project } from '../types';
import { Input } from './Input';
import { Button } from './Button';

interface TaskFormProps {
    task?: Task | null;
    projects: Project[];
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export const TaskForm = ({ task, projects, onSubmit, onCancel }: TaskFormProps) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 4,
        dueDate: '',
        projectId: '',
        tags: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                projectId: task.projectId || '',
                tags: task.tags.join(', '),
            });
        }
    }, [task]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title cannot exceed 200 characters';
        }

        if (formData.description.length > 2000) {
            newErrors.description = 'Description cannot exceed 2000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const data: any = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                priority: formData.priority,
                dueDate: formData.dueDate || null,
                projectId: formData.projectId || null,
                tags: formData.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag),
            };

            await onSubmit(data);
            onCancel();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
                placeholder="e.g., Complete project proposal"
                autoFocus
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Add more details..."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                        <option value={1}>P1 - Urgent</option>
                        <option value={2}>P2 - High</option>
                        <option value={3}>P3 - Medium</option>
                        <option value={4}>P4 - Low</option>
                    </select>
                </div>

                <Input
                    label="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                </label>
                <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                    <option value="">No Project</option>
                    {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            <Input
                label="Tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., work, urgent (comma-separated)"
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" loading={loading}>
                    {task ? 'Update Task' : 'Create Task'}
                </Button>
            </div>
        </form>
    );
};
