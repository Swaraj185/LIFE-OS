import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getData, addLearningLog, deleteLearningLog } from '../utils/storage'
import './LearningTracker.css'

export default function LearningTracker() {
  const [todayLogs, setTodayLogs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    duration: '',
    type: 'study'
  })

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadTodayLogs()
  }, [])

  const loadTodayLogs = () => {
    const data = getData()
    const logs = data.learningLogs.filter(l => l.date === today)
    setTodayLogs(logs.sort((a, b) => new Date(b.id) - new Date(a.id)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.topic || !formData.duration) return

    addLearningLog({
      ...formData,
      duration: parseInt(formData.duration),
      date: today
    })

    setFormData({ topic: '', duration: '', type: 'study' })
    setShowForm(false)
    loadTodayLogs()
  }

  const quickLog = (topic) => {
    addLearningLog({
      topic,
      duration: 30,
      type: 'quick',
      date: today
    })
    loadTodayLogs()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this learning session?')) {
      deleteLearningLog(id)
      loadTodayLogs()
    }
  }

  const learningTypes = [
    { value: 'study', label: '📚 Study', color: '#667eea' },
    { value: 'course', label: '🎓 Course', color: '#48bb78' },
    { value: 'reading', label: '📖 Reading', color: '#ed8936' },
    { value: 'practice', label: '💻 Practice', color: '#9f7aea' },
    { value: 'research', label: '🔍 Research', color: '#4299e1' },
    { value: 'other', label: '⚪ Other', color: '#a0aec0' }
  ]

  const totalMinutes = todayLogs.reduce((sum, l) => sum + (l.duration || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return (
    <div className="learning-tracker">
      <div className="page-header">
        <h1>Learning Tracker</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log Learning'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="card-title">Log Learning Session</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Topic/Subject</label>
              <input
                type="text"
                className="input"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., JavaScript, Calculus, History chapter 5"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Type</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {learningTypes.map(type => (
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
                placeholder="30"
                min="1"
              />
            </div>

            <button type="submit" className="btn btn-primary">Log Session</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Quick Log</h2>
        <div className="quick-log-buttons">
          <button className="quick-log-btn" onClick={() => quickLog('Study Session')}>
            📚 Study
          </button>
          <button className="quick-log-btn" onClick={() => quickLog('Reading')}>
            📖 Read
          </button>
          <button className="quick-log-btn" onClick={() => quickLog('Practice')}>
            💻 Practice
          </button>
          <button className="quick-log-btn" onClick={() => quickLog('Course')}>
            🎓 Course
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Today's Summary</h2>
        <div className="learning-summary">
          <div className="learning-total">
            <span className="learning-value">{totalHours}h {remainingMinutes}m</span>
            <span className="learning-label">Total Learning Time</span>
          </div>
          <div className="learning-count">
            <span className="learning-count-value">{todayLogs.length}</span>
            <span className="learning-count-label">Sessions</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Today's Sessions</h2>
        {todayLogs.length === 0 ? (
          <p className="empty-state">No learning sessions logged today. Keep learning! 📚</p>
        ) : (
          <div className="logs-list">
            {todayLogs.map(log => {
              const learningType = learningTypes.find(t => t.value === log.type)
              const hours = Math.floor(log.duration / 60)
              const minutes = log.duration % 60
              return (
                <div key={log.id} className="log-item">
                  <div className="log-type" style={{ backgroundColor: `${learningType?.color}20`, color: learningType?.color }}>
                    {learningType?.label}
                  </div>
                  <div className="log-details">
                    <div className="log-topic">{log.topic}</div>
                    <div className="log-duration">
                      {hours > 0 && `${hours}h `}{minutes}m
                    </div>
                  </div>
                  <button
                    className="log-delete"
                    onClick={() => handleDelete(log.id)}
                    title="Delete session"
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
