const School = require("../models/school.model");

// 🟢 CREATE SCHOOL
exports.createSchool = async (req, res) => {
  try {
    const { name, location, box_number, email, phone } = req.body;
    
    // Check if school already exists
    const existingSchool = await School.findOne({ email });
    if (existingSchool) return res.status(400).json({ message: "School already exists" });

    const newSchool = new School({ name, location, box_number, email, phone });
    await newSchool.save();

    res.status(201).json({ message: "School created successfully", school: newSchool });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 GET ALL SCHOOLS
exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 GET A SINGLE SCHOOL BY ID
exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });

    res.json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 UPDATE SCHOOL
exports.updateSchool = async (req, res) => {
  try {
    const updatedSchool = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSchool) return res.status(404).json({ message: "School not found" });

    res.json({ message: "School updated successfully", school: updatedSchool });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 DELETE SCHOOL
exports.deleteSchool = async (req, res) => {
  try {
    const deletedSchool = await School.findByIdAndDelete(req.params.id);
    if (!deletedSchool) return res.status(404).json({ message: "School not found" });

    res.json({ message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};