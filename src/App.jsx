import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import api from './utils/api'
import Dashboard from './components/Dashboard'
import TimeTracker from './components/TimeTracker'
import Tasks from './components/Tasks'
import MoneyTracker from './components/MoneyTracker'
import LendingTracker from './components/LendingTracker'
import FitnessTracker from './components/FitnessTracker'
import LearningTracker from './components/LearningTracker'
import AttendanceTracker from './components/AttendanceTracker'
import WeeklyReport from './components/WeeklyReport'
import SleepTracker from './components/SleepTracker'
import Profile from './components/Profile'
import Auth from './components/Auth'

import './App.css'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/time', label: 'Activities', icon: '⏱️' },
    { path: '/tasks', label: 'Tasks', icon: '✓' },
    { path: '/money', label: 'Money', icon: '💰' },
    { path: '/lending', label: 'Lending', icon: '💸' },
    { path: '/fitness', label: 'Fitness', icon: '💪' },
    { path: '/learning', label: 'Learning', icon: '📚' },
    { path: '/attendance', label: 'Attendance', icon: '✅' },
    { path: '/sleep', label: 'Sleep', icon: '😴' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/report', label: 'Report', icon: '📈' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('lifeos_token')
    navigate('/auth')
    window.location.reload()
  }

  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await api.getCurrentUser()
        setUser(currentUser)
      } catch {
        setUser(null)
      }
    }
    loadUser()
  }, [])

  return (
    <nav className="navigation">
      <div className="nav-brand">Life OS</div>
      <div className="nav-links">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
      {user && (
        <div className="nav-footer">
          <div className="user-info">
            <span className="user-name">{user.name || user.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await api.getCurrentUser()
        setAuthenticated(!!user)
      } catch {
        setAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleAuthSuccess = (user) => {
    setAuthenticated(true)
  }

  if (loading) {
    return <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.2rem'
    }}>Loading...</div>
  }

  if (!authenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/time" element={<TimeTracker />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/money" element={<MoneyTracker />} />
            <Route path="/lending" element={<LendingTracker />} />
            <Route path="/fitness" element={<FitnessTracker />} />
            <Route path="/learning" element={<LearningTracker />} />
            <Route path="/attendance" element={<AttendanceTracker />} />
            <Route path="/sleep" element={<SleepTracker />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/report" element={<WeeklyReport />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
