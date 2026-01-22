import express from 'express';
import TimeEntry from '../models/TimeEntry.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all time entries
router.get('/', authenticate, async (req, res) => {
  try {
    const entries = await TimeEntry.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create time entry
router.post('/', authenticate, async (req, res) => {
  try {
    const entry = await TimeEntry.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete time entry
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const entry = await TimeEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

