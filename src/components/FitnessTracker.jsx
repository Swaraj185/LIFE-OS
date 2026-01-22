import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getData, addFitnessLog, deleteFitnessLog } from '../utils/storage'
import './FitnessTracker.css'

export default function FitnessTracker() {
  const [todayLogs, setTodayLogs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    activity: '',
    duration: '',
    type: 'gym'
  })

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadTodayLogs()
  }, [])

  const loadTodayLogs = () => {
    const data = getData()
    const logs = data.fitnessLogs.filter(l => l.date === today)
    setTodayLogs(logs.sort((a, b) => new Date(b.id) - new Date(a.id)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.activity || !formData.duration) return

    addFitnessLog({
      ...formData,
      duration: parseInt(formData.duration),
      date: today
    })

    setFormData({ activity: '', duration: '', type: 'gym' })
    setShowForm(false)
    loadTodayLogs()
  }

  const quickLog = (activity) => {
    addFitnessLog({
      activity,
      duration: 60,
      type: 'quick',
      date: today
    })
    loadTodayLogs()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this workout entry?')) {
      deleteFitnessLog(id)
      loadTodayLogs()
    }
  }

  const activityTypes = [
    { value: 'gym', label: '🏋️ Gym', color: '#f56565' },
    { value: 'cardio', label: '🏃 Cardio', color: '#ed8936' },
    { value: 'yoga', label: '🧘 Yoga', color: '#48bb78' },
    { value: 'sports', label: '⚽ Sports', color: '#4299e1' },
    { value: 'walk', label: '🚶 Walk', color: '#9f7aea' },
    { value: 'other', label: '⚪ Other', color: '#a0aec0' }
  ]

  const totalMinutes = todayLogs.reduce((sum, l) => sum + (l.duration || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return (
    <div className="fitness-tracker">
      <div className="page-header">
        <h1>Fitness Tracker</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log Workout'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="card-title">Log Workout</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Activity</label>
              <input
                type="text"
                className="input"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                placeholder="e.g., Chest day, Morning run, Basketball"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Type</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Duration (minutes)</label>
              <input
                type="number"
                className="input"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="60"
                min="1"
              />
            </div>

            <button type="submit" className="btn btn-primary">Log Workout</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Quick Log</h2>
        <div className="quick-log-buttons">
          <button className="quick-log-btn" onClick={() => quickLog('Gym Session')}>
            🏋️ Gym
          </button>
          <button className="quick-log-btn" onClick={() => quickLog('Morning Run')}>
            🏃 Run
          </button>
          <button className="quick-log-btn" onClick={() => quickLog('Yoga Session')}>
            🧘 Yoga
          </button>
          <button className="quick-log-btn" onClick={() => quickLog('Walk')}>
            🚶 Walk
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Today's Summary</h2>
        <div className="fitness-summary">
          <div className="fitness-total">
            <span className="fitness-value">{totalHours}h {remainingMinutes}m</span>
            <span className="fitness-label">Total Activity Time</span>
          </div>
          <div className="fitness-count">
            <span className="fitness-count-value">{todayLogs.length}</span>
            <span className="fitness-count-label">Workouts</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Today's Logs</h2>
        {todayLogs.length === 0 ? (
          <p className="empty-state">No workouts logged today. Get moving! 💪</p>
        ) : (
          <div className="logs-list">
            {todayLogs.map(log => {
              const activityType = activityTypes.find(t => t.value === log.type)
              const hours = Math.floor(log.duration / 60)
              const minutes = log.duration % 60
              return (
                <div key={log.id} className="log-item">
                  <div className="log-type" style={{ backgroundColor: `${activityType?.color}20`, color: activityType?.color }}>
                    {activityType?.label}
                  </div>
                  <div className="log-details">
                    <div className="log-activity">{log.activity}</div>
                    <div className="log-duration">
                      {hours > 0 && `${hours}h `}{minutes}m
                    </div>
                  </div>
                  <button
                    className="log-delete"
                    onClick={() => handleDelete(log.id)}
                    title="Delete workout"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
