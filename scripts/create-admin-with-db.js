const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to the specific database
    const mongoUri = 'mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/university-schedule?retryWrites=true&w=majority&appName=chronaxis';
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas - university-schedule database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@university.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@university.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    console.log('Admin user created successfully in university-schedule database:');
    console.log('Email: admin@university.com');
    console.log('Password: admin123');
    console.log('Database: university-schedule');

    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();