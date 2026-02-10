import "./BoardStats.css";

export default function BoardStats({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const highPriorityTasks = tasks.filter((t) => t.priority === "High").length;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon total">📋</div>
        <div className="stat-details">
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon completed">✅</div>
        <div className="stat-details">
          <div className="stat-value">{completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon in-progress">⚙️</div>
        <div className="stat-details">
          <div className="stat-value">{inProgressTasks}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon high-priority">🔥</div>
        <div className="stat-details">
          <div className="stat-value">{highPriorityTasks}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>
    </div>
  );
}