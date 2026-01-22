import express from 'express';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ========== EXPENSES ==========

// Get all expenses
router.get('/expenses', authenticate, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create expense
router.post('/expenses', authenticate, async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete('/expenses/:id', authenticate, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== INCOME ==========

// Get all income
router.get('/income', authenticate, async (req, res) => {
  try {
    const income = await Income.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create income
router.post('/income', authenticate, async (req, res) => {
  try {
    const income = await Income.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete income
router.delete('/income/:id', authenticate, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }
    
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

