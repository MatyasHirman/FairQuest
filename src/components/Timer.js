import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './Timer.css';

const Timer = () => {
  const [time, setTime] = useState(30); // Výchozí hodnota 30 sekund
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState('30');

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timer);
      setIsRunning(false);
      alert('Time is up!');
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const handleStart = () => {
    const parsedTime = parseInt(inputTime, 10);
    if (!isNaN(parsedTime) && parsedTime > 0) {
      setTime(parsedTime);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(30);
    setInputTime('30');
  };

  const handleChangeTime = (e) => {
    setInputTime(e.target.value);
    const parsedTime = parseInt(e.target.value, 10);
    if (!isNaN(parsedTime) && parsedTime > 0) {
      setTime(parsedTime);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="timer">
      <input
        type="number"
        value={inputTime}
        onChange={handleChangeTime}
        disabled={isRunning}
        className="timer-input"
      />
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <Button variant="success" onClick={handleStart} disabled={isRunning}>
          Start
        </Button>
        <Button variant="danger" onClick={handleStop} disabled={!isRunning}>
          Stop
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Timer;
