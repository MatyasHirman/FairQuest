import React from 'react';
import { useGame } from '../context/GameContext';
import { ProgressBar } from 'react-bootstrap';
import './GameStage.css';

const GameStage = () => {
  const { state } = useGame();
  const { currentStage, maxStages, selectedSector } = state;

  const stageProgress = (currentStage / maxStages) * 100;

  return (
    <div className="game-stage">
      <div className="stage-header">
        <h2>Current Stage: {selectedSector}</h2>
        <span className="stage-counter">Stage {currentStage + 1} of {maxStages}</span>
      </div>
      <ProgressBar 
        now={stageProgress} 
        label={`${Math.round(stageProgress)}%`}
        variant="success"
        className="stage-progress"
      />
      <div className="stage-description">
        <p>Complete tasks and events in the current sector to advance to the next stage.</p>
      </div>
    </div>
  );
};

export default GameStage; 