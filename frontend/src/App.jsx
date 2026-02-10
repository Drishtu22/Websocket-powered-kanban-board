import { useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  useEffect(() => {
    console.log("App mounted");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
        WebSocket-Powered Kanban Board
      </h1>

      {/* Kanban Board Component */}
      <KanbanBoard />
    </div>
  );
}

export default App;
