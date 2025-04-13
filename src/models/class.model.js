const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  shortName: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('SchoolClass', classSchema);