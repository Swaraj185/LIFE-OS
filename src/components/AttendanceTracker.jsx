import { useState, useEffect } from 'react'
import { format, getDay, parseISO } from 'date-fns'
import api from '../utils/api'
import './AttendanceTracker.css'

// Timetable (Slot A subject removed; labs only Mon IACV/ML 2–4 and Fri Comm Network 2–4)
const TIMETABLE = {
  MONDAY: [
    { subject: 'Power EDC', timeSlot: 'Slot A' },
    { subject: 'Concept in OS', timeSlot: 'Slot B' },
    { subject: 'Slot B', timeSlot: 'Slot B' },
    { subject: 'IACV/ML', timeSlot: 'Slot C' },
    { subject: 'Comm Network', timeSlot: 'Slot D' },
    { subject: 'IACV/ML', timeSlot: 'Lab 2-4' },
  ],
  TUESDAY: [
    { subject: 'Concept in OS', timeSlot: 'Slot A' },
    { subject: 'Power EDC', timeSlot: 'Slot B' },
    { subject: 'FIT', timeSlot: 'Slot C' },
    { subject: 'Optical/WL Com', timeSlot: 'Slot D' },
    { subject: 'Biomed/Adaptive', timeSlot: 'Slot E' },
  ],
  WEDNESDAY: [
    { subject: 'FIT', timeSlot: 'Slot A' },
    { subject: 'Concept in OS', timeSlot: 'Slot B' },
    { subject: 'Slot B', timeSlot: 'Slot C' },
    { subject: 'Optical/WL Com', timeSlot: 'Slot D' },
    { subject: 'Biomed/Adaptive', timeSlot: 'Slot E' },
  ],
  THURSDAY: [
    { subject: 'Slot B', timeSlot: 'Slot A' },
    { subject: 'Comm Network', timeSlot: 'Slot B' },
    { subject: 'IACV/ML', timeSlot: 'Slot C' },
    { subject: 'Power EDC', timeSlot: 'Slot D' },
    { subject: 'FIT', timeSlot: 'Slot E' },
  ],
  FRIDAY: [
    { subject: 'Comm Network', timeSlot: 'Slot B' },
    { subject: 'IACV/ML', timeSlot: 'Slot C' },
    { subject: 'Biomed/Adaptive', timeSlot: 'Slot D' },
    { subject: 'Optical/WL Com', timeSlot: 'Slot E' },
    { subject: 'Comm Network', timeSlot: 'Lab 2-4' },
  ],
}

// All unique subjects from timetable (used for extra class selector)
const ALL_SUBJECTS = Array.from(
  new Set(
    Object.values(TIMETABLE)
      .flat()
      .map((cls) => cls.subject)
  )
)

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function AttendanceTracker() {
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState({})
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(true)
  const [extraClassSubject, setExtraClassSubject] = useState(ALL_SUBJECTS[0] || '')
  const [extraClassStatus, setExtraClassStatus] = useState('present')

  useEffect(() => {
    loadAttendance()
  }, [])

  const loadAttendance = async () => {
    try {
      setLoading(true)
      const [attendanceData, statsData] = await Promise.all([
        api.getAttendance(),
        api.getAttendanceStats(),
      ])
      setAttendance(attendanceData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDayName = (dateString) => {
    try {
      const date = parseISO(dateString)
      const dayIndex = getDay(date)
      // 0 = Sunday, 1 = Monday, ...
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1
      return adjustedIndex < 5 ? DAYS[adjustedIndex] : null
    } catch (error) {
      console.error('Error parsing date:', error)
      return null
    }
  }

  const getClassesForSelectedDate = () => {
    const dayName = getDayName(selectedDate)
    if (!dayName) return []
    return TIMETABLE[dayName] || []
  }

  const getAttendanceStatus = (subject, timeSlot) => {
    const record = attendance.find(
      (a) =>
        a.subject === subject &&
        a.timeSlot === timeSlot &&
        a.date === selectedDate
    )
    return record ? record.status : null
  }

  const markAttendance = async (subject, timeSlot, status) => {
    try {
      // Prevent marking attendance for future dates
      if (selectedDate > today) {
        alert('You can only mark attendance for today or past dates.')
        return
      }

      const existing = attendance.find(
        (a) =>
          a.subject === subject &&
          a.timeSlot === timeSlot &&
          a.date === selectedDate
      )

      if (existing) {
        if (status === null || status === existing.status) {
          await api.deleteAttendance(existing._id)
        } else {
          await api.updateAttendance(existing._id, { status })
        }
      } else if (status !== null) {
        const dayName = getDayName(selectedDate)
        const result = await api.createAttendance({
          subject,
          timeSlot,
          day: dayName || 'MONDAY',
          date: selectedDate,
          status,
        })
        console.log('Attendance created:', result)
      }

      await loadAttendance()
    } catch (error) {
      console.error('Failed to mark attendance:', error)
      const errorMessage = error.message || 'Failed to mark attendance. Please try again.'
      alert(errorMessage)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#48bb78'
      case 'absent':
        return '#f56565'
      case 'late':
        return '#ed8936'
      case 'cancelled':
        return '#a0aec0'
      default:
        return '#e2e8f0'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return '✓'
      case 'absent':
        return '✗'
      case 'late':
        return '⏰'
      case 'cancelled':
        return '🚫'
      default:
        return '○'
    }
  }

  const classesToday = getClassesForSelectedDate()
  const today = format(new Date(), 'yyyy-MM-dd')
  const isToday = selectedDate === today
  const maxDate = today // Only allow today or past dates

  const handleAddExtraClass = async () => {
    if (!extraClassSubject || !extraClassStatus) return

    // Prevent adding extra class for future dates
    if (selectedDate > today) {
      alert('You can only mark attendance for today or past dates.')
      return
    }

    try {
      const dayName = getDayName(selectedDate)
      await api.createAttendance({
        subject: extraClassSubject,
        timeSlot: 'Extra Class',
        day: dayName || 'MONDAY',
        date: selectedDate,
        status: extraClassStatus,
        isExtraClass: true,       // flag so we know it's extra
      })
      await loadAttendance()
      alert(`Extra class marked as ${extraClassStatus} and added to attendance.`)
    } catch (error) {
      console.error('Failed to add extra class:', error)
      alert('Failed to add extra class. Please try again.')
    }
  }

  return (
    <div className="attendance-tracker">
      <div className="page-header">
        <h1>Attendance Tracker</h1>
        <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              const selected = e.target.value
              // Prevent selecting future dates
              if (selected > today) {
                alert('You can only mark attendance for today or past dates.')
                return
              }
              setSelectedDate(selected)
            }}
            className="date-input"
            min="2020-01-01"
            max={maxDate}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading attendance data...</div>
      ) : (
        <>
          {classesToday.length > 0 && (
            <div className="card today-classes">
              <h2 className="card-title">
                {isToday ? "Today's" : 'Selected Date'} Classes (
                {DAY_NAMES[DAYS.indexOf(getDayName(selectedDate))]})
              </h2>
              <div className="classes-grid">
                {classesToday.map((cls, idx) => {
                  const status = getAttendanceStatus(cls.subject, cls.timeSlot)
                  return (
                    <div key={idx} className="class-card">
                      <div className="class-info">
                        <div className="class-subject">{cls.subject}</div>
                        <div className="class-time">{cls.timeSlot}</div>
                      </div>
                      <div className="attendance-buttons">
                        <button
                          className={`status-btn ${
                            status === 'present' ? 'active' : ''
                          }`}
                          style={{
                            backgroundColor:
                              status === 'present'
                                ? getStatusColor('present')
                                : 'transparent',
                            color:
                              status === 'present' ? 'white' : '#48bb78',
                            borderColor: getStatusColor('present'),
                          }}
                          onClick={() =>
                            markAttendance(
                              cls.subject,
                              cls.timeSlot,
                              status === 'present' ? null : 'present'
                            )
                          }
                        >
                          ✓ Present
                        </button>
                        <button
                          className={`status-btn ${
                            status === 'late' ? 'active' : ''
                          }`}
                          style={{
                            backgroundColor:
                              status === 'late'
                                ? getStatusColor('late')
                                : 'transparent',
                            color: status === 'late' ? 'white' : '#ed8936',
                            borderColor: getStatusColor('late'),
                          }}
                          onClick={() =>
                            markAttendance(
                              cls.subject,
                              cls.timeSlot,
                              status === 'late' ? null : 'late'
                            )
                          }
                        >
                          ⏱ Late
                        </button>
                        <button
                          className={`status-btn ${
                            status === 'absent' ? 'active' : ''
                          }`}
                          style={{
                            backgroundColor:
                              status === 'absent'
                                ? getStatusColor('absent')
                                : 'transparent',
                            color: status === 'absent' ? 'white' : '#f56565',
                            borderColor: getStatusColor('absent'),
                          }}
                          onClick={() =>
                            markAttendance(
                              cls.subject,
                              cls.timeSlot,
                              status === 'absent' ? null : 'absent'
                            )
                          }
                        >
                          ✗ Absent
                        </button>
                        <button
                          className={`status-btn ${
                            status === 'cancelled' ? 'active' : ''
                          }`}
                          style={{
                            backgroundColor:
                              status === 'cancelled'
                                ? getStatusColor('cancelled')
                                : 'transparent',
                            color:
                              status === 'cancelled' ? 'white' : '#a0aec0',
                            borderColor: getStatusColor('cancelled'),
                          }}
                          onClick={() =>
                            markAttendance(
                              cls.subject,
                              cls.timeSlot,
                              status === 'cancelled' ? null : 'cancelled'
                            )
                          }
                        >
                          🚫 Cancelled
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Weekly timetable with status indicators */}
          <div className="card">
            <h2 className="card-title">Weekly Timetable</h2>
            <div className="timetable">
              {DAYS.map((day, dayIdx) => {
                const classes = TIMETABLE[day]
                const todayDate = new Date()
                const currentDay = getDay(todayDate)
                const currentAdjusted = currentDay === 0 ? 6 : currentDay - 1
                const daysUntil = (dayIdx - currentAdjusted + 7) % 7
                const dateObj = new Date(todayDate)
                dateObj.setDate(todayDate.getDate() + daysUntil)
                const dateStr = format(dateObj, 'yyyy-MM-dd')
                const isSelectedDay = dateStr === selectedDate

                return (
                  <div
                    key={day}
                    className={`timetable-day ${isSelectedDay ? 'selected' : ''}`}
                  >
                    <div className="day-header">
                      <h3>{DAY_NAMES[dayIdx]}</h3>
                      <button
                        className="btn-small"
                        onClick={() => setSelectedDate(dateStr)}
                      >
                        View
                      </button>
                    </div>
                    <div className="day-classes">
                      {classes.map((cls, idx) => {
                        const status = getAttendanceStatus(
                          cls.subject,
                          cls.timeSlot
                        )
                        return (
                          <div key={idx} className="timetable-class">
                            <span className="class-name">{cls.subject}</span>
                            <span className="class-slot">{cls.timeSlot}</span>
                            {status && (
                              <span
                                className="status-indicator"
                                style={{
                                  backgroundColor: getStatusColor(status),
                                }}
                                title={
                                  status.charAt(0).toUpperCase() +
                                  status.slice(1)
                                }
                              >
                                {getStatusIcon(status)}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Extra class from timetable */}
          <div className="card">
            <h2 className="card-title">Extra Class (from timetable)</h2>
            <div className="extra-class-inline">
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Select Subject</label>
                <select
                  className="input"
                  value={extraClassSubject}
                  onChange={(e) => setExtraClassSubject(e.target.value)}
                >
                  {ALL_SUBJECTS.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Status</label>
                <select
                  className="input"
                  value={extraClassStatus}
                  onChange={(e) => setExtraClassStatus(e.target.value)}
                >
                  <option value="present">Went (Present)</option>
                  <option value="absent">Not Went (Absent)</option>
                  <option value="late">Late</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleAddExtraClass}
                style={{ alignSelf: 'flex-end', marginTop: '1.6rem' }}
              >
                + Add Extra Class
              </button>
            </div>
            <p className="extra-class-hint">
              This will add one more class for the selected subject on this date with the chosen status,
              and it will be counted in that subject&apos;s attendance percentage (cancelled classes don&apos;t reduce %).
            </p>
          </div>

          {/* Stats */}
          <div className="card">
            <h2 className="card-title">Attendance Statistics (%)</h2>
            <div className="stats-grid">
              {Object.entries(stats).map(([subject, stat]) => (
                <div key={subject} className="stat-card">
                  <div className="stat-subject">{subject}</div>
                  <div
                    className="stat-percentage"
                    style={{
                      color:
                        stat.percentage >= 75
                          ? '#48bb78'
                          : stat.percentage >= 50
                          ? '#ed8936'
                          : '#f56565',
                    }}
                  >
                    {stat.percentage}%
                  </div>
                  <div className="stat-details">
                    <span className="stat-present">✓ {stat.present}</span>
                    <span className="stat-late">⏰ {stat.late}</span>
                    <span className="stat-absent">✗ {stat.absent}</span>
                    {stat.cancelled > 0 && (
                      <span className="stat-cancelled">
                        🚫 {stat.cancelled} cancelled
                      </span>
                    )}
                    <span className="stat-total">Total: {stat.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}


