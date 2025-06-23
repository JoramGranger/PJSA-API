// routes/schoolfees.routes.js
const express = require('express');
const router = express.Router();
const {
  createSchoolFees,
  getAllSchoolFees,
  getSchoolFeesById,
  updateSchoolFees,
  deleteSchoolFees,
  getSchoolFeesByStudent,
  getSchoolFeesByClass,
  getSchoolFeesByTerm,
  getStudentBalance,
  generateSchoolFeesReport,
  getAdminView
} = require('../controllers/schoolfees.controller');

// Authentication middleware
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

// Basic CRUD routes
router.post('/', authenticate, authorizeRole(['admin', 'bursar', 'accountant']), createSchoolFees);
router.get('/', authenticate, authorizeRole(['admin', 'bursar', 'accountant', 'staff']), getAllSchoolFees);
router.get('/:id', authenticate, authorizeRole(['admin', 'bursar', 'accountant', 'staff']), getSchoolFeesById);
router.put('/:id', authenticate, authorizeRole(['admin', 'bursar']), updateSchoolFees);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteSchoolFees);

// Student-specific routes
router.get('/student/:studentId', authenticate, getSchoolFeesByStudent);
router.get('/student/:studentId/balance', authenticate, getStudentBalance);

// Filter routes
router.get('/class/:classId', authenticate, authorizeRole(['admin', 'bursar', 'accountant', 'staff']), getSchoolFeesByClass);
router.get('/term/:termId', authenticate, authorizeRole(['admin', 'bursar', 'accountant', 'staff']), getSchoolFeesByTerm);

// Reporting and admin routes
router.get('/report/summary', authenticate, authorizeRole(['admin', 'bursar', 'accountant']), generateSchoolFeesReport);
router.get('/admin/view', authenticate, authorizeRole(['admin', 'bursar', 'accountant']), getAdminView);

module.exports = router;