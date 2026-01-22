# Life OS Backend API

Backend server for Life OS application built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

3. Get MongoDB connection string:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
   - Create a cluster
   - Get connection string
   - Replace `<password>` with your database password

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Time Tracking
- GET `/api/time` - Get all time entries
- POST `/api/time` - Create time entry
- DELETE `/api/time/:id` - Delete time entry

### Tasks
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

### Money
- GET `/api/money/expenses` - Get expenses
- POST `/api/money/expenses` - Create expense
- DELETE `/api/money/expenses/:id` - Delete expense
- GET `/api/money/income` - Get income
- POST `/api/money/income` - Create income
- DELETE `/api/money/income/:id` - Delete income

### Lending
- GET `/api/lending` - Get all lending entries
- POST `/api/lending` - Create lending entry
- PUT `/api/lending/:id` - Update lending entry (mark as returned)
- DELETE `/api/lending/:id` - Delete lending entry

### Fitness
- GET `/api/fitness` - Get fitness logs
- POST `/api/fitness` - Create fitness log
- DELETE `/api/fitness/:id` - Delete fitness log

### Learning
- GET `/api/learning` - Get learning logs
- POST `/api/learning` - Create learning log
- DELETE `/api/learning/:id` - Delete learning log

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are valid for 30 days.

