// routes/staff.routes.js
const express = require('express');
const router = express.Router();
const {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getStaffByDepartment,
  getStaffByStatus,
  addSubjectToTeacher,
  removeSubjectFromTeacher,
  addClassToTeacher,
  removeClassFromTeacher,
  createStaffWithAccount,
  getTeachersBySubject,
  getTeachersByClass
} = require('../controllers/staff.controller');

// Authentication middleware
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

// Basic CRUD routes
router.post('/', authenticate, authorizeRole(['admin']), createStaff);
router.get('/', authenticate, getAllStaff);
router.get('/:id', authenticate, getStaffById);
router.put('/:id', authenticate, authorizeRole(['admin']), updateStaff);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteStaff);

// Filter routes
router.get('/department/:department', authenticate, getStaffByDepartment);
router.get('/status/:status', authenticate, getStaffByStatus);

// Subject management routes
router.post('/add-subject', authenticate, authorizeRole(['admin']), addSubjectToTeacher);
router.delete('/:staffId/subject/:subjectId', authenticate, authorizeRole(['admin']), removeSubjectFromTeacher);
router.get('/subject/:subjectId', authenticate, getTeachersBySubject);

// Class management routes
router.post('/add-class', authenticate, authorizeRole(['admin']), addClassToTeacher);
router.delete('/:staffId/class/:classId', authenticate, authorizeRole(['admin']), removeClassFromTeacher);
router.get('/class/:classId', authenticate, getTeachersByClass);

// Create staff with user account
router.post('/with-account', authenticate, authorizeRole(['admin']), createStaffWithAccount);

module.exports = router;