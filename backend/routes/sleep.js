import express from 'express';
import Sleep from '../models/Sleep.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all sleep logs
router.get('/', authenticate, async (req, res) => {
  try {
    const logs = await Sleep.find({ userId: req.userId }).sort({ date: -1, createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sleep log for a specific date
router.get('/date/:date', authenticate, async (req, res) => {
  try {
    const log = await Sleep.findOne({ 
      userId: req.userId, 
      date: req.params.date 
    });
    res.json(log || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create sleep log
router.post('/', authenticate, async (req, res) => {
  try {
    const log = await Sleep.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update sleep log
router.put('/:id', authenticate, async (req, res) => {
  try {
    const log = await Sleep.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!log) {
      return res.status(404).json({ error: 'Sleep log not found' });
    }
    
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete sleep log
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const log = await Sleep.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!log) {
      return res.status(404).json({ error: 'Sleep log not found' });
    }
    
    res.json({ message: 'Sleep log deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

