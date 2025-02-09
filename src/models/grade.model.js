// models/Grade.js
const gradeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'Term', required: true },
    score: { type: Number, required: true },
    remarks: String
  }, { timestamps: true });
  
  const Grade = mongoose.model('Grade', gradeSchema);