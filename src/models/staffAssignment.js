// models/StaffAssignment.js
const staffAssignmentSchema = new mongoose.Schema({
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'Term', required: true },
    role: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  }, { timestamps: true });
  
  staffAssignmentSchema.index({ staff: 1, term: 1 }, { unique: true });
  
  const StaffAssignment = mongoose.model('StaffAssignment', staffAssignmentSchema);