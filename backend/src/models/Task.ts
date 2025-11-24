import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    userId: mongoose.Types.ObjectId;
    projectId?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    priority: number;
    dueDate?: Date;
    completed: boolean;
    completedAt?: Date;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
        },
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            minlength: [1, 'Title must be at least 1 character'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
            default: '',
        },
        priority: {
            type: Number,
            enum: [1, 2, 3, 4],
            default: 4,
            required: true,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        completed: {
            type: Boolean,
            default: false,
            index: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient queries
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, projectId: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

// Text index for search
taskSchema.index({ title: 'text', description: 'text' });

// Update completedAt when task is marked as completed
taskSchema.pre('save', function (next) {
    if (this.isModified('completed')) {
        this.completedAt = this.completed ? new Date() : null;
    }
    next();
});

// Remove __v from JSON output
taskSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
