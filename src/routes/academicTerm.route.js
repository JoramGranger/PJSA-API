const express = require('express');
const router = express.Router();
const {
  createAcademicTerm,
  getAllAcademicTerms,
  getAcademicTermById,
  updateAcademicTerm,
  deleteAcademicTerm
} = require('../controllers/academicTerm.controller');

// Authenticate middleware (to protect routes)
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

router.post('/', authenticate, authorizeRole(['admin']), createAcademicTerm);
router.get('/', authenticate, getAllAcademicTerms);
router.get('/:id', authenticate, getAcademicTermById);
router.put('/:id', authenticate, authorizeRole(['admin']), updateAcademicTerm);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteAcademicTerm);

module.exports = router;