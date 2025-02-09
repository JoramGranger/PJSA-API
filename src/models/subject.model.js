// models/Subject.js
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: String,
    term: { type: mongoose.Schema.Types.ObjectId, ref: 'Term', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
  }, { timestamps: true });
  
  const Subject = mongoose.model('Subject', subjectSchema);