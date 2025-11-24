import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Project.deleteMany({});
        await Task.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create demo user
        const user = await User.create({
            name: 'Demo User',
            email: 'demo@todoist.com',
            passwordHash: 'password123',
        });
        console.log('👤 Created demo user (email: demo@todoist.com, password: password123)');

        // Create projects
        const workProject = await Project.create({
            userId: user._id,
            name: 'Work',
            color: '#3B82F6',
            isFavorite: true,
        });

        const personalProject = await Project.create({
            userId: user._id,
            name: 'Personal',
            color: '#10B981',
            isFavorite: false,
        });

        const shoppingProject = await Project.create({
            userId: user._id,
            name: 'Shopping',
            color: '#F59E0B',
            isFavorite: false,
        });

        console.log('📁 Created 3 projects');

        // Create tasks
        const tasks = [
            {
                userId: user._id,
                projectId: workProject._id,
                title: 'Complete project proposal',
                description: 'Finish the Q4 project proposal and send to stakeholders',
                priority: 1,
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                tags: ['urgent', 'work'],
            },
            {
                userId: user._id,
                projectId: workProject._id,
                title: 'Review pull requests',
                description: 'Review and merge pending PRs from the team',
                priority: 2,
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                tags: ['code-review'],
            },
            {
                userId: user._id,
                projectId: workProject._id,
                title: 'Update documentation',
                description: 'Update API documentation with new endpoints',
                priority: 3,
                completed: true,
                tags: ['documentation'],
            },
            {
                userId: user._id,
                projectId: personalProject._id,
                title: 'Book dentist appointment',
                description: 'Schedule annual checkup',
                priority: 2,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                tags: ['health'],
            },
            {
                userId: user._id,
                projectId: personalProject._id,
                title: 'Plan weekend trip',
                description: 'Research and book accommodation for weekend getaway',
                priority: 4,
                tags: ['travel', 'leisure'],
            },
            {
                userId: user._id,
                projectId: shoppingProject._id,
                title: 'Buy groceries',
                description: 'Milk, eggs, bread, vegetables',
                priority: 2,
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                tags: ['groceries'],
            },
            {
                userId: user._id,
                projectId: null,
                title: 'Call mom',
                description: 'Weekly catch-up call',
                priority: 1,
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                tags: ['family'],
            },
            {
                userId: user._id,
                projectId: null,
                title: 'Read "Atomic Habits"',
                description: 'Finish reading chapter 5',
                priority: 4,
                tags: ['reading', 'self-improvement'],
            },
        ];

        await Task.insertMany(tasks);
        console.log('✅ Created 8 sample tasks');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Login credentials:');
        console.log('   Email: demo@todoist.com');
        console.log('   Password: password123');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
