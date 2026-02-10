import { useEffect, useState } from "react";
import Column from "./Column";
import TaskForm from "./TaskForm";
import ProgressChart from "./ProgressChart";
import BoardStats from "./BoardStats";
import socket from "../socket";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./KanbanBoard.css";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "#FF6B6B", icon: "📝" },
  { id: "progress", title: "In Progress", color: "#4ECDC4", icon: "⚙️" },
  { id: "done", title: "Done", color: "#1DD1A1", icon: "✅" },
];

// Mock initial data for development
const MOCK_TASKS = [
  {
    id: "1",
    title: "Fix login bug",
    description: "Users can't login on mobile",
    status: "To Do",
    priority: "High",
    category: "Bug",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Add dark mode",
    description: "Implement dark theme toggle",
    status: "In Progress",
    priority: "Medium",
    category: "Feature",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Optimize images",
    description: "Compress images for faster loading",
    status: "Done",
    priority: "Low",
    category: "Enhancement",
    createdAt: new Date().toISOString(),
  },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ priority: "All", category: "All" });
  const [activeView, setActiveView] = useState("board");
  const [socketConnected, setSocketConnected] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
   
    if (socket.connected) {
      setSocketConnected(true);
    }

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("Socket disconnected");
    });

    socket.on("tasks:update", (data) => {
      console.log("Tasks updated:", data);
      setTasks(data);
      setLoading(false);
    });


    socket.emit("tasks:get");

    return () => {
      socket.off("tasks:update");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const addTask = (task) => {
    if (!task.title.trim()) return;
    
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    console.log("Adding task:", newTask);
   
    setTasks(prev => [...prev, newTask]);
  
    socket.emit("task:add", newTask);
    setShowTaskForm(false);
  };

  const moveTask = (taskId, newStatus) => {
    console.log("Moving task:", taskId, "to", newStatus);
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
   
    socket.emit("task:move", { id: taskId, status: newStatus });
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      console.log("Deleting task:", taskId);
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
    
      socket.emit("task:delete", taskId);
    }
  };

  const updateTask = (updatedTask) => {
    console.log("Updating task:", updatedTask);
    
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    
    socket.emit("task:update", updatedTask);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPriority = filter.priority === "All" || task.priority === filter.priority;
    const matchesCategory = filter.category === "All" || task.category === filter.category;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  // Get tasks for each column
  const getColumnTasks = (columnTitle) => {
    return filteredTasks.filter(task => task.status === columnTitle);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner-large"></div>
          <p className="loading-text">Loading your board...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-app">
        {/* Top Header with Controls */}
        <header className="top-header">
          <div className="header-left">
            <div className="app-title-section">
              <h1 className="app-title">
                <span className="app-icon">📋</span>
                Kanban Task Manager
              </h1>
              <div className="connection-status">
                <span className={`status-dot ${socketConnected ? 'connected' : 'disconnected'}`}></span>
                <span className="status-text">
                  {socketConnected ? 'Live Sync Active' : 'Offline Mode'}
                </span>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-value">{tasks.length}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{tasks.filter(t => t.status === 'Done').length}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{tasks.filter(t => t.priority === 'High').length}</span>
                <span className="stat-label">High Priority</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            {/* Task Form Button */}
            <div className="task-form-header">
              {!showTaskForm ? (
                <button 
                  className="add-task-header-btn"
                  onClick={() => setShowTaskForm(true)}
                >
                  <span className="btn-icon">+</span>
                  <span className="btn-text">Create New Task</span>
                </button>
              ) : (
                <div className="header-task-form">
                  <TaskForm onAdd={addTask} />
                  <button 
                    className="close-form-header-btn"
                    onClick={() => setShowTaskForm(false)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* View Toggle Buttons */}
            <div className="view-toggle">
              <button 
                className={`view-toggle-btn ${activeView === 'board' ? 'active' : ''}`}
                onClick={() => setActiveView('board')}
              >
                <span className="view-icon">📊</span>
                Board View
              </button>
              <button 
                className={`view-toggle-btn ${activeView === 'chart' ? 'active' : ''}`}
                onClick={() => setActiveView('chart')}
              >
                <span className="view-icon">📈</span>
                Analytics
              </button>
            </div>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <div className="controls-bar">
          <div className="search-section">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search tasks by title, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-group">
              <span className="filter-label">Priority:</span>
              <select 
                className="filter-dropdown"
                value={filter.priority}
                onChange={(e) => setFilter({...filter, priority: e.target.value})}
              >
                <option value="All">All Priorities</option>
                <option value="High">🔥 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">Category:</span>
              <select 
                className="filter-dropdown"
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
              >
                <option value="All">All Categories</option>
                <option value="Bug">🐛 Bug</option>
                <option value="Feature">✨ Feature</option>
                <option value="Enhancement">⚡ Enhancement</option>
              </select>
            </div>

            <button 
              className="clear-filters-btn"
              onClick={() => {
                setFilter({ priority: "All", category: "All" });
                setSearchTerm("");
              }}
              disabled={filter.priority === "All" && filter.category === "All" && !searchTerm}
            >
              Clear All Filters
            </button>

            <div className="active-filters">
              {filter.priority !== "All" && (
                <span className="active-filter-tag">
                  Priority: {filter.priority} ✕
                </span>
              )}
              {filter.category !== "All" && (
                <span className="active-filter-tag">
                  Category: {filter.category} ✕
                </span>
              )}
              {searchTerm && (
                <span className="active-filter-tag">
                  Search: "{searchTerm}" ✕
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="app-main">
          {/* Chart View */}
          {activeView === 'chart' && (
            <div className="chart-view">
              <ProgressChart tasks={tasks} />
            </div>
          )}

          {/* Board View */}
          {activeView === 'board' && (
            <div className="board-container">
              {/* Board Header Stats */}
              <div className="board-header-stats">
                <BoardStats tasks={tasks} />
              </div>

              {/* Task Form (if not in header) */}
              {!showTaskForm && (
                <div className="task-form-section">
                  <button 
                    className="quick-add-task"
                    onClick={() => setShowTaskForm(true)}
                  >
                    <span className="quick-add-icon">+</span>
                    <span className="quick-add-text">Quick Add Task</span>
                    <span className="quick-add-hint">Click or drag to column</span>
                  </button>
                </div>
              )}

              {/* Kanban Columns */}
              <div className="columns-grid">
                {COLUMNS.map((column) => {
                  const columnTasks = getColumnTasks(column.title);
                  return (
                    <div key={column.id} className="column-wrapper">
                      <div className="column-header" style={{ borderColor: column.color }}>
                        <div className="column-header-content">
                          <span className="column-icon">{column.icon}</span>
                          <h3>{column.title}</h3>
                          <span className="column-count" style={{ backgroundColor: column.color }}>
                            {columnTasks.length}
                          </span>
                        </div>
                        <p className="column-subtitle">
                          {columnTasks.length} task{columnTasks.length !== 1 ? 's' : ''}
                          {columnTasks.length > 0 && ` • ${Math.round((columnTasks.length / filteredTasks.length) * 100)}% of total`}
                        </p>
                      </div>
                      <Column
                        title={column.title}
                        tasks={columnTasks}
                        onMove={moveTask}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                        color={column.color}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Empty States */}
              {filteredTasks.length === 0 && tasks.length > 0 && (
                <div className="empty-board-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No tasks match your filters</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button 
                    className="reset-filters-btn"
                    onClick={() => {
                      setFilter({ priority: "All", category: "All" });
                      setSearchTerm("");
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {tasks.length === 0 && (
                <div className="empty-board-state">
                  <div className="empty-icon">📝</div>
                  <h3>Your board is empty</h3>
                  <p>Create your first task using the "Create New Task" button above</p>
                  <button 
                    className="reset-filters-btn"
                    onClick={() => setShowTaskForm(true)}
                  >
                    Create First Task
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </DndProvider>
  );
}