// API utility for making backend requests

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('lifeos_token');
};

// Get auth headers
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API client
const api = {
  // Auth
  register: async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Registration failed');
      }
      
      const data = await response.json();
      if (data.token) localStorage.setItem('lifeos_token', data.token);
      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      }
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Login failed');
      }
      
      const data = await response.json();
      if (data.token) localStorage.setItem('lifeos_token', data.token);
      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      }
      throw error;
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    if (!response.ok) return null;
    return await response.json();
  },

  // Time entries
  getTimeEntries: async () => {
    const response = await fetch(`${API_URL}/time`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch time entries');
    return await response.json();
  },

  createTimeEntry: async (entry) => {
    const response = await fetch(`${API_URL}/time`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(entry),
    });
    if (!response.ok) throw new Error('Failed to create time entry');
    return await response.json();
  },

  deleteTimeEntry: async (id) => {
    const response = await fetch(`${API_URL}/time/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete time entry');
    return await response.json();
  },

  // Tasks
  getTasks: async () => {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  },

  createTask: async (task) => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return await response.json();
  },

  updateTask: async (id, updates) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return await response.json();
  },

  deleteTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return await response.json();
  },

  // Expenses
  getExpenses: async () => {
    const response = await fetch(`${API_URL}/money/expenses`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return await response.json();
  },

  createExpense: async (expense) => {
    const response = await fetch(`${API_URL}/money/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(expense),
    });
    if (!response.ok) throw new Error('Failed to create expense');
    return await response.json();
  },

  deleteExpense: async (id) => {
    const response = await fetch(`${API_URL}/money/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete expense');
    return await response.json();
  },

  // Income
  getIncome: async () => {
    const response = await fetch(`${API_URL}/money/income`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch income');
    return await response.json();
  },

  createIncome: async (income) => {
    const response = await fetch(`${API_URL}/money/income`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(income),
    });
    if (!response.ok) throw new Error('Failed to create income');
    return await response.json();
  },

  deleteIncome: async (id) => {
    const response = await fetch(`${API_URL}/money/income/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete income');
    return await response.json();
  },

  // Lending (NEW)
  getLending: async () => {
    const response = await fetch(`${API_URL}/lending`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch lending entries');
    return await response.json();
  },

  createLending: async (lending) => {
    const response = await fetch(`${API_URL}/lending`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(lending),
    });
    if (!response.ok) throw new Error('Failed to create lending entry');
    return await response.json();
  },

  updateLending: async (id, updates) => {
    const response = await fetch(`${API_URL}/lending/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update lending entry');
    return await response.json();
  },

  deleteLending: async (id) => {
    const response = await fetch(`${API_URL}/lending/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete lending entry');
    return await response.json();
  },

  // Fitness
  getFitnessLogs: async () => {
    const response = await fetch(`${API_URL}/fitness`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch fitness logs');
    return await response.json();
  },

  createFitnessLog: async (log) => {
    const response = await fetch(`${API_URL}/fitness`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error('Failed to create fitness log');
    return await response.json();
  },

  deleteFitnessLog: async (id) => {
    const response = await fetch(`${API_URL}/fitness/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete fitness log');
    return await response.json();
  },

  // Learning
  getLearningLogs: async () => {
    const response = await fetch(`${API_URL}/learning`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch learning logs');
    return await response.json();
  },

  createLearningLog: async (log) => {
    const response = await fetch(`${API_URL}/learning`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(log),
    });
    if (!response.ok) throw new Error('Failed to create learning log');
    return await response.json();
  },

  deleteLearningLog: async (id) => {
    const response = await fetch(`${API_URL}/learning/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete learning log');
    return await response.json();
  },

  // Attendance
  getAttendance: async () => {
    const response = await fetch(`${API_URL}/attendance`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch attendance');
    return await response.json();
  },

  getAttendanceStats: async () => {
    const response = await fetch(`${API_URL}/attendance/stats`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch attendance stats');
    return await response.json();
  },

  createAttendance: async (attendance) => {
    const response = await fetch(`${API_URL}/attendance`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(attendance),
    });
    if (!response.ok) throw new Error('Failed to create attendance record');
    return await response.json();
  },

  updateAttendance: async (id, updates) => {
    const response = await fetch(`${API_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update attendance record');
    return await response.json();
  },

  deleteAttendance: async (id) => {
    const response = await fetch(`${API_URL}/attendance/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete attendance record');
    return await response.json();
  },
};

export default api;

