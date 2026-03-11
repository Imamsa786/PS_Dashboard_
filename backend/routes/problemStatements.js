import express from 'express';
import ProblemStatement from '../models/ProblemStatement.js';
import Submission from '../models/Submission.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all problem statements with submission count
// @route   GET /api/problem-statements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const problemStatements = await ProblemStatement.find({}).sort({ psNumber: 1 }).lean();
    
    // Get counts for each problem statement
    const problemStatementsWithCount = await Promise.all(
      problemStatements.map(async (ps) => {
        const selectedCount = await Submission.countDocuments({ psNumber: ps.psNumber });
        return {
          ...ps,
          selectedCount
        };
      })
    );

    res.json(problemStatementsWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching problem statements' });
  }
});

// @desc    Add a problem statement
// @route   POST /api/problem-statements
// @access  Private
router.post('/', protect, async (req, res) => {
  const { psNumber, title, description } = req.body;

  try {
    const psExists = await ProblemStatement.findOne({ psNumber });
    if (psExists) {
      return res.status(400).json({ message: 'Problem Statement number already exists' });
    }

    const ps = await ProblemStatement.create({ psNumber, title, description });
    res.status(201).json(ps);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating problem statement' });
  }
});

// @desc    Update a problem statement
// @route   PUT /api/problem-statements/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { psNumber, title, description } = req.body;

  try {
    const ps = await ProblemStatement.findById(req.params.id);

    if (ps) {
      ps.psNumber = psNumber || ps.psNumber;
      ps.title = title || ps.title;
      ps.description = description || ps.description;

      const updatedPS = await ps.save();
      res.json(updatedPS);
    } else {
      res.status(404).json({ message: 'Problem statement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating problem statement' });
  }
});

// @desc    Delete a problem statement
// @route   DELETE /api/problem-statements/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const ps = await ProblemStatement.findById(req.params.id);

    if (ps) {
      await ProblemStatement.findByIdAndDelete(req.params.id);
      res.json({ message: 'Problem statement removed' });
    } else {
      res.status(404).json({ message: 'Problem statement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting problem statement' });
  }
});

// @desc    Clear all problem statements
// @route   DELETE /api/problem-statements
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await ProblemStatement.deleteMany({});
    res.json({ message: 'All problem statements cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error clearing problem statements' });
  }
});

export default router;
