import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks, isSameWeek } from 'date-fns'
import { getData } from '../utils/storage'
import './WeeklyReport.css'

export default function WeeklyReport() {
  const [reportData, setReportData] = useState(null)
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  useEffect(() => {
    generateReport()
  }, [currentWeekStart])

  const generateReport = () => {
    const data = getData()
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
    const weekDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd })
    
    const weekDates = weekDays.map(d => format(d, 'yyyy-MM-dd'))

    // Time tracking analysis
    const weekTimeEntries = data.timeEntries.filter(e => weekDates.includes(e.date))
    const totalTimeMinutes = weekTimeEntries.reduce((sum, e) => sum + (e.duration || 0), 0)
    const avgDailyTime = totalTimeMinutes / 7
    const timeByCategory = {}
    weekTimeEntries.forEach(entry => {
      if (!timeByCategory[entry.category]) {
        timeByCategory[entry.category] = 0
      }
      timeByCategory[entry.category] += entry.duration || 0
    })

    // Task analysis
    const weekTasks = data.tasks.filter(t => weekDates.includes(t.date))
    const completedTasks = weekTasks.filter(t => t.completed).length
    const taskCompletionRate = weekTasks.length > 0 ? (completedTasks / weekTasks.length) * 100 : 0

    // Expense analysis
    const weekExpenses = data.expenses.filter(e => weekDates.includes(e.date))
    const totalSpent = weekExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    const avgDailySpending = totalSpent / 7
    const expensesByCategory = {}
    weekExpenses.forEach(expense => {
      if (!expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] = 0
      }
      expensesByCategory[expense.category] += parseFloat(expense.amount) || 0
    })

    // Fitness analysis
    const weekFitnessLogs = data.fitnessLogs.filter(f => weekDates.includes(f.date))
    const fitnessDays = new Set(weekFitnessLogs.map(f => f.date)).size
    const fitnessConsistency = (fitnessDays / 7) * 100
    const totalFitnessMinutes = weekFitnessLogs.reduce((sum, f) => sum + (f.duration || 0), 0)

    // Learning analysis
    const weekLearningLogs = data.learningLogs.filter(l => weekDates.includes(l.date))
    const learningDays = new Set(weekLearningLogs.map(l => l.date)).size
    const learningConsistency = (learningDays / 7) * 100
    const totalLearningMinutes = weekLearningLogs.reduce((sum, l) => sum + (l.duration || 0), 0)

    // Daily breakdown
    const dailyBreakdown = weekDates.map(date => {
      const dayEntries = data.timeEntries.filter(e => e.date === date)
      const dayTasks = data.tasks.filter(t => t.date === date)
      const dayExpenses = data.expenses.filter(e => e.date === date)
      const dayFitness = data.fitnessLogs.filter(f => f.date === date)
      const dayLearning = data.learningLogs.filter(l => l.date === date)

      return {
        date,
        dayName: format(new Date(date), 'EEE'),
        timeMinutes: dayEntries.reduce((sum, e) => sum + (e.duration || 0), 0),
        tasksCompleted: dayTasks.filter(t => t.completed).length,
        tasksTotal: dayTasks.length,
        expenses: dayExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0),
        fitnessLogged: dayFitness.length > 0,
        learningLogged: dayLearning.length > 0
      }
    })

    // Identify time waste (entertainment, social)
    const timeWasteMinutes = weekTimeEntries
      .filter(e => ['entertainment', 'social'].includes(e.category))
      .reduce((sum, e) => sum + (e.duration || 0), 0)
    const timeWastePercent = totalTimeMinutes > 0 ? (timeWasteMinutes / totalTimeMinutes) * 100 : 0

    setReportData({
      weekStart: format(currentWeekStart, 'MMM d'),
      weekEnd: format(weekEnd, 'MMM d, yyyy'),
      totalTimeHours: Math.floor(totalTimeMinutes / 60),
      totalTimeMins: totalTimeMinutes % 60,
      avgDailyTimeHours: Math.floor(avgDailyTime / 60),
      avgDailyTimeMins: Math.round(avgDailyTime % 60),
      timeByCategory,
      completedTasks,
      totalTasks: weekTasks.length,
      taskCompletionRate,
      totalSpent,
      avgDailySpending,
      expensesByCategory,
      fitnessDays,
      fitnessConsistency,
      totalFitnessHours: Math.floor(totalFitnessMinutes / 60),
      totalFitnessMins: totalFitnessMinutes % 60,
      learningDays,
      learningConsistency,
      totalLearningHours: Math.floor(totalLearningMinutes / 60),
      totalLearningMins: totalLearningMinutes % 60,
      dailyBreakdown,
      timeWasteHours: Math.floor(timeWasteMinutes / 60),
      timeWasteMins: timeWasteMinutes % 60,
      timeWastePercent
    })
  }

  const navigateWeek = (direction) => {
    if (direction === 'prev') {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1))
    } else {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1))
    }
  }

  if (!reportData) {
    return <div className="weekly-report">Loading...</div>
  }

  const categoryColors = {
    study: '#667eea',
    work: '#48bb78',
    exercise: '#f56565',
    social: '#ed8936',
    entertainment: '#9f7aea',
    food: '#ed8936',
    transport: '#4299e1',
    shopping: '#9f7aea',
    bills: '#48bb78',
    education: '#667eea',
    health: '#38b2ac',
    other: '#a0aec0'
  }

  return (
    <div className="weekly-report">
      <div className="report-header">
        <div>
          <h1>Weekly Life Report</h1>
          <p className="report-date">
            {reportData.weekStart} - {reportData.weekEnd}
          </p>
        </div>
        <div className="week-navigation">
          <button className="btn btn-secondary" onClick={() => navigateWeek('prev')}>
            ← Previous
          </button>
          {!isSameWeek(currentWeekStart, new Date(), { weekStartsOn: 1 }) && (
            <button className="btn btn-secondary" onClick={() => navigateWeek('next')}>
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="report-overview">
        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#667eea20', color: '#667eea' }}>
            ⏱️
          </div>
          <div className="overview-content">
            <div className="overview-value">{reportData.totalTimeHours}h {reportData.totalTimeMins}m</div>
            <div className="overview-label">Total Time Tracked</div>
            <div className="overview-sub">Avg: {reportData.avgDailyTimeHours}h {reportData.avgDailyTimeMins}m/day</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#48bb7820', color: '#48bb78' }}>
            ✓
          </div>
          <div className="overview-content">
            <div className="overview-value">{reportData.completedTasks}/{reportData.totalTasks}</div>
            <div className="overview-label">Tasks Completed</div>
            <div className="overview-sub">{reportData.taskCompletionRate.toFixed(0)}% completion rate</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#ed893620', color: '#ed8936' }}>
            💰
          </div>
          <div className="overview-content">
            <div className="overview-value">${reportData.totalSpent.toFixed(2)}</div>
            <div className="overview-label">Total Spent</div>
            <div className="overview-sub">Avg: ${reportData.avgDailySpending.toFixed(2)}/day</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#f5656520', color: '#f56565' }}>
            💪
          </div>
          <div className="overview-content">
            <div className="overview-value">{reportData.fitnessDays}/7</div>
            <div className="overview-label">Fitness Days</div>
            <div className="overview-sub">{reportData.fitnessConsistency.toFixed(0)}% consistency</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#9f7aea20', color: '#9f7aea' }}>
            📚
          </div>
          <div className="overview-content">
            <div className="overview-value">{reportData.learningDays}/7</div>
            <div className="overview-label">Learning Days</div>
            <div className="overview-sub">{reportData.learningConsistency.toFixed(0)}% consistency</div>
          </div>
        </div>
      </div>

      {/* Time Waste Alert */}
      {reportData.timeWastePercent > 30 && (
        <div className="card alert-card">
          <div className="alert-header">
            <span className="alert-icon">⚠️</span>
            <h3>Time Waste Alert</h3>
          </div>
          <p>
            You spent {reportData.timeWasteHours}h {reportData.timeWasteMins}m 
            ({reportData.timeWastePercent.toFixed(0)}%) on entertainment and social activities this week.
            Consider reducing this time for better productivity.
          </p>
        </div>
      )}

      {/* Daily Breakdown */}
      <div className="card">
        <h2 className="card-title">Daily Breakdown</h2>
        <div className="daily-breakdown">
          {reportData.dailyBreakdown.map(day => (
            <div key={day.date} className="day-card">
              <div className="day-name">{day.dayName}</div>
              <div className="day-stats">
                <div className="day-stat">
                  <span className="stat-label">Time</span>
                  <span className="stat-value">{Math.floor(day.timeMinutes / 60)}h {day.timeMinutes % 60}m</span>
                </div>
                <div className="day-stat">
                  <span className="stat-label">Tasks</span>
                  <span className="stat-value">{day.tasksCompleted}/{day.tasksTotal}</span>
                </div>
                <div className="day-stat">
                  <span className="stat-label">Spent</span>
                  <span className="stat-value">${day.expenses.toFixed(0)}</span>
                </div>
                <div className="day-icons">
                  {day.fitnessLogged && <span className="day-icon">💪</span>}
                  {day.learningLogged && <span className="day-icon">📚</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdowns */}
      <div className="report-grid">
        <div className="card">
          <h2 className="card-title">Time by Category</h2>
          <div className="category-list">
            {Object.entries(reportData.timeByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, minutes]) => {
                const hours = Math.floor(minutes / 60)
                const mins = minutes % 60
                const percent = reportData.totalTimeHours * 60 + reportData.totalTimeMins > 0
                  ? (minutes / (reportData.totalTimeHours * 60 + reportData.totalTimeMins)) * 100
                  : 0
                return (
                  <div key={category} className="category-bar-item">
                    <div className="category-bar-header">
                      <span className="category-bar-name">{category}</span>
                      <span className="category-bar-value">{hours}h {mins}m</span>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-bar-fill" 
                        style={{ 
                          width: `${percent}%`,
                          backgroundColor: categoryColors[category] || '#a0aec0'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Spending by Category</h2>
          <div className="category-list">
            {Object.entries(reportData.expensesByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const percent = reportData.totalSpent > 0
                  ? (amount / reportData.totalSpent) * 100
                  : 0
                return (
                  <div key={category} className="category-bar-item">
                    <div className="category-bar-header">
                      <span className="category-bar-name">{category}</span>
                      <span className="category-bar-value">${amount.toFixed(2)}</span>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-bar-fill" 
                        style={{ 
                          width: `${percent}%`,
                          backgroundColor: categoryColors[category] || '#a0aec0'
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Consistency Scores */}
      <div className="card">
        <h2 className="card-title">Consistency Scores</h2>
        <div className="consistency-grid">
          <div className="consistency-item">
            <div className="consistency-label">Fitness</div>
            <div className="consistency-bar">
              <div 
                className="consistency-fill" 
                style={{ 
                  width: `${reportData.fitnessConsistency}%`,
                  backgroundColor: '#f56565'
                }}
              />
            </div>
            <div className="consistency-value">{reportData.fitnessConsistency.toFixed(0)}%</div>
          </div>
          <div className="consistency-item">
            <div className="consistency-label">Learning</div>
            <div className="consistency-bar">
              <div 
                className="consistency-fill" 
                style={{ 
                  width: `${reportData.learningConsistency}%`,
                  backgroundColor: '#667eea'
                }}
              />
            </div>
            <div className="consistency-value">{reportData.learningConsistency.toFixed(0)}%</div>
          </div>
          <div className="consistency-item">
            <div className="consistency-label">Task Completion</div>
            <div className="consistency-bar">
              <div 
                className="consistency-fill" 
                style={{ 
                  width: `${reportData.taskCompletionRate}%`,
                  backgroundColor: '#48bb78'
                }}
              />
            </div>
            <div className="consistency-value">{reportData.taskCompletionRate.toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

