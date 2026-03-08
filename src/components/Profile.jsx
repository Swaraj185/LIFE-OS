import { useState, useEffect } from 'react'
import api from '../utils/api'
import './Profile.css'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    idealSleepHours: 8,
    dailyFocusTimeGoal: 240,
    preferredWakeUpTime: '07:00',
    theme: 'light'
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const user = await api.getCurrentUser()
      const profileData = await api.getProfile()
      
      setProfile(profileData)
      setFormData({
        name: profileData.name || user.name || '',
        email: profileData.email || user.email || '',
        avatar: profileData.avatar || '',
        idealSleepHours: profileData.preferences?.idealSleepHours || 8,
        dailyFocusTimeGoal: profileData.preferences?.dailyFocusTimeGoal || 240,
        preferredWakeUpTime: profileData.preferences?.preferredWakeUpTime || '07:00',
        theme: profileData.preferences?.theme || 'light'
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      // Try to get basic user info
      try {
        const user = await api.getCurrentUser()
        setFormData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || ''
        }))
      } catch (e) {
        console.error('Error loading user:', e)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updated = await api.updateProfile({
        name: formData.name,
        avatar: formData.avatar,
        preferences: {
          idealSleepHours: parseFloat(formData.idealSleepHours),
          dailyFocusTimeGoal: parseInt(formData.dailyFocusTimeGoal),
          preferredWakeUpTime: formData.preferredWakeUpTime,
          theme: formData.theme
        }
      })
      
      setProfile(updated)
      alert('Profile updated successfully!')
      
      // Apply theme if changed
      if (formData.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    } catch (error) {
      alert('Failed to update profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return <div className="profile">Loading...</div>
  }

  return (
    <div className="profile">
      <div className="page-header">
        <h1>Profile</h1>
      </div>

      <div className="card">
        <h2 className="card-title">User Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email (Gmail)</label>
            <input
              type="email"
              name="email"
              className="input"
              value={formData.email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
              Email cannot be changed
            </small>
          </div>

          <div className="input-group">
            <label className="input-label">Avatar URL (optional)</label>
            <input
              type="url"
              name="avatar"
              className="input"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
            {formData.avatar && (
              <div style={{ marginTop: '1rem' }}>
                <img 
                  src={formData.avatar} 
                  alt="Avatar preview" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '2px solid #e2e8f0'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <h3 className="section-title">Daily Preferences</h3>

          <div className="input-group">
            <label className="input-label">Ideal Sleep Hours</label>
            <input
              type="number"
              name="idealSleepHours"
              className="input"
              value={formData.idealSleepHours}
              onChange={handleChange}
              min="4"
              max="12"
              step="0.5"
              required
            />
            <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
              Recommended: 7-9 hours
            </small>
          </div>

          <div className="input-group">
            <label className="input-label">Daily Focus Time Goal (minutes)</label>
            <input
              type="number"
              name="dailyFocusTimeGoal"
              className="input"
              value={formData.dailyFocusTimeGoal}
              onChange={handleChange}
              min="60"
              max="600"
              step="30"
              required
            />
            <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
              Recommended: 240 minutes (4 hours)
            </small>
          </div>

          <div className="input-group">
            <label className="input-label">Preferred Wake-up Time</label>
            <input
              type="time"
              name="preferredWakeUpTime"
              className="input"
              value={formData.preferredWakeUpTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Theme</label>
            <select
              name="theme"
              className="input"
              value={formData.theme}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

