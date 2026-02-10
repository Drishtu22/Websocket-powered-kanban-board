import { render, screen } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanBoard from "../../components/KanbanBoard";

test("renders kanban columns for drag and drop", () => {
  render(
    <DndProvider backend={HTML5Backend}>
      <KanbanBoard />
    </DndProvider>
  );

  expect(screen.getByTestId("column-to-do")).toBeInTheDocument();
  expect(screen.getByTestId("column-in-progress")).toBeInTheDocument();
  expect(screen.getByTestId("column-done")).toBeInTheDocument();
});
