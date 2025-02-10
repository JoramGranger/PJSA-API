// controllers/metadataController.js
const Metadata = require('../models/metadata.model');

// Create a new metadata entry
async function createMetadata(req, res) {
  try {
    const metadata = new Metadata(req.body);
    await metadata.save();
    res.status(201).json({ message: 'Metadata created successfully', data: metadata });
  } catch (error) {
    res.status(500).json({ message: 'Error creating metadata', error: error.message });
  }
}

// Get all metadata entries
async function getAllMetadata(req, res) {
  try {
    const metadata = await Metadata.find();
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metadata', error: error.message });
  }
}

// Get metadata by ID
async function getMetadataById(req, res) {
  try {
    const metadata = await Metadata.findById(req.params.id);
    if (!metadata) {
      return res.status(404).json({ message: 'Metadata not found' });
    }
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metadata', error: error.message });
  }
}

// Update metadata by ID
async function updateMetadata(req, res) {
  try {
    const metadata = await Metadata.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!metadata) {
      return res.status(404).json({ message: 'Metadata not found' });
    }
    res.status(200).json({ message: 'Metadata updated successfully', data: metadata });
  } catch (error) {
    res.status(500).json({ message: 'Error updating metadata', error: error.message });
  }
}

// Delete metadata by ID
async function deleteMetadata(req, res) {
  try {
    const metadata = await Metadata.findByIdAndDelete(req.params.id);
    if (!metadata) {
      return res.status(404).json({ message: 'Metadata not found' });
    }
    res.status(200).json({ message: 'Metadata deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting metadata', error: error.message });
  }
}

module.exports = {
  createMetadata,
  getAllMetadata,
  getMetadataById,
  updateMetadata,
  deleteMetadata
};
