import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  teamNumber: {
    type: String,
    required: true,
    unique: true, // A team can only submit once
  },
  teamName: {
    type: String,
    required: true,
  },
  psNumber: {
    type: String,
    required: true,
  },
  psTitle: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
