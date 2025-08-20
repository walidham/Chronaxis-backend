const Department = require('../models/Department');
const asyncHandler = require('express-async-handler');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({});
  res.json(departments);
});

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id)
    .populate('teachers')
    .populate('classes')
    .populate('studyPlan');
  
  if (department) {
    res.json(department);
  } else {
    res.status(404);
    throw new Error('Department not found');
  }
});

// @desc    Create a department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, head } = req.body;

  const department = await Department.create({
    name,
    description,
    head,
  });

  res.status(201).json(department);
});

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = asyncHandler(async (req, res) => {
  const { name, description, head } = req.body;

  const department = await Department.findById(req.params.id);

  if (department) {
    department.name = name || department.name;
    department.description = description || department.description;
    department.head = head || department.head;

    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } else {
    res.status(404);
    throw new Error('Department not found');
  }
});

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id);

  if (department) {
    res.json({ message: 'Department removed' });
  } else {
    res.status(404);
    throw new Error('Department not found');
  }
});

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};