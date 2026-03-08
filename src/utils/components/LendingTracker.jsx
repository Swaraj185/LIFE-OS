import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import api from '../utils/api'
import './LendingTracker.css'

export default function LendingTracker() {
  const [todayLending, setTodayLending] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    type: 'given',
    description: ''
  })

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadTodayLending()
  }, [])

  const loadTodayLending = async () => {
    try {
      const allLending = await api.getLending()
      const todayEntries = allLending.filter(l => l.date === today)
      setTodayLending(todayEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error('Error loading lending:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.personName || !formData.amount) return

    try {
      await api.createLending({
        ...formData,
        amount: parseFloat(formData.amount),
        date: today
      })
      setFormData({ personName: '', amount: '', type: 'given', description: '' })
      setShowForm(false)
      loadTodayLending()
    } catch (error) {
      alert('Failed to create lending entry: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this lending entry?')) {
      try {
        await api.deleteLending(id)
        loadTodayLending()
      } catch (error) {
        alert('Failed to delete: ' + error.message)
      }
    }
  }

  const handleMarkReturned = async (id) => {
    try {
      await api.updateLending(id, { 
        returned: true,
        returnDate: today
      })
      loadTodayLending()
    } catch (error) {
      alert('Failed to update: ' + error.message)
    }
  }

  const totalGiven = todayLending
    .filter(l => l.type === 'given' && !l.returned)
    .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)

  const totalTaken = todayLending
    .filter(l => l.type === 'taken' && !l.returned)
    .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)

  const netLending = totalGiven - totalTaken

  const givenEntries = todayLending.filter(l => l.type === 'given')
  const takenEntries = todayLending.filter(l => l.type === 'taken')

  return (
    <div className="lending-tracker">
      <div className="page-header">
        <h1>Money Lending</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="card-title">Add Lending Entry</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Person Name</label>
              <input
                type="text"
                className="input"
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                placeholder="e.g., John, Friend, Bank"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Type</label>
              <select
                className="input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="given">💰 Money Given (I lent to someone)</option>
                <option value="taken">💵 Money Taken (I borrowed from someone)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Amount ($)</label>
              <input
                type="number"
                className="input"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Description (Optional)</label>
              <input
                type="text"
                className="input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Emergency loan, Lunch money"
              />
            </div>

            <button type="submit" className="btn btn-primary">Add Entry</button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Today's Summary</h2>
        <div className="lending-summary-grid">
          <div className="lending-summary-item">
            <span className="lending-value given">${totalGiven.toFixed(2)}</span>
            <span className="lending-label">Money Given (Outstanding)</span>
          </div>
          <div className="lending-summary-item">
            <span className="lending-value taken">${totalTaken.toFixed(2)}</span>
            <span className="lending-label">Money Taken (Outstanding)</span>
          </div>
          <div className="lending-summary-item">
            <span className={`lending-value ${netLending >= 0 ? 'positive' : 'negative'}`}>
              ${Math.abs(netLending).toFixed(2)}
            </span>
            <span className="lending-label">
              {netLending >= 0 ? 'Net Amount Given' : 'Net Amount Taken'}
            </span>
          </div>
        </div>
      </div>

      {givenEntries.length > 0 && (
        <div className="card">
          <h2 className="card-title">💰 Money Given (I Lent)</h2>
          <div className="lending-list">
            {givenEntries.map(entry => (
              <div key={entry._id} className={`lending-item ${entry.returned ? 'returned' : ''}`}>
                <div className="lending-info">
                  <div className="lending-person">{entry.personName}</div>
                  {entry.description && <div className="lending-desc">{entry.description}</div>}
                  {entry.returned && (
                    <div className="lending-status">✓ Returned on {entry.returnDate}</div>
                  )}
                </div>
                <div className="lending-amount given">${parseFloat(entry.amount).toFixed(2)}</div>
                <div className="lending-actions">
                  {!entry.returned && (
                    <button
                      className="btn-mark-returned"
                      onClick={() => handleMarkReturned(entry._id)}
                      title="Mark as returned"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="lending-delete"
                    onClick={() => handleDelete(entry._id)}
                    title="Delete entry"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {takenEntries.length > 0 && (
        <div className="card">
          <h2 className="card-title">💵 Money Taken (I Borrowed)</h2>
          <div className="lending-list">
            {takenEntries.map(entry => (
              <div key={entry._id} className={`lending-item ${entry.returned ? 'returned' : ''}`}>
                <div className="lending-info">
                  <div className="lending-person">{entry.personName}</div>
                  {entry.description && <div className="lending-desc">{entry.description}</div>}
                  {entry.returned && (
                    <div className="lending-status">✓ Returned on {entry.returnDate}</div>
                  )}
                </div>
                <div className="lending-amount taken">${parseFloat(entry.amount).toFixed(2)}</div>
                <div className="lending-actions">
                  {!entry.returned && (
                    <button
                      className="btn-mark-returned"
                      onClick={() => handleMarkReturned(entry._id)}
                      title="Mark as returned"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="lending-delete"
                    onClick={() => handleDelete(entry._id)}
                    title="Delete entry"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayLending.length === 0 && (
        <div className="card">
          <p className="empty-state">No lending entries for today. Track money you give or take!</p>
        </div>
      )}
    </div>
  )
}

