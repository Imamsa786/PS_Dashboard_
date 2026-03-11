import express from 'express';
import Submission from '../models/Submission.js';
import { protect } from '../middleware/authMiddleware.js';
import exceljs from 'exceljs';

const router = express.Router();

// @desc    Create a submission
// @route   POST /api/submissions
// @access  Public
router.post('/', async (req, res) => {
  const { teamNumber, teamName, psNumber, psTitle } = req.body;

  try {
    const submissionExists = await Submission.findOne({ teamNumber });
    if (submissionExists) {
      return res.status(400).json({ message: 'Team already submitted. Duplicate submissions are not allowed.' });
    }

    // Check how many teams have selected this problem statement
    const psCount = await Submission.countDocuments({ psNumber });
    if (psCount >= 4) {
      return res.status(400).json({ message: 'This problem statement has already reached the maximum limit of 4 teams.' });
    }

    const submission = await Submission.create({ teamNumber, teamName, psNumber, psTitle });
    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Team already submitted.' });
    }
    res.status(500).json({ message: 'Server error creating submission' });
  }
});

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({}).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching submissions' });
  }
});

// @desc    Export submissions to Excel
// @route   GET /api/submissions/export
// @access  Private
router.get('/export', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({}).sort({ createdAt: 1 });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Submissions');

    worksheet.columns = [
      { header: 'Team No', key: 'teamNumber', width: 15 },
      { header: 'Team Name', key: 'teamName', width: 30 },
      { header: 'PS No', key: 'psNumber', width: 15 },
      { header: 'Problem Statement Title', key: 'psTitle', width: 50 },
      { header: 'Submission Time', key: 'createdAt', width: 25 },
    ];

    submissions.forEach((sub) => {
      worksheet.addRow({
        teamNumber: sub.teamNumber,
        teamName: sub.teamName,
        psNumber: sub.psNumber,
        psTitle: sub.psTitle,
        createdAt: new Date(sub.createdAt).toLocaleString(),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'submissions.xlsx'
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error exporting submissions' });
  }
});

// @desc    Clear all submissions
// @route   DELETE /api/submissions
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await Submission.deleteMany({});
    res.json({ message: 'All submissions cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error clearing submissions' });
  }
});

export default router;
