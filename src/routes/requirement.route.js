const express = require('express');
const router = express.Router();
const {
  createRequirement,
  getAllRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement
} = require('../controllers/requirement.controller');

const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');
router.post('/', authenticate, authorizeRole(['admin']), createRequirement);
router.get('/', authenticate, getAllRequirements);
router.get('/:id', authenticate, getRequirementById);
router.put('/:id', authenticate, authorizeRole(['admin']), updateRequirement);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteRequirement);

module.exports = router;
