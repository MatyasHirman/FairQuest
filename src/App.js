import React from 'react';
import { Container } from 'react-bootstrap';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <Container>
      <div className="custom-jumbotron">
        <h1>FAIR Quest</h1>
      </div>
      <Board />
    </Container>
  );
}

export default App;
