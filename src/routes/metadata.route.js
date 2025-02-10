// routes/metadataRoutes.js
const express = require("express");
const router = express.Router();
const {
  createMetadata,
  getAllMetadata,
  getMetadataById,
  updateMetadata,
  deleteMetadata
} = require("../controllers/metadata.controller");

const { authenticate, authorizeRole } = require("../middlewares/auth.middleware");


router.post("/", authenticate, authorizeRole(["admin"]), createMetadata);
router.get("/", authenticate, getAllMetadata);
router.get("/:id", authenticate, getMetadataById);
router.put("/:id", authenticate, authorizeRole(["admin"]), updateMetadata);
router.delete("/:id", authenticate, authorizeRole(["admin"]), deleteMetadata);

module.exports = router;
