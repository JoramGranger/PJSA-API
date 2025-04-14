// routes/parent.routes.js
const express = require('express');
const router = express.Router();
const {
  createParent,
  getAllParents,
  getParentById,
  updateParent,
  deleteParent,
  addStudentToParent,
  removeStudentFromParent,
  getParentsByStudentId,
  createParentWithAccount
} = require('../controllers/parent.controller');

// Authenticate middleware (to protect routes)
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

// Basic CRUD routes
router.post('/', authenticate, authorizeRole(['admin', 'staff']), createParent);
router.get('/', authenticate, getAllParents);
router.get('/:id', authenticate, getParentById);
router.put('/:id', authenticate, authorizeRole(['admin', 'staff']), updateParent);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteParent);

// Parent-student relationship routes
router.post('/add-student', authenticate, authorizeRole(['admin', 'staff']), addStudentToParent);
router.delete('/:parentId/student/:studentId', authenticate, authorizeRole(['admin', 'staff']), removeStudentFromParent);
router.get('/student/:studentId', authenticate, getParentsByStudentId);

// Create parent with user account
router.post('/with-account', authenticate, authorizeRole(['admin']), createParentWithAccount);

module.exports = router;