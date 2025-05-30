import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './QuestCard.css';

const QuestCard = ({ card, onComplete }) => {
  if (!card) return null;

  return (
    <div className="quest-card-container">
      <Card className="quest-card">
        <div className="quest-card-inner">
          <div className="quest-card-header">
            <h3>Quest Card</h3>
            <span className="quest-points">+{card.points} Points</span>
          </div>
          <Card.Body>
            <div className="quest-content">
              <h4>{card.title}</h4>
              <p className="quest-description">{card.description}</p>
            </div>
            <div className="quest-footer">
              <Button 
                variant="success" 
                className="complete-quest-btn"
                onClick={() => onComplete(true)}
              >
                Complete Quest
              </Button>
            </div>
          </Card.Body>
        </div>
      </Card>
    </div>
  );
};

export default QuestCard; 