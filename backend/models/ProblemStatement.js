import mongoose from 'mongoose';

const problemStatementSchema = new mongoose.Schema({
  psNumber: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const ProblemStatement = mongoose.model('ProblemStatement', problemStatementSchema);

export default ProblemStatement;
