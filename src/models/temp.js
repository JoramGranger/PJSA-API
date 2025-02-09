

// models/Expense.js
const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  term: { type: mongoose.Schema.Types.ObjectId, ref: 'Term', required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

// Example routes showing how to use the new structure
const router = express.Router();

// Get students in a term
router.get('/terms/:termId/students', async (req, res) => {
  try {
    const studentTerms = await StudentTerm.find({ 
      term: req.params.termId,
      status: 'active'
    }).populate('student');
    
    res.json(studentTerms.map(st => st.student));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add student to term
router.post('/terms/:termId/students', async (req, res) => {
  try {
    const studentTerm = new StudentTerm({
      student: req.body.studentId,
      term: req.params.termId
    });
    
    await studentTerm.save();
    res.status(201).json(studentTerm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get staff assigned to a term
router.get('/terms/:termId/staff', async (req, res) => {
  try {
    const staffAssignments = await StaffAssignment.find({
      term: req.params.termId,
      status: 'active'
    }).populate('staff');
    
    res.json(staffAssignments.map(sa => ({
      ...sa.staff.toObject(),
      role: sa.role
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;