import React from 'react';
import { Card, Image } from 'react-bootstrap';
import './Player.css';

function Player({ name, points }) {
  return (
    <Card className="player-card">
      <Card.Body className="d-flex align-items-center">
        <Image src={`${process.env.PUBLIC_URL}/images/${name}.png`} roundedCircle className="player-icon me-3" />
        <div>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{points} points</Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Player;
