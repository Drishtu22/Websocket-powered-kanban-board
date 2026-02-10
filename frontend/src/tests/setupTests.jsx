import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock WebSocket globally
global.WebSocket = vi.fn(() => ({
  send: vi.fn(),
  close: vi.fn(),
  onopen: null,
  onmessage: null,
  onclose: null,
}));

// Mock react-chartjs-2
vi.mock("react-chartjs-2", () => ({
  Line: () => <div data-testid="mock-chart" />,
  Bar: () => <div data-testid="mock-chart" />,
}));
