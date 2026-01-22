import express from 'express';
import FitnessLog from '../models/FitnessLog.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all fitness logs
router.get('/', authenticate, async (req, res) => {
  try {
    const logs = await FitnessLog.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create fitness log
router.post('/', authenticate, async (req, res) => {
  try {
    const log = await FitnessLog.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete fitness log
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const log = await FitnessLog.findOneAndDelete({
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

