import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Task from '../models/Task.js';
import TimeEntry from '../models/TimeEntry.js';
import LearningLog from '../models/LearningLog.js';
import Sleep from '../models/Sleep.js';
import FitnessLog from '../models/FitnessLog.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { format, subDays } from 'date-fns';

const router = express.Router();

// Calculate productivity score for a specific date
router.get('/score/:date', authenticate, async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.userId;
    
    // Get user preferences
    const user = await User.findById(userId);
    const idealSleepHours = user?.preferences?.idealSleepHours || 8;
    const focusTimeGoal = user?.preferences?.dailyFocusTimeGoal || 240; // minutes
    
    // Get today's data
    const [tasks, timeEntries, learningLogs, sleepLog, fitnessLogs, attendanceRecords] = await Promise.all([
      Task.find({ userId, date }),
      TimeEntry.find({ userId, date }),
      LearningLog.find({ userId, date }),
      Sleep.findOne({ userId, date }),
      FitnessLog.find({ userId, date }),
      Attendance.find({ userId, date }),
    ]);
    
    // Calculate components
    const tasksCompleted = tasks.filter(t => t.completed).length;
    const tasksTotal = tasks.length;
    const tasksScore = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 25 : 0;
    
    // Focus time (Study + Work categories)
    const focusTime = timeEntries
      .filter(e => e.category === 'study' || e.category === 'work' || e.category === 'Study' || e.category === 'Work')
      .reduce((sum, e) => sum + (e.duration || 0), 0); // in minutes
    const focusScore = Math.min((focusTime / focusTimeGoal) * 25, 25);
    
    // Learning activity
    const learningTime = learningLogs.reduce((sum, l) => sum + (l.duration || 0), 0);
    const learningScore = learningTime > 0 ? 15 : 0;
    
    // Sleep hours and quality
    let sleepScore = 0;
    if (sleepLog) {
      const sleepHoursScore = Math.min((sleepLog.totalSleepHours / idealSleepHours) * 10, 10);
      const qualityMap = { '1': 0, '2': 1, '3': 2.5, '4': 4, '5': 5, 'Poor': 0, 'Average': 2.5, 'Good': 5 };
      const qualityScore = qualityMap[sleepLog.quality] || 0;
      sleepScore = sleepHoursScore + qualityScore;
    }
    
    // Fitness
    const fitnessScore = fitnessLogs.length > 0 ? 10 : 0;
    
    // Attendance
    const presentCount = attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;
    const totalAttendance = attendanceRecords.length;
    const attendanceScore = totalAttendance > 0 ? (presentCount / totalAttendance) * 10 : 0;
    
    // Total score
    const totalScore = Math.round(
      tasksScore + focusScore + learningScore + sleepScore + fitnessScore + attendanceScore
    );
    
    // Get previous day score for comparison
    const previousDate = format(subDays(new Date(date), 1), 'yyyy-MM-dd');
    let previousScore = null;
    let scoreChange = null;
    
    try {
      const prevTasks = await Task.find({ userId, date: previousDate });
      const prevTimeEntries = await TimeEntry.find({ userId, date: previousDate });
      const prevLearningLogs = await LearningLog.find({ userId, date: previousDate });
      const prevSleepLog = await Sleep.findOne({ userId, date: previousDate });
      const prevFitnessLogs = await FitnessLog.find({ userId, date: previousDate });
      const prevAttendanceRecords = await Attendance.find({ userId, date: previousDate });
      
      const prevTasksCompleted = prevTasks.filter(t => t.completed).length;
      const prevTasksTotal = prevTasks.length;
      const prevTasksScore = prevTasksTotal > 0 ? (prevTasksCompleted / prevTasksTotal) * 25 : 0;
      
      const prevFocusTime = prevTimeEntries
        .filter(e => e.category === 'study' || e.category === 'work' || e.category === 'Study' || e.category === 'Work')
        .reduce((sum, e) => sum + (e.duration || 0), 0);
      const prevFocusScore = Math.min((prevFocusTime / focusTimeGoal) * 25, 25);
      
      const prevLearningTime = prevLearningLogs.reduce((sum, l) => sum + (l.duration || 0), 0);
      const prevLearningScore = prevLearningTime > 0 ? 15 : 0;
      
      let prevSleepScore = 0;
      if (prevSleepLog) {
        const prevSleepHoursScore = Math.min((prevSleepLog.totalSleepHours / idealSleepHours) * 10, 10);
        const qualityMap = { '1': 0, '2': 1, '3': 2.5, '4': 4, '5': 5, 'Poor': 0, 'Average': 2.5, 'Good': 5 };
        const prevQualityScore = qualityMap[prevSleepLog.quality] || 0;
        prevSleepScore = prevSleepHoursScore + prevQualityScore;
      }
      
      const prevFitnessScore = prevFitnessLogs.length > 0 ? 10 : 0;
      
      const prevPresentCount = prevAttendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;
      const prevTotalAttendance = prevAttendanceRecords.length;
      const prevAttendanceScore = prevTotalAttendance > 0 ? (prevPresentCount / prevTotalAttendance) * 10 : 0;
      
      previousScore = Math.round(
        prevTasksScore + prevFocusScore + prevLearningScore + prevSleepScore + prevFitnessScore + prevAttendanceScore
      );
      
      if (previousScore > 0) {
        scoreChange = ((totalScore - previousScore) / previousScore) * 100;
      }
    } catch (error) {
      // Previous day calculation failed, ignore
    }
    
    res.json({
      score: totalScore,
      previousScore,
      scoreChange: scoreChange !== null ? Math.round(scoreChange * 10) / 10 : null,
      breakdown: {
        tasks: Math.round(tasksScore),
        focus: Math.round(focusScore),
        learning: Math.round(learningScore),
        sleep: Math.round(sleepScore),
        fitness: Math.round(fitnessScore),
        attendance: Math.round(attendanceScore),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get insights
router.get('/insights/:date', authenticate, async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.userId;
    
    const user = await User.findById(userId);
    const idealSleepHours = user?.preferences?.idealSleepHours || 8;
    
    const [tasks, timeEntries, learningLogs, sleepLog, fitnessLogs] = await Promise.all([
      Task.find({ userId, date }),
      TimeEntry.find({ userId, date }),
      LearningLog.find({ userId, date }),
      Sleep.findOne({ userId, date }),
      FitnessLog.find({ userId, date }),
    ]);
    
    const insights = [];
    
    // Sleep insights
    if (sleepLog) {
      if (sleepLog.totalSleepHours < idealSleepHours - 1) {
        insights.push('Low sleep reduced productivity');
      }
      if (sleepLog.quality === 'Poor' || sleepLog.quality === '1' || sleepLog.quality === '2') {
        insights.push('Poor sleep quality affects focus');
      }
    } else {
      insights.push('No sleep data logged today');
    }
    
    // Fitness insights
    if (fitnessLogs.length > 0) {
      insights.push('Workout days improve focus');
    }
    
    // Task insights
    const tasksCompleted = tasks.filter(t => t.completed).length;
    const tasksTotal = tasks.length;
    const focusTime = timeEntries
      .filter(e => e.category === 'study' || e.category === 'work' || e.category === 'Study' || e.category === 'Work')
      .reduce((sum, e) => sum + (e.duration || 0), 0);
    
    if (tasksTotal > 0 && tasksCompleted < tasksTotal && focusTime > 120) {
      insights.push('Tasks missed despite good focus time');
    }
    
    // Learning insights
    if (learningLogs.length === 0) {
      insights.push('No learning activity today');
    }
    
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

