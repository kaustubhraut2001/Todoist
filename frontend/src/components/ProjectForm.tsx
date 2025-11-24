import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import type { Project } from '../types';

interface ProjectFormProps {
    project?: Project | null;
    onSubmit: (data: Partial<Project>) => Promise<void>;
    onCancel: () => void;
}

const COLORS = [
    '#dc2626', // red
    '#ea580c', // orange
    '#d97706', // amber
    '#16a34a', // green
    '#0284c7', // sky
    '#2563eb', // blue
    '#7c3aed', // violet
    '#db2777', // pink
];

export const ProjectForm = ({ project, onSubmit, onCancel }: ProjectFormProps) => {
    const [name, setName] = useState(project?.name || '');
    const [color, setColor] = useState(project?.color || COLORS[5]);
    const [isFavorite, setIsFavorite] = useState(project?.isFavorite || false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Project name is required');
            return;
        }

        try {
            setError('');
            setLoading(true);
            await onSubmit({
                name,
                color,
                isFavorite,
            });
        } catch (err) {
            setError('Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <Input
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Work, Personal"
                required
                autoFocus
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                </label>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-105'
                                }`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isFavorite"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isFavorite" className="text-sm text-gray-700">
                    Add to favorites
                </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" loading={loading}>
                    {project ? 'Update Project' : 'Create Project'}
                </Button>
            </div>
        </form>
    );
};
