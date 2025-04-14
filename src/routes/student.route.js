// routes/student.routes.js
const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addParentToStudent,
  removeParentFromStudent,
  getStudentsByClass,
  getStudentsByStatus,
  updatePrimaryContact
} = require('../controllers/student.controller');

// Authentication middleware
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

// Basic CRUD routes
router.post('/', authenticate, authorizeRole(['admin', 'staff']), createStudent);
router.get('/', authenticate, getAllStudents);
router.get('/:id', authenticate, getStudentById);
router.put('/:id', authenticate, authorizeRole(['admin', 'staff']), updateStudent);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteStudent);

// Student-parent relationship routes
router.post('/add-parent', authenticate, authorizeRole(['admin', 'staff']), addParentToStudent);
router.delete('/:studentId/parent/:parentId', authenticate, authorizeRole(['admin', 'staff']), removeParentFromStudent);
router.put('/primary-contact', authenticate, authorizeRole(['admin', 'staff']), updatePrimaryContact);

// Filter routes
router.get('/class/:classId', authenticate, getStudentsByClass);
router.get('/status/:status', authenticate, getStudentsByStatus);

module.exports = router;