import { useDrag } from "react-dnd";
import { useState } from "react";
import "./TaskCard.css";

const priorityColors = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#10B981",
};

const priorityIcons = {
  High: "🔥",
  Medium: "🟡",
  Low: "🟢",
};

const categoryIcons = {
  Bug: "🐛",
  Feature: "✨",
  Enhancement: "⚡",
};

const categoryColors = {
  Bug: "#8B5CF6",
  Feature: "#0EA5E9",
  Enhancement: "#F59E0B",
};

export default function TaskCard({ task, onDelete, onUpdate }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "TASK",
      item: { id: task.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [task.id]
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );

  const handleKeyPress = (e, cb) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      cb();
    }
  };

  const priorityColor = priorityColors[task.priority];
  const categoryColor = categoryColors[task.category];

  return (
    <div
      ref={drag}
      className={`task-item ${isDragging ? "dragging" : ""}`}
      onClick={(e) => {
        if (!isEditing && !e.target.closest(".task-action-btn")) {
          setIsExpanded(!isExpanded);
        }
      }}
    >
      {/* HEADER */}
      <div className="task-header">
        <div className="task-title-section">
          {isEditing ? (
            <input
              className="task-edit-input"
              value={editTitle}
              autoFocus
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => {
                if (editTitle.trim() && editTitle !== task.title) {
                  onUpdate({ ...task, title: editTitle });
                }
                setIsEditing(false);
              }}
              onKeyPress={(e) =>
                handleKeyPress(e, () => setIsEditing(false))
              }
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <div
                className="task-title"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                {task.title}
              </div>
              <button
                className="task-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                ✏️
              </button>
            </>
          )}
        </div>

        <div className="task-actions">
          <button
            className="task-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? "▲" : "▼"}
          </button>
          <button
            className="task-action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* TAGS */}
      <div className="task-meta">
        <div className="priority-selector">
          {["High", "Medium", "Low"].map((p) => (
            <button
              key={p}
              className={`priority-option ${
                task.priority === p ? "selected" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ ...task, priority: p });
              }}
            >
              {priorityIcons[p]} {p}
            </button>
          ))}
        </div>

        <div className="category-selector">
          {["Bug", "Feature", "Enhancement"].map((c) => (
            <button
              key={c}
              className={`category-option ${
                task.category === c ? "selected" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ ...task, category: c });
              }}
            >
              {categoryIcons[c]} {c}
            </button>
          ))}
        </div>
      </div>

      {/* DETAILS */}
      {isExpanded && (
        <div className="task-details">
          <div className="description-section">
            <span className="detail-label">Description</span>

            {isEditing ? (
              <textarea
                className="description-edit"
                rows="3"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onBlur={() =>
                  onUpdate({ ...task, description: editDescription })
                }
                onKeyPress={(e) =>
                  handleKeyPress(e, () =>
                    onUpdate({ ...task, description: editDescription })
                  )
                }
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div
                className="description-text"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                {task.description || (
                  <span className="placeholder-text">
                    Click to add description…
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="task-info-grid">
            <div className="info-item">
              <span className="info-label">Priority</span>
              <span
                className="priority-badge"
                style={{
                  background: `${priorityColor}20`,
                  color: priorityColor,
                }}
              >
                {priorityIcons[task.priority]} {task.priority}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Category</span>
              <span
                className="category-badge"
                style={{
                  background: `${categoryColor}20`,
                  color: categoryColor,
                }}
              >
                {categoryIcons[task.category]} {task.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
