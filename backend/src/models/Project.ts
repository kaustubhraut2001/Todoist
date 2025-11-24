import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    color: string;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
            minlength: [1, 'Name must be at least 1 character'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        color: {
            type: String,
            default: '#808080',
            match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color code'],
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for task count
projectSchema.virtual('taskCount', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'projectId',
    count: true,
});

// Remove __v from JSON output
projectSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});

export const Project = mongoose.model<IProject>('Project', projectSchema);
