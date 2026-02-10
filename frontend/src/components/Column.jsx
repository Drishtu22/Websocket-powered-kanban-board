import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";

export default function Column({
  title,
  tasks,
  onMove,
  onDelete,
  onUpdate,
  color
}) {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      if (!item?.id) return;
      onMove(item.id, title);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const id = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      ref={drop}
      data-testid={`column-${id}`}
      className={`column ${isOver ? "highlight" : ""}`}
      style={{ borderColor: color }}
    >
      <h3>{title}</h3>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
