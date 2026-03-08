import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import api from '../utils/api'
import './SleepTracker.css'

export default function SleepTracker() {
  const [todaySleep, setTodaySleep] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    sleepStartTime: '',
    wakeUpTime: '',
    quality: 'Average',
    napDuration: ''
  })
  const [loading, setLoading] = useState(true)

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadTodaySleep()
  }, [])

  const loadTodaySleep = async () => {
    try {
      setLoading(true)
      const sleep = await api.getSleepByDate(today)
      setTodaySleep(sleep)
      if (sleep) {
        setFormData({
          sleepStartTime: sleep.sleepStartTime || '',
          wakeUpTime: sleep.wakeUpTime || '',
          quality: sleep.quality || 'Average',
          napDuration: sleep.napDuration || ''
        })
      }
    } catch (error) {
      console.error('Error loading sleep:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSleepHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0
    
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    let startMinutes = startHour * 60 + startMin
    let endMinutes = endHour * 60 + endMin
    
    // Handle overnight sleep (end time is next day)
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60
    }
    
    const totalMinutes = endMinutes - startMinutes
    return Math.round((totalMinutes / 60) * 10) / 10
  }

  const getSleepStatus = (hours, quality) => {
    if (hours < 6 || quality === 'Poor' || quality === '1' || quality === '2') {
      return 'Poor'
    }
    if (hours < 7 || quality === 'Average' || quality === '3') {
      return 'Low'
    }
    return 'Good'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.sleepStartTime || !formData.wakeUpTime) {
      alert('Please enter both sleep start time and wake-up time')
      return
    }

    const totalSleepHours = calculateSleepHours(formData.sleepStartTime, formData.wakeUpTime)
    const status = getSleepStatus(totalSleepHours, formData.quality)

    try {
      const sleepData = {
        date: today,
        sleepStartTime: formData.sleepStartTime,
        wakeUpTime: formData.wakeUpTime,
        totalSleepHours,
        quality: formData.quality,
        napDuration: formData.napDuration ? parseFloat(formData.napDuration) : 0,
        status
      }

      if (todaySleep) {
        await api.updateSleep(todaySleep._id, sleepData)
      } else {
        await api.createSleep(sleepData)
      }
      
      setShowForm(false)
      loadTodaySleep()
    } catch (error) {
      alert('Failed to save sleep data: ' + error.message)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete today\'s sleep log?')) {
      try {
        await api.deleteSleep(todaySleep._id)
        setTodaySleep(null)
        setFormData({
          sleepStartTime: '',
          wakeUpTime: '',
          quality: 'Average',
          napDuration: ''
        })
      } catch (error) {
        alert('Failed to delete: ' + error.message)
      }
    }
  }

  const qualityOptions = [
    { value: '1', label: '1 - Very Poor' },
    { value: '2', label: '2 - Poor' },
    { value: '3', label: '3 - Average' },
    { value: '4', label: '4 - Good' },
    { value: '5', label: '5 - Excellent' },
    { value: 'Poor', label: 'Poor' },
    { value: 'Average', label: 'Average' },
    { value: 'Good', label: 'Good' },
  ]

  if (loading) {
    return <div className="sleep-tracker">Loading...</div>
  }

  return (
    <div className="sleep-tracker">
      <div className="page-header">
        <h1>Sleep Tracker</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : todaySleep ? 'Edit Sleep' : '+ Log Sleep'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="card-title">Log Sleep</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Sleep Start Time</label>
              <input
                type="time"
                className="input"
                value={formData.sleepStartTime}
                onChange={(e) => setFormData({ ...formData, sleepStartTime: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Wake-up Time</label>
              <input
                type="time"
                className="input"
                value={formData.wakeUpTime}
                onChange={(e) => setFormData({ ...formData, wakeUpTime: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Sleep Quality</label>
              <select
                className="input"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              >
                {qualityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Nap Duration (minutes, optional)</label>
              <input
                type="number"
                className="input"
                value={formData.napDuration}
                onChange={(e) => setFormData({ ...formData, napDuration: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save Sleep Log</button>
            </div>
          </form>
        </div>
      )}

      {todaySleep && (
        <div className="card">
          <div className="sleep-header">
            <h2 className="card-title">Today's Sleep</h2>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
          
          <div className="sleep-summary">
            <div className="sleep-stat">
              <span className="sleep-value">{todaySleep.totalSleepHours}h</span>
              <span className="sleep-label">Total Sleep</span>
            </div>
            <div className="sleep-stat">
              <span className="sleep-value">{todaySleep.sleepStartTime}</span>
              <span className="sleep-label">Bedtime</span>
            </div>
            <div className="sleep-stat">
              <span className="sleep-value">{todaySleep.wakeUpTime}</span>
              <span className="sleep-label">Wake-up</span>
            </div>
            <div className="sleep-stat">
              <span className={`sleep-status sleep-status-${todaySleep.status.toLowerCase()}`}>
                {todaySleep.status}
              </span>
              <span className="sleep-label">Status</span>
            </div>
          </div>

          <div className="sleep-details">
            <div className="sleep-detail-item">
              <span className="detail-label">Quality:</span>
              <span className="detail-value">{todaySleep.quality}</span>
            </div>
            {todaySleep.napDuration > 0 && (
              <div className="sleep-detail-item">
                <span className="detail-label">Nap Duration:</span>
                <span className="detail-value">{todaySleep.napDuration} minutes</span>
              </div>
            )}
          </div>
        </div>
      )}

      {!todaySleep && !showForm && (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No sleep data logged for today. Click "+ Log Sleep" to get started.
          </p>
        </div>
      )}
    </div>
  )
}

