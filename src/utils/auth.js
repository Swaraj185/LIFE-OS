// Authentication utilities

const USERS_KEY = 'lifeos_users'
const CURRENT_USER_KEY = 'lifeos_current_user'

export const signUp = (email, password, name) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' }
    }
    
    // Create new user (in a real app, password would be hashed)
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this!
      name,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
    
    // Initialize user data
    initializeUserData(newUser.id)
    
    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const login = (email, password) => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return { success: true, user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const isAuthenticated = () => {
  return getCurrentUser() !== null
}

const initializeUserData = (userId) => {
  // Initialize separate data storage for this user
  const userDataKey = `lifeos_data_${userId}`
  if (!localStorage.getItem(userDataKey)) {
    const initialData = {
      timeEntries: [],
      tasks: [],
      expenses: [],
      income: [],
      fitnessLogs: [],
      learningLogs: [],
      plans: {}
    }
    localStorage.setItem(userDataKey, JSON.stringify(initialData))
  }
}

export const getUserDataKey = () => {
  const user = getCurrentUser()
  if (!user) return 'lifeos_data'
  return `lifeos_data_${user.id}`
}

