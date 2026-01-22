// Storage utility for managing all Life OS data

// Simple function to get storage key - avoids circular dependency
const getStorageKey = () => {
  try {
    // Try to get current user if auth module is available
    const currentUser = localStorage.getItem('lifeos_current_user')
    if (currentUser) {
      const user = JSON.parse(currentUser)
      return `lifeos_data_${user.id}`
    }
  } catch (e) {
    // Fallback if no user or error
  }
  return 'lifeos_data'
}

export const getData = () => {
  try {
    const STORAGE_KEY = getStorageKey()
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {
      timeEntries: [],
      tasks: [],
      expenses: [],
      income: [],
      fitnessLogs: [],
      learningLogs: [],
      plans: {} // daily plans
    }
  } catch (error) {
    console.error('Error loading data:', error)
    return {
      timeEntries: [],
      tasks: [],
      expenses: [],
      income: [],
      fitnessLogs: [],
      learningLogs: [],
      plans: {}
    }
  }
}

export const saveData = (data) => {
  try {
    const STORAGE_KEY = getStorageKey()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

export const addTimeEntry = (entry) => {
  const data = getData()
  data.timeEntries.push({
    ...entry,
    id: Date.now().toString(),
    date: entry.date || new Date().toISOString().split('T')[0]
  })
  saveData(data)
}

export const deleteTimeEntry = (id) => {
  const data = getData()
  data.timeEntries = data.timeEntries.filter(e => e.id !== id)
  saveData(data)
}

export const addTask = (task) => {
  const data = getData()
  data.tasks.push({
    ...task,
    id: Date.now().toString(),
    date: task.date || new Date().toISOString().split('T')[0],
    completed: false
  })
  saveData(data)
}

export const updateTask = (id, updates) => {
  const data = getData()
  const taskIndex = data.tasks.findIndex(t => t.id === id)
  if (taskIndex !== -1) {
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates }
    saveData(data)
  }
}

export const deleteTask = (id) => {
  const data = getData()
  data.tasks = data.tasks.filter(t => t.id !== id)
  saveData(data)
}

export const addExpense = (expense) => {
  const data = getData()
  data.expenses.push({
    ...expense,
    id: Date.now().toString(),
    date: expense.date || new Date().toISOString().split('T')[0]
  })
  saveData(data)
}

export const deleteExpense = (id) => {
  const data = getData()
  data.expenses = data.expenses.filter(e => e.id !== id)
  saveData(data)
}

export const addIncome = (income) => {
  const data = getData()
  if (!data.income) data.income = []
  data.income.push({
    ...income,
    id: Date.now().toString(),
    date: income.date || new Date().toISOString().split('T')[0]
  })
  saveData(data)
}

export const deleteIncome = (id) => {
  const data = getData()
  if (!data.income) data.income = []
  data.income = data.income.filter(i => i.id !== id)
  saveData(data)
}

export const addFitnessLog = (log) => {
  const data = getData()
  data.fitnessLogs.push({
    ...log,
    id: Date.now().toString(),
    date: log.date || new Date().toISOString().split('T')[0]
  })
  saveData(data)
}

export const deleteFitnessLog = (id) => {
  const data = getData()
  data.fitnessLogs = data.fitnessLogs.filter(l => l.id !== id)
  saveData(data)
}

export const addLearningLog = (log) => {
  const data = getData()
  data.learningLogs.push({
    ...log,
    id: Date.now().toString(),
    date: log.date || new Date().toISOString().split('T')[0]
  })
  saveData(data)
}

export const deleteLearningLog = (id) => {
  const data = getData()
  data.learningLogs = data.learningLogs.filter(l => l.id !== id)
  saveData(data)
}

export const saveDailyPlan = (date, plan) => {
  const data = getData()
  if (!data.plans) data.plans = {}
  data.plans[date] = plan
  saveData(data)
}

export const getDailyPlan = (date) => {
  const data = getData()
  return data.plans?.[date] || null
}
