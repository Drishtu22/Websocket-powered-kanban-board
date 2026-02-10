import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ProgressChart({ tasks }) {
  const counts = {
    "To Do": tasks.filter((t) => t.status === "To Do").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Done: tasks.filter((t) => t.status === "Done").length,
  };

  const total = tasks.length;
  const completionRate = total > 0 ? (counts.Done / total) * 100 : 0;

  const data = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Tasks",
        data: Object.values(counts),
        backgroundColor: ["#FF6B6B", "#4ECDC4", "#1DD1A1"],
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${value} tasks (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="progress-chart-container">
      <div className="chart-header">
        <h3>Task Progress</h3>
        <div className="completion-rate">
          <span className="rate-label">Completion Rate:</span>
          <span className="rate-value">{completionRate.toFixed(1)}%</span>
        </div>
      </div>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
      <div className="chart-stats">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="stat-item">
            <div className="stat-label">{status}</div>
            <div className="stat-value">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}