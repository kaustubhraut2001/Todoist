import { Task } from '../types';
import { Calendar, Flag, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const priorityColors = {
    1: 'text-red-600 bg-red-50',
    2: 'text-orange-600 bg-orange-50',
    3: 'text-blue-600 bg-blue-50',
    4: 'text-gray-600 bg-gray-50',
};

const priorityLabels = {
    1: 'P1',
    2: 'P2',
    3: 'P3',
    4: 'P4',
};

export const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    return (
        <div className={`card hover:shadow-md transition-shadow ${task.completed ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task._id)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3
                        className={`text-base font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                    >
                        {task.title}
                    </h3>

                    {task.description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    {/* Meta info */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        {/* Priority */}
                        <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]
                                }`}
                        >
                            <Flag className="w-3 h-3" />
                            {priorityLabels[task.priority]}
                        </span>

                        {/* Due date */}
                        {task.dueDate && (
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${isOverdue
                                        ? 'text-red-600 bg-red-50'
                                        : 'text-gray-600 bg-gray-100'
                                    }`}
                            >
                                <Calendar className="w-3 h-3" />
                                {format(new Date(task.dueDate), 'MMM d')}
                            </span>
                        )}

                        {/* Project */}
                        {task.project && (
                            <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-medium"
                                style={{ backgroundColor: task.project.color }}
                            >
                                {task.project.name}
                            </span>
                        )}

                        {/* Tags */}
                        {task.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="Edit task"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
