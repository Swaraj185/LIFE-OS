import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import api from '../utils/api'
import './MoneyTracker.css'

export default function MoneyTracker() {
  const [todayExpenses, setTodayExpenses] = useState([])
  const [todayIncome, setTodayIncome] = useState([])
  const [lendingGiven, setLendingGiven] = useState(0)
  const [lendingTaken, setLendingTaken] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('expense') // 'expense' or 'income'
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food'
  })

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadTodayData()
  }, [])

  const loadTodayData = async () => {
    try {
      const [expenses, income, lending] = await Promise.all([
        api.getExpenses(),
        api.getIncome(),
        api.getLending()
      ])
      const todayExp = expenses.filter(e => e.date === today)
      const todayInc = income.filter(i => i.date === today)
      setTodayExpenses(todayExp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      setTodayIncome(todayInc.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      
      // Calculate lending totals
      const todayLendingEntries = lending.filter(l => l.date === today)
      const totalGiven = todayLendingEntries
        .filter(l => l.type === 'given' && !l.returned)
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)
      const totalTaken = todayLendingEntries
        .filter(l => l.type === 'taken' && !l.returned)
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0)
      setLendingGiven(totalGiven)
      setLendingTaken(totalTaken)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) return

    try {
      if (formType === 'expense') {
        await api.createExpense({
          ...formData,
          amount: parseFloat(formData.amount),
          date: today
        })
      } else {
        await api.createIncome({
          ...formData,
          amount: parseFloat(formData.amount),
          date: today
        })
      }
      setFormData({ description: '', amount: '', category: formType === 'expense' ? 'food' : 'salary' })
      setShowForm(false)
      loadTodayData()
    } catch (error) {
      alert('Failed to save: ' + error.message)
    }
  }

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await api.deleteExpense(id)
        loadTodayData()
      } catch (error) {
        alert('Failed to delete: ' + error.message)
      }
    }
  }

  const handleDeleteIncome = async (id) => {
    if (window.confirm('Delete this income entry?')) {
      try {
        await api.deleteIncome(id)
        loadTodayData()
      } catch (error) {
        alert('Failed to delete: ' + error.message)
      }
    }
  }

  const expenseCategories = [
    { value: 'food', label: '🍔 Food', color: '#ed8936' },
    { value: 'transport', label: '🚗 Transport', color: '#4299e1' },
    { value: 'shopping', label: '🛒 Shopping', color: '#9f7aea' },
    { value: 'entertainment', label: '🎮 Entertainment', color: '#f56565' },
    { value: 'bills', label: '💳 Bills', color: '#48bb78' },
    { value: 'education', label: '📚 Education', color: '#667eea' },
    { value: 'health', label: '🏥 Health', color: '#38b2ac' },
    { value: 'other', label: '⚪ Other', color: '#a0aec0' }
  ]

  const incomeCategories = [
    { value: 'salary', label: '💼 Salary', color: '#48bb78' },
    { value: 'freelance', label: '💻 Freelance', color: '#667eea' },
    { value: 'investment', label: '📈 Investment', color: '#9f7aea' },
    { value: 'gift', label: '🎁 Gift', color: '#ed8936' },
    { value: 'other', label: '⚪ Other', color: '#a0aec0' }
  ]

  const categories = formType === 'expense' ? expenseCategories : incomeCategories
  const totalExpenses = todayExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  const totalIncome = todayIncome.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0)
  const balance = totalIncome - totalExpenses
  const netLending = lendingGiven - lendingTaken // Money given - money taken

  const expenseCategoryStats = expenseCategories.map(cat => {
    const expenses = todayExpenses.filter(e => e.category === cat.value)
    const total = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    return { ...cat, total, count: expenses.length }
  }).filter(stat => stat.total > 0)

  const incomeCategoryStats = incomeCategories.map(cat => {
    const income = todayIncome.filter(i => i.category === cat.value)
    const total = income.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0)
    return { ...cat, total, count: income.length }
  }).filter(stat => stat.total > 0)

  return (
    <div className="money-tracker">
      <div className="page-header">
        <h1>Money Tracker</h1>
        <div className="money-actions">
          <button 
            className={`btn ${formType === 'expense' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => {
              setFormType('expense')
              setShowForm(!showForm)
              setFormData({ ...formData, category: 'food' })
            }}
          >
            {showForm && formType === 'expense' ? 'Cancel' : '+ Add Expense'}
          </button>
          <button 
            className={`btn ${formType === 'income' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => {
              setFormType('income')
              setShowForm(!showForm)
              setFormData({ ...formData, category: 'salary' })
            }}
          >
            {showForm && formType === 'income' ? 'Cancel' : '+ Add Income'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="card-title">{formType === 'expense' ? 'Add Expense' : 'Add Income'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Description</label>
              <input
                type="text"
                className="input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={formType === 'expense' ? "e.g., Lunch, Coffee, Bus fare" : "e.g., Salary, Payment, Gift"}
              />
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

            <button type="submit" className="btn btn-primary">
              {formType === 'expense' ? 'Add Expense' : 'Add Income'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Today's Summary</h2>
        <div className="money-summary-grid">
          <div className="money-summary-item">
            <span className="money-value expense">${totalExpenses.toFixed(2)}</span>
            <span className="money-label">Total Spent Today</span>
          </div>
          <div className="money-summary-item">
            <span className="money-value income">${totalIncome.toFixed(2)}</span>
            <span className="money-label">Total Income Today</span>
          </div>
          <div className="money-summary-item">
            <span className={`money-value ${balance >= 0 ? 'positive' : 'negative'}`}>
              ${balance.toFixed(2)}
            </span>
            <span className="money-label">Balance Today</span>
          </div>
          <div className="money-summary-item">
            <span className="money-value given">${lendingGiven.toFixed(2)}</span>
            <span className="money-label">Money Given (Lent)</span>
          </div>
          <div className="money-summary-item">
            <span className="money-value taken">${lendingTaken.toFixed(2)}</span>
            <span className="money-label">Money Taken (Borrowed)</span>
          </div>
          <div className="money-summary-item">
            <span className={`money-value ${netLending >= 0 ? 'positive' : 'negative'}`}>
              ${Math.abs(netLending).toFixed(2)}
            </span>
            <span className="money-label">
              {netLending >= 0 ? 'Net Lent' : 'Net Borrowed'}
            </span>
          </div>
        </div>

        {expenseCategoryStats.length > 0 && (
          <div className="category-breakdown">
            <h3>By Category - Expenses</h3>
            <div className="category-list">
              {expenseCategoryStats.map(stat => (
                <div key={stat.value} className="category-item">
                  <span className="category-name">{stat.label}</span>
                  <span className="category-amount">${stat.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {incomeCategoryStats.length > 0 && (
          <div className="category-breakdown">
            <h3>By Category - Income</h3>
            <div className="category-list">
              {incomeCategoryStats.map(stat => (
                <div key={stat.value} className="category-item">
                  <span className="category-name">{stat.label}</span>
                  <span className="category-amount income">${stat.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Today's Expenses</h2>
        {todayExpenses.length === 0 ? (
          <p className="empty-state">No expenses logged today. Track your spending!</p>
        ) : (
          <div className="expenses-list">
            {todayExpenses.map(expense => {
              const category = expenseCategories.find(c => c.value === expense.category)
              return (
                <div key={expense._id || expense.id} className="expense-item">
                  <div className="expense-category" style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>
                    {category?.label}
                  </div>
                  <div className="expense-details">
                    <div className="expense-description">{expense.description}</div>
                    <div className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</div>
                  </div>
                  <button
                    className="expense-delete"
                    onClick={() => handleDeleteExpense(expense._id || expense.id)}
                    title="Delete expense"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Today's Income</h2>
        {todayIncome.length === 0 ? (
          <p className="empty-state">No income logged today.</p>
        ) : (
          <div className="expenses-list">
            {todayIncome.map(income => {
              const category = incomeCategories.find(c => c.value === income.category)
              return (
                <div key={income._id || income.id} className="expense-item income-item">
                  <div className="expense-category" style={{ backgroundColor: `${category?.color}20`, color: category?.color }}>
                    {category?.label}
                  </div>
                  <div className="expense-details">
                    <div className="expense-description">{income.description}</div>
                    <div className="expense-amount income">${parseFloat(income.amount).toFixed(2)}</div>
                  </div>
                  <button
                    className="expense-delete"
                    onClick={() => handleDeleteIncome(income._id || income.id)}
                    title="Delete income"
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
