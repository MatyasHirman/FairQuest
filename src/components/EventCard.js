import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './EventCard.css';

const EventCard = ({ card, onComplete }) => {
  if (!card) return null;

  return (
    <div className="event-card-container">
      <Card className="event-card">
        <div className="event-card-inner">
          <div className="event-card-header">
            <h3>Event Card</h3>
            <span className="event-points">{card.points} Points Required</span>
          </div>
          <Card.Body>
            <div className="event-content">
              <h4>{card.title}</h4>
              <p className="event-description">{card.description}</p>
            </div>
            <div className="event-footer">
              <Button 
                variant="primary" 
                className="complete-event-btn"
                onClick={() => onComplete(true)}
              >
                Complete Event
              </Button>
            </div>
          </Card.Body>
        </div>
      </Card>
    </div>
  );
};

export default EventCard;
