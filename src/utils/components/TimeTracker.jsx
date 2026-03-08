import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getData, addTimeEntry, deleteTimeEntry } from '../utils/storage'
import './TimeTracker.css'

export default function TimeTracker() {
  const [todayEntries, setTodayEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    activity: '',
    category: 'study',
    duration: '',
    planned: false
  })

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadTodayData()
  }, [])

  const loadTodayData = () => {
    const data = getData()
    const entries = data.timeEntries.filter(e => e.date === today)
    setTodayEntries(entries.sort((a, b) => new Date(b.id) - new Date(a.id)))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.activity || !formData.duration) return

    addTimeEntry({
      ...formData,
      duration: parseInt(formData.duration),
      date: today
    })

    setFormData({ activity: '', category: 'study', duration: '', planned: false })
    setShowForm(false)
    loadTodayData()
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this activity entry?')) {
      deleteTimeEntry(id)
      loadTodayData()
    }
  }

  const categories = [
    { value: 'study', label: '📚 Study', color: '#667eea' },
    { value: 'work', label: '💼 Work', color: '#48bb78' },
    { value: 'exercise', label: '🏃 Exercise', color: '#f56565' },
    { value: 'social', label: '👥 Social', color: '#ed8936' },
    { value: 'entertainment', label: '🎮 Entertainment', color: '#9f7aea' },
    { value: 'other', label: '⚪ Other', color: '#a0aec0' }
  ]

  const totalMinutes = todayEntries.reduce((sum, e) => sum + (e.duration || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  const categoryStats = categories.map(cat => {
    const entries = todayEntries.filter(e => e.category === cat.value)
    const minutes = entries.reduce((sum, e) => sum + (e.duration || 0), 0)
    return { ...cat, minutes, hours: Math.floor(minutes / 60), mins: minutes % 60 }
  }).filter(stat => stat.minutes > 0)

  return (
    <div className="time-tracker">
      <div className="page-header">
        <div>
          <h1>Activity Tracker</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Track how you spend your time
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log Activity'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="card-title">Log Activity</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Activity</label>
              <input
                type="text"
                className="input"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                placeholder="e.g., Math homework, Gym session"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                className="input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
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

            <button type="submit" className="btn btn-primary">Add Entry</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Today's Summary</h2>
        <div className="time-summary">
          <div className="time-total">
            <span className="time-value">{totalHours}h {remainingMinutes}m</span>
            <span className="time-label">Total Tracked</span>
          </div>
        </div>

        {categoryStats.length > 0 && (
          <div className="category-breakdown">
            <h3>By Category</h3>
            <div className="category-list">
              {categoryStats.map(stat => (
                <div key={stat.value} className="category-item">
                  <span className="category-name">{stat.label}</span>
                  <span className="category-time">{stat.hours}h {stat.mins}m</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Today's Entries</h2>
        {todayEntries.length === 0 ? (
          <p className="empty-state">No activities logged today. Start tracking your time!</p>
        ) : (
          <div className="entries-list">
            {todayEntries.map(entry => {
              const category = categories.find(c => c.value === entry.category)
              const hours = Math.floor(entry.duration / 60)
              const minutes = entry.duration % 60
              return (
                <div key={entry.id} className="entry-item">
                  <div className="entry-category" style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>
                    {category?.label}
                  </div>
                  <div className="entry-details">
                    <div className="entry-activity">{entry.activity}</div>
                    <div className="entry-duration">
                      {hours > 0 && `${hours}h `}{minutes}m
                    </div>
                  </div>
                  <button
                    className="entry-delete"
                    onClick={() => handleDelete(entry.id)}
                    title="Delete entry"
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
