// controllers/subject.controller.js
const Subject = require("../models/subject.model");

// Create a new Subject
async function createSubject(req, res) {
  try {
    const { name, description } = req.body;

    const subject = new Subject({ name, description });
    await subject.save();

    res.status(201).json({ message: "Subject created successfully", data: subject });
  } catch (error) {
    res.status(500).json({ message: "Error creating subject", error: error.message });
  }
}

// Get all Subjects
async function getAllSubjects(req, res) {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error: error.message });
  }
}

// Get a Subject by ID
async function getSubjectById(req, res) {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subject", error: error.message });
  }
}

// Update a Subject by ID
async function updateSubject(req, res) {
  try {
    const { name, description } = req.body;
    const subject = await Subject.findByIdAndUpdate(req.params.id, { name, description }, { new: true });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject updated successfully", data: subject });
  } catch (error) {
    res.status(500).json({ message: "Error updating subject", error: error.message });
  }
}

// Delete a Subject by ID
async function deleteSubject(req, res) {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subject", error: error.message });
  }
}

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
};