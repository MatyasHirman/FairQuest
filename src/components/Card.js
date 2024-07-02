import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import './Card.css';

function TaskCard({ title, description, points, assignedPlayers, onTogglePlayer, onComplete }) {
  const players = ['Ethan', 'Grace', 'Leo', 'Mia'];

  return (
    <Card className="task-card mb-3">
      <Card.Body>
        <Card.Title className="card-title">{title}</Card.Title>
        <Card.Text className="card-text">{description}</Card.Text>
        <Card.Text className="card-points">Points: {points}</Card.Text>
        <hr />
        <div className="assign-players">
          <h6>Assign Players:</h6>
          <Row>
            {players.map(player => (
              <Col key={player} xs={6} className="text-center">
                <Button
                  variant={assignedPlayers && assignedPlayers.includes(player) ? "success" : "outline-primary"}
                  onClick={() => onTogglePlayer(player)}
                  className="mb-2"
                >
                  {player} {assignedPlayers && assignedPlayers.includes(player) ? '✓' : ''}
                </Button>
              </Col>
            ))}
          </Row>
        </div>
        <hr />
        <div className="task-completion text-center">
          <h6>Task Completion:</h6>
          <div className="d-flex justify-content-center">
            <Button variant="success" className="me-2 completion-btn" onClick={() => onComplete(true)}>✔️ Complete</Button>
            <Button variant="danger" className="completion-btn" onClick={() => onComplete(false)}>❌ Incomplete</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TaskCard;
