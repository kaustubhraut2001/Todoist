import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { ProjectForm } from '../components/ProjectForm';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import {
    Plus,
    Search,
    Filter,
    CheckSquare,
    Inbox,
    Calendar,
    LogOut,
    Menu,
    X,
    Folder,
} from 'lucide-react';
import type { Task, TaskFilters } from '../types';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { projects, createProject } = useProjects();
    const [filters, setFilters] = useState<TaskFilters>({
        completed: false,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const { tasks, loading, createTask, updateTask, deleteTask, toggleComplete } = useTasks({
        ...filters,
        q: searchQuery || undefined,
    });

    const handleCreateTask = async (data: any) => {
        await createTask(data);
        setIsTaskModalOpen(false);
    };

    const handleCreateProject = async (data: any) => {
        await createProject(data);
        setIsProjectModalOpen(false);
    };

    const handleUpdateTask = async (data: any) => {
        if (editingTask) {
            await updateTask(editingTask._id, data);
            setEditingTask(null);
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(id);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const activeTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-0'
                    } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-8 h-8 text-primary-600" />
                        <h1 className="text-xl font-bold text-gray-900">Todoist</h1>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <button
                        onClick={() => setFilters({ ...filters, projectId: undefined })}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${!filters.projectId
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Inbox className="w-5 h-5" />
                        <span className="font-medium">Inbox</span>
                        <span className="ml-auto text-sm">{activeTasks.length}</span>
                    </button>

                    <button
                        onClick={() => {
                            const today = new Date().toISOString().split('T')[0];
                            setFilters({ ...filters, dueDate: today });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Today</span>
                    </button>

                    <div className="pt-4">
                        <div className="flex items-center justify-between px-4 mb-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Projects
                            </h3>
                            <button
                                onClick={() => setIsProjectModalOpen(true)}
                                className="text-gray-400 hover:text-primary-600 transition-colors"
                                title="Add Project"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        {projects.map((project) => (
                            <button
                                key={project._id}
                                onClick={() => setFilters({ ...filters, projectId: project._id })}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${filters.projectId === project._id
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Folder className="w-5 h-5" style={{ color: project.color }} />
                                <span className="font-medium truncate">{project.name}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <div className="flex-1 max-w-2xl relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <Button onClick={() => setIsTaskModalOpen(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </header>

                {/* Task List */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Filters */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <select
                                    value={filters.priority || ''}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            priority: e.target.value ? parseInt(e.target.value) : undefined,
                                        })
                                    }
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">All Priorities</option>
                                    <option value="1">P1 - Urgent</option>
                                    <option value="2">P2 - High</option>
                                    <option value="3">P3 - Medium</option>
                                    <option value="4">P4 - Low</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setFilters({ ...filters, completed: !filters.completed })}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.completed
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {filters.completed ? 'Show Active' : 'Show Completed'}
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="card">
                                <p className="text-sm text-gray-600">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                            </div>
                            <div className="card">
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-primary-600">{activeTasks.length}</p>
                            </div>
                            <div className="card">
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
                            </div>
                        </div>

                        {/* Task List */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                <p className="mt-4 text-gray-600">Loading tasks...</p>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                                <p className="text-gray-600 mb-6">
                                    {searchQuery
                                        ? 'Try adjusting your search'
                                        : 'Create your first task to get started'}
                                </p>
                                {!searchQuery && (
                                    <Button onClick={() => setIsTaskModalOpen(true)}>
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Task
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onToggle={toggleComplete}
                                        onEdit={setEditingTask}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Task Modal */}
            <Modal
                isOpen={isTaskModalOpen || !!editingTask}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setEditingTask(null);
                }}
                title={editingTask ? 'Edit Task' : 'Create Task'}
            >
                <TaskForm
                    task={editingTask}
                    projects={projects}
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onCancel={() => {
                        setIsTaskModalOpen(false);
                        setEditingTask(null);
                    }}
                />
            </Modal>

            {/* Project Modal */}
            <Modal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                title="Create Project"
            >
                <ProjectForm
                    onSubmit={handleCreateProject}
                    onCancel={() => setIsProjectModalOpen(false)}
                />
            </Modal>
        </div>
    );
};
