// models/StudentTerm.js
const studentTermSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'Term', required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  }, { timestamps: true });
  
  // Compound index for efficient queries
  studentTermSchema.index({ student: 1, term: 1 }, { unique: true });
  
  const StudentTerm = mongoose.model('StudentTerm', studentTermSchema);