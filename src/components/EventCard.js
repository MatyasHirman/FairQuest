import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './Card.css';

function EventCard({ title, description, points, onComplete }) {
  return (
    <Card className="task-card mb-3">
      <Card.Body>
        <Card.Title className="text-center">{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text className="text-center">Points Needed: {points}</Card.Text>
        <hr />
        <div className="task-completion text-center">
          <h6>Event Completion:</h6>
          <div className="d-flex justify-content-center">
            <Button variant="success" className="completion-btn" onClick={() => onComplete(true)}>✔️ Complete</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default EventCard;
