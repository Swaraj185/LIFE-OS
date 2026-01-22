// Internationalization support

const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      time: 'Activities',
      tasks: 'Tasks',
      money: 'Money',
      fitness: 'Fitness',
      learning: 'Learning',
      report: 'Report'
    },
    // Auth
    auth: {
      signUp: 'Sign Up',
      login: 'Login',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      confirmPassword: 'Confirm Password',
      alreadyHaveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      signUpHere: 'Sign up here',
      loginHere: 'Login here'
    },
    // Dashboard
    dashboard: {
      title: "Today's Overview",
      timeTracked: 'Time Tracked',
      tasks: 'Tasks',
      expenses: 'Expenses',
      fitness: 'Fitness',
      learning: 'Learning',
      today: 'today',
      completed: 'completed',
      logged: 'Logged',
      notLogged: 'Not logged',
      viewReport: 'View Weekly Report',
      seeReport: 'See your planned vs actual performance, time waste, and patterns'
    },
    // Time Tracker
    time: {
      title: 'Activity Tracker',
      subtitle: 'Track how you spend your time',
      logTime: 'Log Activity',
      activity: 'Activity',
      category: 'Category',
      duration: 'Duration (minutes)',
      addEntry: 'Add Entry',
      todaySummary: "Today's Summary",
      totalTracked: 'Total Tracked',
      byCategory: 'By Category',
      todayEntries: "Today's Entries",
      noEntries: 'No activities logged today. Start tracking your time!',
      categories: {
        study: '📚 Study',
        work: '💼 Work',
        exercise: '🏃 Exercise',
        social: '👥 Social',
        entertainment: '🎮 Entertainment',
        other: '⚪ Other'
      }
    },
    // Tasks
    tasks: {
      title: 'Tasks',
      addTask: 'Add Task',
      todayTasks: "Today's Tasks",
      completed: 'completed',
      all: 'All',
      active: 'Active',
      done: 'Completed',
      noTasks: 'No tasks for today. Add one to get started!',
      noActive: 'No active tasks. Great job!',
      noCompleted: 'No completed tasks yet.',
      placeholder: 'What needs to be done?'
    },
    // Money
    money: {
      title: 'Money Tracker',
      addExpense: 'Add Expense',
      addIncome: 'Add Income',
      todaySummary: "Today's Summary",
      totalSpent: 'Total Spent Today',
      totalIncome: 'Total Income Today',
      balance: 'Balance Today',
      byCategory: 'By Category',
      todayExpenses: "Today's Expenses",
      todayIncome: "Today's Income",
      noExpenses: 'No expenses logged today. Track your spending!',
      noIncome: 'No income logged today.',
      description: 'Description',
      amount: 'Amount ($)',
      category: 'Category',
      type: 'Type',
      expense: 'Expense',
      income: 'Income',
      categories: {
        food: '🍔 Food',
        transport: '🚗 Transport',
        shopping: '🛒 Shopping',
        entertainment: '🎮 Entertainment',
        bills: '💳 Bills',
        education: '📚 Education',
        health: '🏥 Health',
        salary: '💼 Salary',
        freelance: '💻 Freelance',
        investment: '📈 Investment',
        gift: '🎁 Gift',
        other: '⚪ Other'
      }
    },
    // Fitness
    fitness: {
      title: 'Fitness Tracker',
      logWorkout: 'Log Workout',
      quickLog: 'Quick Log',
      todaySummary: "Today's Summary",
      totalActivity: 'Total Activity Time',
      workouts: 'Workouts',
      todayLogs: "Today's Logs",
      noLogs: 'No workouts logged today. Get moving! 💪',
      activity: 'Activity',
      duration: 'Duration (minutes)',
      type: 'Type'
    },
    // Learning
    learning: {
      title: 'Learning Tracker',
      logLearning: 'Log Learning',
      todaySummary: "Today's Summary",
      totalLearning: 'Total Learning Time',
      sessions: 'Sessions',
      todaySessions: "Today's Sessions",
      noSessions: 'No learning sessions logged today. Keep learning! 📚',
      topic: 'Topic/Subject',
      duration: 'Duration (minutes)',
      type: 'Type'
    },
    // Report
    report: {
      title: 'Weekly Life Report',
      timeTracked: 'Total Time Tracked',
      avgDaily: 'Avg',
      tasksCompleted: 'Tasks Completed',
      completionRate: 'completion rate',
      totalSpent: 'Total Spent',
      avgDailySpending: 'Avg',
      fitnessDays: 'Fitness Days',
      consistency: 'consistency',
      learningDays: 'Learning Days',
      timeWaste: 'Time Waste Alert',
      timeWasteDesc: 'You spent',
      timeWasteSuggestion: 'Consider reducing this time for better productivity.',
      dailyBreakdown: 'Daily Breakdown',
      timeByCategory: 'Time by Category',
      spendingByCategory: 'Spending by Category',
      consistencyScores: 'Consistency Scores',
      taskCompletion: 'Task Completion',
      previous: 'Previous',
      next: 'Next'
    }
  },
  es: {
    nav: {
      dashboard: 'Panel',
      time: 'Actividades',
      tasks: 'Tareas',
      money: 'Dinero',
      fitness: 'Fitness',
      learning: 'Aprendizaje',
      report: 'Informe'
    },
    auth: {
      signUp: 'Registrarse',
      login: 'Iniciar Sesión',
      logout: 'Cerrar Sesión',
      email: 'Correo',
      password: 'Contraseña',
      name: 'Nombre',
      confirmPassword: 'Confirmar Contraseña',
      alreadyHaveAccount: '¿Ya tienes cuenta?',
      noAccount: '¿No tienes cuenta?',
      signUpHere: 'Regístrate aquí',
      loginHere: 'Inicia sesión aquí'
    },
    dashboard: {
      title: 'Resumen de Hoy',
      timeTracked: 'Tiempo Registrado',
      tasks: 'Tareas',
      expenses: 'Gastos',
      fitness: 'Fitness',
      learning: 'Aprendizaje',
      today: 'hoy',
      completed: 'completadas',
      logged: 'Registrado',
      notLogged: 'No registrado',
      viewReport: 'Ver Informe Semanal',
      seeReport: 'Ve tu rendimiento planificado vs real, desperdicio de tiempo y patrones'
    },
    time: {
      title: 'Registro de Actividades',
      subtitle: 'Rastrea cómo pasas tu tiempo',
      logTime: 'Registrar Actividad',
      activity: 'Actividad',
      category: 'Categoría',
      duration: 'Duración (minutos)',
      addEntry: 'Agregar',
      todaySummary: 'Resumen de Hoy',
      totalTracked: 'Total Registrado',
      byCategory: 'Por Categoría',
      todayEntries: 'Actividades de Hoy',
      noEntries: 'No hay actividades registradas hoy. ¡Comienza a rastrear tu tiempo!',
      categories: {
        study: '📚 Estudio',
        work: '💼 Trabajo',
        exercise: '🏃 Ejercicio',
        social: '👥 Social',
        entertainment: '🎮 Entretenimiento',
        other: '⚪ Otro'
      }
    },
    tasks: {
      title: 'Tareas',
      addTask: 'Agregar Tarea',
      todayTasks: 'Tareas de Hoy',
      completed: 'completadas',
      all: 'Todas',
      active: 'Activas',
      done: 'Completadas',
      noTasks: 'No hay tareas para hoy. ¡Agrega una para comenzar!',
      noActive: 'No hay tareas activas. ¡Buen trabajo!',
      noCompleted: 'Aún no hay tareas completadas.',
      placeholder: '¿Qué necesita hacerse?'
    },
    money: {
      title: 'Registro de Dinero',
      addExpense: 'Agregar Gasto',
      addIncome: 'Agregar Ingreso',
      todaySummary: 'Resumen de Hoy',
      totalSpent: 'Total Gastado Hoy',
      totalIncome: 'Total Ingresado Hoy',
      balance: 'Balance Hoy',
      byCategory: 'Por Categoría',
      todayExpenses: 'Gastos de Hoy',
      todayIncome: 'Ingresos de Hoy',
      noExpenses: 'No hay gastos registrados hoy. ¡Rastrea tus gastos!',
      noIncome: 'No hay ingresos registrados hoy.',
      description: 'Descripción',
      amount: 'Cantidad ($)',
      category: 'Categoría',
      type: 'Tipo',
      expense: 'Gasto',
      income: 'Ingreso',
      categories: {
        food: '🍔 Comida',
        transport: '🚗 Transporte',
        shopping: '🛒 Compras',
        entertainment: '🎮 Entretenimiento',
        bills: '💳 Facturas',
        education: '📚 Educación',
        health: '🏥 Salud',
        salary: '💼 Salario',
        freelance: '💻 Freelance',
        investment: '📈 Inversión',
        gift: '🎁 Regalo',
        other: '⚪ Otro'
      }
    },
    fitness: {
      title: 'Registro de Fitness',
      logWorkout: 'Registrar Entrenamiento',
      quickLog: 'Registro Rápido',
      todaySummary: 'Resumen de Hoy',
      totalActivity: 'Tiempo Total de Actividad',
      workouts: 'Entrenamientos',
      todayLogs: 'Registros de Hoy',
      noLogs: 'No hay entrenamientos registrados hoy. ¡Muévete! 💪',
      activity: 'Actividad',
      duration: 'Duración (minutos)',
      type: 'Tipo'
    },
    learning: {
      title: 'Registro de Aprendizaje',
      logLearning: 'Registrar Aprendizaje',
      todaySummary: 'Resumen de Hoy',
      totalLearning: 'Tiempo Total de Aprendizaje',
      sessions: 'Sesiones',
      todaySessions: 'Sesiones de Hoy',
      noSessions: 'No hay sesiones de aprendizaje registradas hoy. ¡Sigue aprendiendo! 📚',
      topic: 'Tema/Materia',
      duration: 'Duración (minutos)',
      type: 'Tipo'
    },
    report: {
      title: 'Informe Semanal de Vida',
      timeTracked: 'Tiempo Total Registrado',
      avgDaily: 'Prom',
      tasksCompleted: 'Tareas Completadas',
      completionRate: 'tasa de finalización',
      totalSpent: 'Total Gastado',
      avgDailySpending: 'Prom',
      fitnessDays: 'Días de Fitness',
      consistency: 'consistencia',
      learningDays: 'Días de Aprendizaje',
      timeWaste: 'Alerta de Desperdicio de Tiempo',
      timeWasteDesc: 'Pasaste',
      timeWasteSuggestion: 'Considera reducir este tiempo para una mejor productividad.',
      dailyBreakdown: 'Desglose Diario',
      timeByCategory: 'Tiempo por Categoría',
      spendingByCategory: 'Gastos por Categoría',
      consistencyScores: 'Puntuaciones de Consistencia',
      taskCompletion: 'Finalización de Tareas',
      previous: 'Anterior',
      next: 'Siguiente'
    }
  },
  ja: {
    nav: {
      dashboard: 'ダッシュボード',
      time: '活動',
      tasks: 'タスク',
      money: 'お金',
      fitness: 'フィットネス',
      learning: '学習',
      report: 'レポート'
    },
    auth: {
      signUp: '登録',
      login: 'ログイン',
      logout: 'ログアウト',
      email: 'メール',
      password: 'パスワード',
      name: '名前',
      confirmPassword: 'パスワード確認',
      alreadyHaveAccount: 'アカウントをお持ちですか？',
      noAccount: 'アカウントをお持ちでないですか？',
      signUpHere: 'こちらで登録',
      loginHere: 'こちらでログイン'
    },
    dashboard: {
      title: '今日の概要',
      timeTracked: '記録時間',
      tasks: 'タスク',
      expenses: '支出',
      fitness: 'フィットネス',
      learning: '学習',
      today: '今日',
      completed: '完了',
      logged: '記録済み',
      notLogged: '未記録',
      viewReport: '週間レポートを見る',
      seeReport: '計画vs実績、時間の無駄、パターンを見る'
    },
    time: {
      title: '活動トラッカー',
      subtitle: '時間の使い方を記録',
      logTime: '活動を記録',
      activity: '活動',
      category: 'カテゴリ',
      duration: '時間（分）',
      addEntry: '追加',
      todaySummary: '今日の概要',
      totalTracked: '合計記録',
      byCategory: 'カテゴリ別',
      todayEntries: '今日の活動',
      noEntries: '今日の活動は記録されていません。時間を記録し始めましょう！',
      categories: {
        study: '📚 勉強',
        work: '💼 仕事',
        exercise: '🏃 運動',
        social: '👥 社交',
        entertainment: '🎮 娯楽',
        other: '⚪ その他'
      }
    },
    tasks: {
      title: 'タスク',
      addTask: 'タスクを追加',
      todayTasks: '今日のタスク',
      completed: '完了',
      all: 'すべて',
      active: 'アクティブ',
      done: '完了済み',
      noTasks: '今日のタスクはありません。追加して始めましょう！',
      noActive: 'アクティブなタスクはありません。素晴らしい！',
      noCompleted: '完了したタスクはまだありません。',
      placeholder: '何をする必要がありますか？'
    },
    money: {
      title: 'お金トラッカー',
      addExpense: '支出を追加',
      addIncome: '収入を追加',
      todaySummary: '今日の概要',
      totalSpent: '今日の総支出',
      totalIncome: '今日の総収入',
      balance: '今日の残高',
      byCategory: 'カテゴリ別',
      todayExpenses: '今日の支出',
      todayIncome: '今日の収入',
      noExpenses: '今日の支出は記録されていません。支出を記録しましょう！',
      noIncome: '今日の収入は記録されていません。',
      description: '説明',
      amount: '金額（$）',
      category: 'カテゴリ',
      type: 'タイプ',
      expense: '支出',
      income: '収入',
      categories: {
        food: '🍔 食事',
        transport: '🚗 交通',
        shopping: '🛒 ショッピング',
        entertainment: '🎮 娯楽',
        bills: '💳 請求書',
        education: '📚 教育',
        health: '🏥 健康',
        salary: '💼 給料',
        freelance: '💻 フリーランス',
        investment: '📈 投資',
        gift: '🎁 贈り物',
        other: '⚪ その他'
      }
    },
    fitness: {
      title: 'フィットネストラッカー',
      logWorkout: 'ワークアウトを記録',
      quickLog: 'クイック記録',
      todaySummary: '今日の概要',
      totalActivity: '総活動時間',
      workouts: 'ワークアウト',
      todayLogs: '今日の記録',
      noLogs: '今日のワークアウトは記録されていません。動きましょう！💪',
      activity: '活動',
      duration: '時間（分）',
      type: 'タイプ'
    },
    learning: {
      title: '学習トラッカー',
      logLearning: '学習を記録',
      todaySummary: '今日の概要',
      totalLearning: '総学習時間',
      sessions: 'セッション',
      todaySessions: '今日のセッション',
      noSessions: '今日の学習セッションは記録されていません。学習を続けましょう！📚',
      topic: 'トピック/科目',
      duration: '時間（分）',
      type: 'タイプ'
    },
    report: {
      title: '週間ライフレポート',
      timeTracked: '総記録時間',
      avgDaily: '平均',
      tasksCompleted: '完了タスク',
      completionRate: '完了率',
      totalSpent: '総支出',
      avgDailySpending: '平均',
      fitnessDays: 'フィットネス日数',
      consistency: '一貫性',
      learningDays: '学習日数',
      timeWaste: '時間の無駄アラート',
      timeWasteDesc: 'あなたは',
      timeWasteSuggestion: 'より良い生産性のためにこの時間を減らすことを検討してください。',
      dailyBreakdown: '日別内訳',
      timeByCategory: 'カテゴリ別時間',
      spendingByCategory: 'カテゴリ別支出',
      consistencyScores: '一貫性スコア',
      taskCompletion: 'タスク完了',
      previous: '前',
      next: '次'
    }
  }
}

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
]

export const getLanguage = () => {
  return localStorage.getItem('lifeos_language') || 'en'
}

export const setLanguage = (lang) => {
  localStorage.setItem('lifeos_language', lang)
}

export const t = (key, lang = null) => {
  const currentLang = lang || getLanguage()
  const keys = key.split('.')
  let value = translations[currentLang]
  
  for (const k of keys) {
    value = value?.[k]
    if (!value) break
  }
  
  return value || key
}

export default translations

