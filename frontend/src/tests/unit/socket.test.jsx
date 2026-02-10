import { vi, describe, it, expect } from "vitest";
import io from "socket.io-client";

vi.mock("socket.io-client");

describe("WebSocket logic", () => {
  it("connects to socket server", () => {
    io.mockReturnValue({
      on: vi.fn(),
      emit: vi.fn(),
    });

    const socket = io("http://localhost:5000");
    expect(socket).toBeDefined();
  });
});
