// src/components/DownloadButton.js
import React from 'react';
import { Button } from 'react-bootstrap';
import './DownloadButton.css';

function DownloadButton() {
  return (
    <div className="download-button-container">
      <Button variant="primary" href="/path/to/your/pdf/file.pdf" download>
        Download PDF
      </Button>
    </div>
  );
}

export default DownloadButton;
