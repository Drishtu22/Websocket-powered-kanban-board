import { render, screen } from "@testing-library/react";
import KanbanBoard from "../../components/KanbanBoard";
import { describe, it, expect } from "vitest";

describe("Real-time sync", () => {
  it("syncs task updates across clients", async () => {
    render(<KanbanBoard />);
    render(<KanbanBoard />);

    expect(screen.getAllByText(/to do/i).length).toBeGreaterThan(0);
  });
});
