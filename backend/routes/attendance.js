import express from 'express';
import Attendance from '../models/Attendance.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all attendance records
router.get('/', authenticate, async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.userId }).sort({ date: -1, createdAt: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const allAttendance = await Attendance.find({ userId: req.userId });
    
    // Group by subject (Slot A removed)
    const subjectStats = {};
    const subjects = ['Power EDC', 'Concept in OS', 'Slot B', 'IACV/ML', 'Comm Network', 'FIT', 'Optical/WL Com', 'Biomed/Adaptive'];
    
    subjects.forEach(subject => {
      const subjectRecords = allAttendance.filter(a => a.subject === subject);
      // Exclude cancelled classes from attendance calculations
      const validRecords = subjectRecords.filter(a => a.status !== 'cancelled');
      const present = validRecords.filter(a => a.status === 'present').length;
      const absent = validRecords.filter(a => a.status === 'absent').length;
      const late = validRecords.filter(a => a.status === 'late').length;
      const cancelled = subjectRecords.filter(a => a.status === 'cancelled').length;
      const total = validRecords.length; // Only count non-cancelled classes
      const percentage = total > 0 ? ((present + late * 0.5) / total * 100).toFixed(1) : 0;
      
      subjectStats[subject] = {
        present,
        absent,
        late,
        cancelled,
        total,
        percentage: parseFloat(percentage),
      };
    });
    
    res.json(subjectStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create attendance record
router.post('/', authenticate, async (req, res) => {
  try {
    // Check if attendance already exists for this subject, date, and timeSlot
    const existing = await Attendance.findOne({
      userId: req.userId,
      subject: req.body.subject,
      date: req.body.date,
      timeSlot: req.body.timeSlot,
    });
    
    if (existing) {
      // Update existing record
      existing.status = req.body.status;
      existing.notes = req.body.notes || '';
      existing.isExtraClass = req.body.isExtraClass !== undefined ? req.body.isExtraClass : existing.isExtraClass;
      await existing.save();
      return res.json(existing);
    }
    
    const attendance = await Attendance.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Attendance already recorded for this class' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update attendance record
router.put('/:id', authenticate, async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      req.body,
      { new: true }
    );
    
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete attendance record
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

