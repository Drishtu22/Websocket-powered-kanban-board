import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Simple direct import
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  document.body.innerHTML = '<div style="padding:20px;color:red">Error: Root element not found</div>';
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}