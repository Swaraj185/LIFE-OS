import express from 'express';
import LearningLog from '../models/LearningLog.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all learning logs
router.get('/', authenticate, async (req, res) => {
  try {
    const logs = await LearningLog.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create learning log
router.post('/', authenticate, async (req, res) => {
  try {
    const log = await LearningLog.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete learning log
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const log = await LearningLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    
    res.json({ message: 'Log deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

