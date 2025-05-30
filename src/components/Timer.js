import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './Timer.css';

const Timer = () => {
  const [time, setTime] = useState(30 * 60); // 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showSetTime, setShowSetTime] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleSet = () => {
    setShowSetTime(true);
    setIsRunning(false);
  };

  const handleTimeSet = (minutes) => {
    setTime(minutes * 60);
    setShowSetTime(false);
  };

  return (
    <div className="timer">
      <div className="timer-icon">⌚</div>
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <Button
          variant={isRunning ? "secondary" : "dark"}
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </Button>
        <Button
          variant={!isRunning ? "secondary" : "dark"}
          onClick={handleStop}
          disabled={!isRunning}
        >
          Stop
        </Button>
        <Button
          variant="secondary"
          onClick={handleSet}
        >
          Set
        </Button>
      </div>

      {showSetTime && (
        <div className="timer-set-overlay">
          <div className="timer-set-panel">
            <h4>Set Timer</h4>
            <div className="timer-presets">
              {[5, 10, 15, 20, 25, 30].map(minutes => (
                <Button
                  key={minutes}
                  variant="outline-dark"
                  onClick={() => handleTimeSet(minutes)}
                >
                  {minutes} min
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
