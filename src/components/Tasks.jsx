import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getData, addTask, updateTask } from '../utils/storage'
import './Tasks.css'

export default function Tasks() {
  const [todayTasks, setTodayTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [taskText, setTaskText] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadTodayTasks()
  }, [])

  const loadTodayTasks = () => {
    const data = getData()
    const tasks = data.tasks.filter(t => t.date === today)
    setTodayTasks(tasks.sort((a, b) => new Date(b.id) - new Date(a.id)))
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!taskText.trim()) return

    addTask({
      text: taskText.trim(),
      date: today
    })

    setTaskText('')
    setShowForm(false)
    loadTodayTasks()
  }

  const handleToggleTask = (id) => {
    const task = todayTasks.find(t => t.id === id)
    if (task) {
      updateTask(id, { completed: !task.completed })
      loadTodayTasks()
    }
  }

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id)
      loadTodayTasks()
    }
  }

  const filteredTasks = todayTasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const completedCount = todayTasks.filter(t => t.completed).length
  const totalCount = todayTasks.length

  return (
    <div className="tasks">
      <div className="page-header">
        <h1>Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="card-title">Add New Task</h2>
          <form onSubmit={handleAddTask}>
            <div className="input-group">
              <input
                type="text"
                className="input"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Task</button>
          </form>
        </div>
      )}

      <div className="card">
        <div className="tasks-header">
          <h2 className="card-title">Today's Tasks</h2>
          <div className="task-stats">
            {completedCount}/{totalCount} completed
          </div>
        </div>

        <div className="task-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="empty-state">
            {filter === 'all' 
              ? "No tasks for today. Add one to get started!" 
              : filter === 'active'
              ? "No active tasks. Great job!"
              : "No completed tasks yet."}
          </p>
        ) : (
          <div className="tasks-list">
            {filteredTasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="task-checkbox"
                />
                <span className="task-text">{task.text}</span>
                <button
                  className="task-delete"
                  onClick={() => handleDeleteTask(task.id)}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

