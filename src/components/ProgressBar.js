// src/components/ProgressBar.js
import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import './ProgressBar.css';

function CustomProgressBar({ points, maxPoints }) {
  const now = (points / maxPoints) * 100;

  return (
    <div className="progress-container">
      <ProgressBar now={now} />
    </div>
  );
}

export default CustomProgressBar;
