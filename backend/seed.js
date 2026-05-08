/**
 * Database Seeding Script
 * Run this once to populate demo data
 *
 * Usage: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Task = require('./src/models/Task');
const config = require('./src/config');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('✓ Database cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
      isActive: true,
    });

    const member1 = await User.create({
      name: 'John Member',
      email: 'member@example.com',
      password: 'password123',
      role: 'Member',
      isActive: true,
    });

    const member2 = await User.create({
      name: 'Jane Member',
      email: 'jane@example.com',
      password: 'password123',
      role: 'Member',
      isActive: true,
    });

    console.log(`✓ Created 3 users:
  - Admin: admin@example.com
  - Member 1: member@example.com
  - Member 2: jane@example.com\n`);

    // Create projects
    console.log('📁 Creating projects...');
    const project1 = await Project.create({
      title: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      createdBy: admin._id,
      teamMembers: [admin._id, member1._id, member2._id],
      status: 'Active',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });

    const project2 = await Project.create({
      title: 'Mobile App Development',
      description: 'Native iOS and Android application development',
      createdBy: admin._id,
      teamMembers: [admin._id, member1._id],
      status: 'Active',
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    });

    console.log(`✓ Created 2 projects\n`);

    // Create tasks
    console.log('✅ Creating tasks...');
    const task1 = await Task.create({
      title: 'Design Homepage',
      description: 'Create mockups for the new homepage',
      projectId: project1._id,
      assignedTo: member1._id,
      createdBy: admin._id,
      status: 'In Progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    const task2 = await Task.create({
      title: 'Setup Database',
      description: 'Setup MongoDB database and create schema',
      projectId: project2._id,
      assignedTo: member1._id,
      createdBy: admin._id,
      status: 'Pending',
      priority: 'High',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    });

    const task3 = await Task.create({
      title: 'API Development',
      description: 'Develop RESTful API endpoints',
      projectId: project2._id,
      assignedTo: member1._id,
      createdBy: admin._id,
      status: 'Pending',
      priority: 'High',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    });

    const task4 = await Task.create({
      title: 'Frontend Components',
      description: 'Build reusable React components',
      projectId: project1._id,
      assignedTo: member2._id,
      createdBy: admin._id,
      status: 'Completed',
      priority: 'Medium',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (completed)
    });

    console.log(`✓ Created 4 tasks\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ Database seeded successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📊 Seed Summary:');
    console.log('  Users: 3 (1 Admin, 2 Members)');
    console.log('  Projects: 2');
    console.log('  Tasks: 4');
    console.log('\n🔐 Demo Credentials:');
    console.log('  Admin - admin@example.com / password123');
    console.log('  Member 1 - member@example.com / password123');
    console.log('  Member 2 - jane@example.com / password123');
    console.log('\n✅ Ready to start! Run: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
