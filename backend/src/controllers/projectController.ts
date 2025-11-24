import { Response } from 'express';
import { z } from 'zod';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Validation schemas
const createProjectSchema = z.object({
    name: z.string().min(1).max(100),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    isFavorite: z.boolean().optional(),
});

const updateProjectSchema = createProjectSchema.partial();

// Get all projects
export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;

        const projects = await Project.find({ userId })
            .sort({ isFavorite: -1, createdAt: -1 })
            .populate('taskCount');

        res.json({ projects });
    } catch (error) {
        throw error;
    }
};

// Get single project
export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const project = await Project.findOne({ _id: id, userId }).populate('taskCount');

        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        res.json({ project });
    } catch (error) {
        throw error;
    }
};

// Create project
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const data = createProjectSchema.parse(req.body);

        const project = await Project.create({
            ...data,
            userId,
        });

        await project.populate('taskCount');

        res.status(201).json({
            message: 'Project created successfully',
            project,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        throw error;
    }
};

// Update project
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const data = updateProjectSchema.parse(req.body);

        const project = await Project.findOneAndUpdate(
            { _id: id, userId },
            data,
            { new: true, runValidators: true }
        ).populate('taskCount');

        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        res.json({
            message: 'Project updated successfully',
            project,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        throw error;
    }
};

// Delete project
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const { deleteTasks } = req.query;

        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        // Delete tasks if requested, otherwise set projectId to null
        if (deleteTasks === 'true') {
            await Task.deleteMany({ projectId: id, userId });
        } else {
            await Task.updateMany({ projectId: id, userId }, { projectId: null });
        }

        await project.deleteOne();

        res.status(204).send();
    } catch (error) {
        throw error;
    }
};
