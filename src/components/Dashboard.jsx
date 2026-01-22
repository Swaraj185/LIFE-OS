import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format, isToday } from 'date-fns'
import { getData } from '../utils/storage'
import api from '../utils/api'
import './Dashboard.css'

export default function Dashboard() {
  const [todayStats, setTodayStats] = useState({
    timeTracked: 0,
    tasksCompleted: 0,
    tasksTotal: 0,
    expensesTotal: 0,
    fitnessLogged: false,
    learningLogged: false,
    attendancePercentage: 0,
    attendanceToday: 0
  })

  useEffect(() => {
    updateTodayStats()
    loadAttendanceStats()
  }, [])

  const loadAttendanceStats = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const [stats, attendance] = await Promise.all([
        api.getAttendanceStats(),
        api.getAttendance(),
      ])
      
      // Calculate overall average percentage
      const percentages = Object.values(stats).map(s => s.percentage)
      const overallPercentage = percentages.length > 0
        ? (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(1)
        : 0

      // Count today's attendance
      const todayAttendance = attendance.filter(a => a.date === today)
      const todayPresent = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length

      setTodayStats(prev => ({
        ...prev,
        attendancePercentage: parseFloat(overallPercentage),
        attendanceToday: todayPresent
      }))
    } catch (error) {
      // Silently fail if attendance API is not available
      console.error('Failed to load attendance stats:', error)
    }
  }

  const updateTodayStats = () => {
    const data = getData()
    const today = format(new Date(), 'yyyy-MM-dd')

    // Time tracked today (in hours)
    const todayTimeEntries = data.timeEntries.filter(e => e.date === today)
    const totalMinutes = todayTimeEntries.reduce((sum, e) => sum + (e.duration || 0), 0)
    const timeTracked = Math.round((totalMinutes / 60) * 10) / 10

    // Tasks
    const todayTasks = data.tasks.filter(t => t.date === today)
    const tasksCompleted = todayTasks.filter(t => t.completed).length
    const tasksTotal = todayTasks.length

    // Expenses
    const todayExpenses = data.expenses.filter(e => e.date === today)
    const expensesTotal = todayExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)

    // Fitness & Learning
    const fitnessLogged = data.fitnessLogs.some(f => f.date === today)
    const learningLogged = data.learningLogs.some(l => l.date === today)

    setTodayStats({
      timeTracked,
      tasksCompleted,
      tasksTotal,
      expensesTotal,
      fitnessLogged,
      learningLogged
    })
  }

  const statCards = [
    {
      title: 'Time Tracked',
      value: `${todayStats.timeTracked}h`,
      subtitle: 'today',
      link: '/time',
      icon: '⏱️',
      color: '#667eea'
    },
    {
      title: 'Tasks',
      value: `${todayStats.tasksCompleted}/${todayStats.tasksTotal}`,
      subtitle: 'completed',
      link: '/tasks',
      icon: '✓',
      color: '#48bb78'
    },
    {
      title: 'Expenses',
      value: `$${todayStats.expensesTotal.toFixed(2)}`,
      subtitle: 'today',
      link: '/money',
      icon: '💰',
      color: '#ed8936'
    },
    {
      title: 'Fitness',
      value: todayStats.fitnessLogged ? '✓ Logged' : 'Not logged',
      subtitle: 'today',
      link: '/fitness',
      icon: '💪',
      color: '#f56565'
    },
    {
      title: 'Learning',
      value: todayStats.learningLogged ? '✓ Logged' : 'Not logged',
      subtitle: 'today',
      link: '/learning',
      icon: '📚',
      color: '#9f7aea'
    },
    {
      title: 'Attendance',
      value: `${todayStats.attendancePercentage}%`,
      subtitle: `${todayStats.attendanceToday} classes today`,
      link: '/attendance',
      icon: '✅',
      color: '#4299e1'
    }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Today's Overview</h1>
        <p className="dashboard-date">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <Link key={index} to={card.link} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{card.value}</div>
              <div className="stat-title">{card.title}</div>
              <div className="stat-subtitle">{card.subtitle}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-section">
        <Link to="/report" className="report-cta">
          <span className="report-icon">📈</span>
          <div>
            <h3>View Weekly Report</h3>
            <p>See your planned vs actual performance, time waste, and patterns</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

