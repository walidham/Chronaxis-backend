const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
require('dotenv').config();

const assignDepartment = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@university.com' });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    // Find TI department
    const tiDepartment = await Department.findOne({ name: 'TI' });
    if (!tiDepartment) {
      console.log('TI department not found');
      return;
    }

    // Assign department to admin
    admin.department = tiDepartment._id;
    await admin.save();

    console.log('Department TI assigned to admin user successfully');

    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error assigning department:', error);
    process.exit(1);
  }
};

assignDepartment();