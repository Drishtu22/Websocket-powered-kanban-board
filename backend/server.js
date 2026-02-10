const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, 
];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('.onrender.com')) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || origin.includes('.onrender.com') || origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'], 
});

let tasks = [];

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit("tasks:update", tasks);

  socket.on("task:add", (task) => {
    console.log("Task received:", task);

    const newTask = {
      id: Date.now(),
      title: task.title,
      status: task.status,
      priority: task.priority || "Medium",
      category: task.category || "Feature",
      description: task.description || "",
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    io.emit("tasks:update", tasks);
  });

  socket.on("task:move", ({ id, status }) => {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    io.emit("tasks:update", tasks);
  });

  socket.on("task:delete", (id) => {
    tasks = tasks.filter((t) => t.id !== id);
    io.emit("tasks:update", tasks);
  });

  socket.on("task:update", (updatedTask) => {
    tasks = tasks.map((t) =>
      t.id === updatedTask.id ? { ...t, ...updatedTask } : t
    );
    io.emit("tasks:update", tasks);
  });

  socket.on("tasks:get", () => {
    socket.emit("tasks:update", tasks);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    service: "kanban-backend",
    timestamp: new Date().toISOString(),
    taskCount: tasks.length
  });
});

app.get("/", (req, res) => {
  res.json({ 
    message: "Kanban Board WebSocket API",
    endpoints: {
      health: "/health",
      websocket: "ws://" + req.headers.host
    }
  });
});


const PORT = process.env.PORT || 4000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});