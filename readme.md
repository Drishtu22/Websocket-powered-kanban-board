🎯 WebSocket-Powered Kanban Board

✨ Features
->Real-time Updates: Instant task synchronization using WebSocket
->Drag & Drop: Intuitive drag-and-drop task management between columns
->Analytics Dashboard: Visual progress tracking with interactive charts
->Smart Filtering: Filter tasks by priority, category, and search terms
->Responsive Design: Works seamlessly on desktop and mobile
->Comprehensive Testing: Full E2E test coverage with Playwright
->Live Sync Indicator: Real-time connection status display

🏗️ Architecture
websocket-kanban-board/
├── backend/                    # Node.js WebSocket Server
│   ├── server.js              # Express + Socket.io server
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment variables template
├── frontend/                  # React Frontend Application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── Column.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   └── BoardStats.jsx
│   │   ├── tests/e2e/         # Playwright E2E tests
│   │   ├── socket.js          # WebSocket client
│   │   └── App.jsx            # Main App component
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Build configuration
│   └── .env.example           # Frontend environment variables
├── render.yaml                # Render.com deployment config
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
└── package.json               # Root package.json (optional)



📦 Installation
Prerequisites
Node.js 16+
npm 8+ or yarn
Git

Local Development Setup
1)Clone the repository
2)Install dependencies
# Install all dependencies at once
npm run install:all

# Or install separately:
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

3)Set up environment variables
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env

4)Start development servers
# Start both backend and frontend simultaneously
npm run dev

# Or start separately:
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

🧪 Testing
->Run E2E Tests with Playwright
cd frontend

# Install Playwright browsers (first time only)
npx playwright install

# Run all tests
npx playwright test

# Run tests with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test src/tests/e2e/kanban.spec.js --headed

est Coverage
✅ App loading and navigation

✅ Task creation and deletion

✅ Drag-and-drop functionality

✅ Filter and search operations

✅ View switching (Board ↔ Analytics)

✅ WebSocket connectivity


