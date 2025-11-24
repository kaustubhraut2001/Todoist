import { Response } from 'express';
import { z } from 'zod';
import { Task } from '../models/Task.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Validation schemas
const createTaskSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    priority: z.number().int().min(1).max(4).optional(),
    dueDate: z.string().datetime().optional().or(z.null()),
    projectId: z.string().optional().or(z.null()),
    tags: z.array(z.string()).optional(),
});

const updateTaskSchema = createTaskSchema.partial();

// Get all tasks with filters
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const {
            projectId,
            priority,
            completed,
            q, // search query
            page = '1',
            limit = '50',
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        // Build filter
        const filter: any = { userId };

        if (projectId) {
            filter.projectId = projectId === 'null' ? null : projectId;
        }

        if (priority) {
            filter.priority = parseInt(priority as string);
        }

        if (completed !== undefined) {
            filter.completed = completed === 'true';
        }

        // Search in title and description
        if (q) {
            filter.$text = { $search: q as string };
        }

        // Pagination
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Sort
        const sort: any = {};
        sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

        // Query
        const tasks = await Task.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNum)
            .populate('projectId', 'name color');

        const total = await Task.countDocuments(filter);

        res.json({
            tasks,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        throw error;
    }
};

// Get single task
export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const task = await Task.findOne({ _id: id, userId }).populate('projectId', 'name color');

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json({ task });
    } catch (error) {
        throw error;
    }
};

// Create task
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const data = createTaskSchema.parse(req.body);

        const task = await Task.create({
            ...data,
            userId,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
        });

        await task.populate('projectId', 'name color');

        res.status(201).json({
            message: 'Task created successfully',
            task,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        throw error;
    }
};

// Update task
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const data = updateTaskSchema.parse(req.body);

        const task = await Task.findOneAndUpdate(
            { _id: id, userId },
            {
                ...data,
                ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
            },
            { new: true, runValidators: true }
        ).populate('projectId', 'name color');

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.json({
            message: 'Task updated successfully',
            task,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        throw error;
    }
};

// Delete task
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const task = await Task.findOneAndDelete({ _id: id, userId });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        throw error;
    }
};

// Toggle task completion
export const toggleComplete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const task = await Task.findOne({ _id: id, userId });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        task.completed = !task.completed;
        await task.save();
        await task.populate('projectId', 'name color');

        res.json({
            message: 'Task updated successfully',
            task,
        });
    } catch (error) {
        throw error;
    }
};
