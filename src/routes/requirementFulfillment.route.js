// routes/requirementFulfillment.routes.js
const express = require('express');
const router = express.Router();
const {
  createRequirementFulfillment,
  getAllRequirementFulfillments,
  getRequirementFulfillmentById,
  updateRequirementFulfillment,
  deleteRequirementFulfillment,
  getStudentFulfillments,
  getRequirementSetFulfillments,
  getStudentRequirementSetFulfillment,
  updateFulfillmentItems
} = require('../controllers/requirementFulfillment.controller');

// Authentication middleware
const { authenticate, authorizeRole } = require('../middlewares/auth.middleware');

// Base routes for requirement fulfillments
router.post('/', authenticate, authorizeRole(['admin', 'staff']), createRequirementFulfillment);
router.get('/', authenticate, getAllRequirementFulfillments);
router.get('/:id', authenticate, getRequirementFulfillmentById);
router.put('/:id', authenticate, authorizeRole(['admin', 'staff']), updateRequirementFulfillment);
router.delete('/:id', authenticate, authorizeRole(['admin']), deleteRequirementFulfillment);

// Student specific routes
router.get('/student/:studentId', authenticate, getStudentFulfillments);

// Requirement set specific routes
router.get('/requirement-set/:requirementSetId', authenticate, getRequirementSetFulfillments);

// Combined student and requirement set route
router.get('/student/:studentId/requirement-set/:requirementSetId', authenticate, getStudentRequirementSetFulfillment);

// Update specific fulfillment items
router.patch('/:fulfillmentId/items', authenticate, authorizeRole(['admin', 'staff']), updateFulfillmentItems);

module.exports = router;