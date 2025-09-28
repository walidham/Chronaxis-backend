const mongoose = require('mongoose');
const Department = require('../models/Department');
const User = require('../models/User');
require('dotenv').config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check departments
    const departments = await Department.find();
    console.log('\n=== DEPARTMENTS ===');
    departments.forEach(dept => {
      console.log(`ID: ${dept._id}, Name: ${dept.name}`);
    });

    // Check users
    const users = await User.find().populate('department');
    console.log('\n=== USERS ===');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Role: ${user.role}, Department: ${user.department?.name || 'None'}`);
    });

    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
};

checkData();