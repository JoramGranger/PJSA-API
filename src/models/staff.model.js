// models/Staff.js
const staffSchema = new mongoose.Schema({
    staffId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ['teacher', 'admin', 'support'], required: true }
  }, { timestamps: true });
  
  const Staff = mongoose.model('Staff', staffSchema);