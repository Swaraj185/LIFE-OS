import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import timeRoutes from './routes/time.js';
import taskRoutes from './routes/tasks.js';
import moneyRoutes from './routes/money.js';
import lendingRoutes from './routes/lending.js';
import fitnessRoutes from './routes/fitness.js';
import learningRoutes from './routes/learning.js';
import attendanceRoutes from './routes/attendance.js';
import sleepRoutes from './routes/sleep.js';
import profileRoutes from './routes/profile.js';
import productivityRoutes from './routes/productivity.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/time', timeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/money', moneyRoutes);
app.use('/api/lending', lendingRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/productivity', productivityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Life OS API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

