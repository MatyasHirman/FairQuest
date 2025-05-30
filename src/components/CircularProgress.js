import React from 'react';
import './CircularProgress.css';

const CircularProgress = ({ sectors, currentSector }) => {
  const totalSectors = sectors.length;
  const radius = 200; // Size of the circle
  const center = radius;
  
  return (
    <div className="circular-progress">
      <svg width={radius * 2} height={radius * 2}>
        <g transform={`translate(${center},${center})`}>
          {sectors.map((sector, index) => {
            const angle = (360 / totalSectors) * index - 90;
            const isActive = sector === currentSector;
            const x = Math.cos((angle * Math.PI) / 180) * radius * 0.7;
            const y = Math.sin((angle * Math.PI) / 180) * radius * 0.7;

            return (
              <g key={sector}>
                <circle
                  className={`sector-indicator ${isActive ? 'active' : ''}`}
                  cx={x}
                  cy={y}
                  r="30"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="sector-text"
                >
                  {sector.toLowerCase()}
                </text>
                {index > 0 && (
                  <line
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    className="connector-line"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default CircularProgress; 