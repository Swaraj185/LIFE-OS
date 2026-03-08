# Life OS - Personal Life Tracking Web App

A full-stack web application that helps students and professionals track time, tasks, money, fitness, learning, sleep, and attendance in one place. Focused on daily reality and awareness rather than complex planning.

## Features

### 📊 Dashboard
- Personalized greeting with your name
- Productivity score (0-100) with color indicators
- Score comparison with previous day
- Basic insights and suggestions
- Overview of today's activities across all categories
- Quick access to all tracking modules
- Real-time statistics

### ⏱️ Activity Tracker
- Log time spent on different activities
- Categories: Study, Work, Exercise, Social, Entertainment, Other
- Daily summaries with time breakdown by category
- Delete individual activity entries

### ✓ Task Manager
- Add and manage daily tasks
- Mark tasks as completed
- Filter by active/completed status
- Track task completion rate
- Delete individual tasks with confirmation

### 💰 Money Tracker
- Log daily expenses and income
- Multiple spending categories (Food, Transport, Shopping, etc.)
- Multiple income categories (Salary, Freelance, Investment, Gift, Other)
- Daily spending and income summaries
- Category-wise breakdown for both expenses and income
- Track balance (Income - Expenses)
- **NEW:** Lending summary integrated in money tracker
- Delete individual expense and income entries

### 💸 Money Lending Tracker (NEW!)
- Track money given (lent to others)
- Track money taken (borrowed from others)
- Mark entries as returned
- View outstanding loans
- Calculate net lending (given - taken)
- Delete lending entries

### 💪 Fitness Tracker
- Log workouts and physical activities
- Quick log buttons for common activities
- Track workout duration and frequency
- Consistency tracking
- Delete individual fitness logs

### 📚 Learning Tracker
- Log study and learning sessions
- Track learning topics and subjects
- Monitor learning time and consistency
- Quick log for common learning activities
- Delete individual learning sessions

### 📝 Attendance Tracker
- Track class attendance by subject
- Mark attendance status (Present, Absent, Late)
- Support for multiple time slots per day
- Track extra classes
- View attendance statistics and consistency
- Delete attendance records

### 😴 Sleep Tracker
- Log sleep start time and wake-up time
- Automatic calculation of total sleep hours
- Sleep quality rating (1-5 or Poor/Average/Good)
- Optional nap duration tracking
- Sleep status indicator (Good/Low/Poor)
- Edit or delete sleep logs

### 👤 Profile
- User profile with name and email
- Optional avatar image
- Daily preferences:
  - Ideal sleep hours
  - Daily focus time goal (in minutes)
  - Preferred wake-up time
  - Light/Dark mode toggle
- Productivity score tracking

### 📊 Productivity Score
- Daily score calculated from multiple factors:
  - Tasks completed (25%)
  - Focused time vs goal (25%)
  - Learning activity (15%)
  - Sleep hours and quality (15%)
  - Fitness (10%)
  - Attendance (10%)
- Color-coded indicators (green/yellow/red)
- Comparison with previous day showing percentage change
- Basic insights and suggestions based on your data

### 📈 Weekly Report
- Comprehensive weekly analysis
- Time tracking analysis
- Spending patterns and category breakdowns
- Consistency scores for fitness and learning
- Daily breakdown visualization

### 🔒 Authentication
- User sign-up and login system
- Secure password hashing (bcrypt)
- JWT token-based authentication
- User-specific data storage
- Logout functionality

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool
- **date-fns** - Date manipulation
- **CSS3** - Styling with modern design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **date-fns** - Date manipulation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free) OR local MongoDB
- npm or yarn

### Quick Start

**Step 1: Get MongoDB Connection String**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
2. Create a cluster (FREE tier)
3. Click "Connect" → "Connect your application"
4. Copy connection string and replace `<password>` with your password
5. Add database name: `...mongodb.net/lifeos?retryWrites=true&w=majority`
6. Add your IP to Network Access (allow from anywhere for development)

**Step 2: Setup Backend**
```bash
cd backend
npm install
```

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_secret_key_here
NODE_ENV=development
```

**Step 3: Start Backend** (Terminal 1)
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Step 4: Setup Frontend**
```bash
npm install
```

Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

**Step 5: Start Frontend** (Terminal 2 - new terminal)
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

**Step 6: Open Browser**
Go to: `http://localhost:5173` and sign up!

### Build for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

## Usage

1. **Authentication**: The app will first present a login/sign-up page. Create an account or log in.
2. **Profile Setup**: Go to Profile to set your preferences like ideal sleep hours, focus time goals, and preferred wake-up time.
3. **Daily Tracking**: Navigate to each module (Activities, Tasks, Money, Lending, Fitness, Learning, Attendance, Sleep) to log your daily activities.
4. **Sleep Tracking**: Log your sleep times each day. The app calculates total hours automatically and shows your sleep status.
5. **Productivity Score**: Check the Dashboard to see your daily productivity score and how it compares to yesterday.
6. **Money Lending**: Use the Lending tracker to record money you give or take from others.
7. **Quick Logging**: Use quick log buttons for common activities to save time.
8. **Delete Entries**: Click the delete button next to any entry to remove it (with a confirmation prompt).
9. **Weekly Review**: Visit the Report page at the end of each week to see your patterns and insights.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Time Tracking
- `GET /api/time` - Get all time entries
- `POST /api/time` - Create time entry
- `DELETE /api/time/:id` - Delete time entry

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Money
- `GET /api/money/expenses` - Get expenses
- `POST /api/money/expenses` - Create expense
- `DELETE /api/money/expenses/:id` - Delete expense
- `GET /api/money/income` - Get income
- `POST /api/money/income` - Create income
- `DELETE /api/money/income/:id` - Delete income

### Lending (NEW!)
- `GET /api/lending` - Get all lending entries
- `POST /api/lending` - Create lending entry
- `PUT /api/lending/:id` - Update lending entry (mark as returned)
- `DELETE /api/lending/:id` - Delete lending entry

### Fitness
- `GET /api/fitness` - Get fitness logs
- `POST /api/fitness` - Create fitness log
- `DELETE /api/fitness/:id` - Delete fitness log

### Learning
- `GET /api/learning` - Get learning logs
- `POST /api/learning` - Create learning log
- `DELETE /api/learning/:id` - Delete learning log

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/stats` - Get attendance statistics
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `DELETE /api/attendance/:id` - Delete attendance record

### Sleep
- `GET /api/sleep` - Get all sleep logs
- `GET /api/sleep/date/:date` - Get sleep log for specific date
- `POST /api/sleep` - Create sleep log
- `PUT /api/sleep/:id` - Update sleep log
- `DELETE /api/sleep/:id` - Delete sleep log

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Productivity
- `GET /api/productivity/score/:date` - Get productivity score for date
- `GET /api/productivity/insights/:date` - Get insights for date

## Data Storage

All data is stored in MongoDB cloud database. Your data is secure, backed up, and accessible from any device once you log in.

## Design Philosophy

- **Minimal Input**: Quick logging with minimal fields required
- **Reality Focus**: Track what actually happened, not just plans
- **Awareness**: Visual reports help you see patterns and time waste
- **Discipline**: Consistency tracking encourages better habits
- **Weekly Improvement**: Weekly reports show progress and areas for improvement
- **Productivity Insights**: Score system helps identify what affects your daily productivity

## License

MIT License - feel free to use and modify as needed.
