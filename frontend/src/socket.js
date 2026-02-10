import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://kanban-backend-jib7.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], 
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  secure: true, // Added for HTTPS
  withCredentials: true // Added for CORS
});

export default socket;