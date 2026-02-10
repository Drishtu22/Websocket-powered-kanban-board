import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KanbanBoard from "../../components/KanbanBoard";

describe("Task handlers", () => {
  it("opens create task flow when Add Task button is clicked", () => {
    render(<KanbanBoard />);

  
    const addTaskBtn = screen.getByRole("button", {
      name: /add task/i,
    });
    fireEvent.click(addTaskBtn);

    
    const closeBtn = screen.getByRole("button", { name: "✕" });
    expect(closeBtn).toBeInTheDocument();
  });
});
