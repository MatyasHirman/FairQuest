import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import QuestCard from './QuestCard';
import EventCard from './EventCard';
import CircularProgress from './CircularProgress';
import Tutorial from './Tutorial';
import './Board.css';

function Board() {
  const { state, dispatch } = useGame();
  const [showProgress, setShowProgress] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const navigate = useNavigate();

  const hasEnoughPoints = state.revealedEventCard && state.points >= state.revealedEventCard.requiredPoints;

  // Debug logs
  console.log('Board component state:', state);
  console.log('Selected sector:', state.selectedSector);
  console.log('Sectors:', state.sectors);

  useEffect(() => {
    console.log('Board useEffect - checking team info');
    if (!state.teamName || !state.players.length) {
      console.log('No team info found, redirecting to landing page');
      navigate('/');
    }
  }, [state.teamName, state.players, navigate]);

  // Show loading state if not fully initialized
  if (!state.teamName || !state.players.length) {
    console.log('Rendering loading state');
    return (
      <div className="game-board">
        <div className="loading-state">
          Loading game...
        </div>
      </div>
    );
  }

  console.log('Rendering full game board');

  const handleSectorClick = (sector) => {
    dispatch({ type: 'SET_SECTOR', payload: sector });
    setShowProgress(false);
  };

  const handleRevealEventCard = () => {
    const eventCard = {
      type: 'event',
      title: `${state.selectedSector} Event`,
      description: 'Event card description will be added later',
      requiredPoints: 18
    };
    dispatch({ type: 'REVEAL_EVENT_CARD', payload: eventCard });
  };

  const handleRevealQuestCard = () => {
    if (!state.revealedEventCard) return;
    
    // Generate a random quest card
    const questCard = {
      type: 'quest',
      title: `${state.selectedSector} Quest`,
      description: 'Quest card description will be added later',
      points: 3
    };
    dispatch({ type: 'REVEAL_QUEST_CARD', payload: questCard });
  };

  const handleCompleteCard = (isCompleted) => {
    if (isCompleted) {
      if (state.revealedEventCard && state.points >= state.revealedEventCard.requiredPoints) {
        // Move to next stage
        dispatch({ type: 'ADVANCE_STAGE' });
      } else if (state.revealedCard) {
        // Complete quest card and add points
        dispatch({ 
          type: 'UPDATE_POINTS', 
          payload: { points: state.revealedCard.points } 
        });
        dispatch({ type: 'COMPLETE_CARD' });
      }
    }
  };

  const handleSaveGame = () => {
    dispatch({ type: 'SAVE_GAME' });
  };

  const handleLoadGame = () => {
    dispatch({ type: 'LOAD_GAME' });
  };

  const handleCompleteEvent = () => {
    if (hasEnoughPoints) {
      dispatch({ type: 'ADVANCE_STAGE' });
    }
  };

  const handleBackToGame = () => {
    dispatch({ type: 'RETURN_TO_GAME' });
  };

  const handleTutorialStart = () => {
    setShowTutorial(true);
    setTutorialStep(0);
  };

  const handleTutorialNext = () => {
    if (tutorialStep < 4) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

  if (state.isGameComplete) {
    return (
      <div className="game-board">
        <nav className="top-nav">
          <div className="nav-logo">
            <h1>FAIRQuest</h1>
          </div>
        </nav>
        <div className="game-complete-container">
          <div className="game-complete-content">
            <h2>Congratulations, {state.teamName}!</h2>
            <h1>You saved our REALM, you are our heroes!</h1>
            <div className="team-members">
              {state.players.map((player) => (
                <div key={player.id} className="hero-name">
                  {player.name}
                </div>
              ))}
            </div>
            <Button 
              variant="light" 
              className="back-to-game-btn"
              onClick={handleBackToGame}
            >
              Back to Game Overview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-board">
      <nav className="top-nav">
        <div className="nav-logo">
          <h1>FAIRQuest</h1>
        </div>
        <div className="nav-buttons">
          <Button 
            variant="dark" 
            className="materials-btn"
            href={`${process.env.PUBLIC_URL}/game-materials.pdf`}
            download
          >
            Materials
          </Button>
          <Button 
            variant="dark" 
            className="tutorial-btn"
            onClick={handleTutorialStart}
          >
            Tutorial
          </Button>
        </div>
      </nav>

      <div className="main-content">
        <div className="left-panel">
          <div className="sectors-sidebar">
            {state.sectors.map((sector) => (
              <Button
                key={sector}
                variant={sector === state.selectedSector ? "dark" : "secondary"}
                className="sector-btn"
                onClick={() => handleSectorClick(sector)}
              >
                {sector}
              </Button>
            ))}
          </div>

          <div className="team-panel">
            <div className="team-info">
              <h3 className="team-name">{state.teamName}</h3>
              <div className="players-list">
                {state.players.map((player, index) => (
                  <div key={player.id} className="player-name">
                    Player {index + 1}: {player.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="game-content">
          <div className="points-display">
            <div className={`points-info ${hasEnoughPoints ? 'points-complete' : ''}`}>
              <span className="points-label">Current Points:</span>
              <span className="points-value">{state.points}</span>
              <span className="points-separator">/</span>
              <span className="points-target">
                {state.revealedEventCard ? state.revealedEventCard.requiredPoints : '0'}
              </span>
            </div>
          </div>

          <div className="game-area">
            {showProgress ? (
              <CircularProgress sectors={state.sectors} currentSector={state.selectedSector} />
            ) : (
              <div className="game-area-content">
                <div className="cards-container">
                  <div className="card-area">
                    {state.revealedEventCard ? (
                      <EventCard
                        card={state.revealedEventCard}
                        onComplete={handleCompleteEvent}
                        isComplete={hasEnoughPoints}
                      />
                    ) : (
                      <Button
                        variant="secondary"
                        className="show-card-btn"
                        onClick={handleRevealEventCard}
                      >
                        SHOW EVENT CARD
                      </Button>
                    )}
                  </div>

                  <div className="card-area">
                    {hasEnoughPoints ? (
                      <div className="completion-message">
                        You have enough points to complete current event!
                        <Button
                          variant="primary"
                          className="complete-event-btn"
                          onClick={handleCompleteEvent}
                        >
                          Complete Event
                        </Button>
                      </div>
                    ) : state.revealedCard ? (
                      <QuestCard
                        card={state.revealedCard}
                        onComplete={handleCompleteCard}
                      />
                    ) : (
                      <Button
                        variant="secondary"
                        className="show-card-btn"
                        onClick={handleRevealQuestCard}
                        disabled={!state.revealedEventCard}
                      >
                        SHOW QUEST CARD
                      </Button>
                    )}
                  </div>
                </div>
                <div className="timer-section">
                  <div className="timer-wrapper">
                    <Timer />
                  </div>
                  <div className="game-controls">
                    <Button 
                      variant="outline-primary" 
                      className="control-btn"
                      onClick={handleSaveGame}
                    >
                      Save Game
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      className="control-btn"
                      onClick={handleLoadGame}
                    >
                      Load Game
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTutorial && (
        <Tutorial
          currentStep={tutorialStep}
          onNextStep={handleTutorialNext}
          onClose={handleTutorialClose}
        />
      )}
    </div>
  );
}

export default Board;
