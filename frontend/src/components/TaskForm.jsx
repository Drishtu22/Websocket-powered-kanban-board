import { useState, useRef } from "react";
import "./TaskForm.css";

export default function TaskForm({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Feature");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status: "To Do",
      priority,
      category,
      createdAt: new Date().toISOString(),
      ...(file && { file }),
    };

    onAdd(taskData);

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Feature");
    setFile(null);
    setIsOpen(false);
    setIsSubmitting(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    const fileUrl = URL.createObjectURL(f);
    setFile({
      url: fileUrl,
      type: f.type,
      name: f.name,
      size: f.size,
    });
  };

  const removeFile = () => {
    if (file?.url) URL.revokeObjectURL(file.url);
    setFile(null);
    fileInputRef.current.value = "";
  };

  return (
    <div className="task-form-wrapper">
      {!isOpen ? (
        <button className="open-form-btn" onClick={() => setIsOpen(true)}>
          ➕ Add Task
        </button>
      ) : (
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Create Task</h3>
            <button type="button" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <input
            className="input"
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <textarea
            className="textarea"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="row">
            <div>
              <label>Priority</label>
              <div className="pill-group">
                {["Low", "Medium", "High"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={`pill ${priority === p ? "active" : ""}`}
                    onClick={() => setPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label>Category</label>
              <select
                className="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Bug">🐛 Bug</option>
                <option value="Feature">✨ Feature</option>
                <option value="Enhancement">⚡ Enhancement</option>
              </select>
            </div>
          </div>

          <div className="file-box">
            {!file ? (
              <label className="file-label">
                📎 Attach file
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="file-preview">
                <span>{file.name}</span>
                <button type="button" onClick={removeFile}>×</button>
              </div>
            )}
          </div>

          <div className="actions">
            <button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
