import express from 'express';
import Lending from '../models/Lending.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all lending entries
router.get('/', authenticate, async (req, res) => {
  try {
    const entries = await Lending.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create lending entry
router.post('/', authenticate, async (req, res) => {
  try {
    const entry = await Lending.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lending entry (e.g., mark as returned)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const entry = await Lending.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lending entry
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const entry = await Lending.findOneAndDelete({
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

