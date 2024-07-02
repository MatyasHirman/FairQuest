// src/components/Player.js
import React from 'react';
import { Card } from 'react-bootstrap';

function Player({ name, points }) {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>Points: {points}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Player;
