// models/Student.js
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: Date,
    email: String,
    phone: String,
    address: String,
    currentTerm: { type: mongoose.Schema.Types.ObjectId, ref: 'Term' }
  }, { timestamps: true });
  
  const Student = mongoose.model('Student', studentSchema);