const express = require('express');
const router = express.Router();

const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
} = require('../controllers/class.controller');

const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

// Routes
router.post('/', authenticate, authorizeRole(['admin']), createClass);
router.get('/', authenticate, getAllClasses);
router.get('/:id', authenticate, getClassById);
router.put('/:id', authenticate, authorizeRole(['admin']), updateClass);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteClass);

module.exports = router;
