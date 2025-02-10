// routes/requirementSet.routes.js
const express = require('express');
const router = express.Router();
const {
  createRequirementSet,
  getAllRequirementSets,
  getRequirementSetById,
  updateRequirementSet,
  deleteRequirementSet
} = require('../controllers/requirementSet.controller');

// Authenticate middleware (to protect routes)
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
router.post('/', authenticate, authorizeRole(['admin']), createRequirementSet);
router.get('/', authenticate, getAllRequirementSets);
router.get('/:id', authenticate, getRequirementSetById);
router.put('/:id', authenticate, authorizeRole(['admin']), updateRequirementSet);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteRequirementSet);

module.exports = router;