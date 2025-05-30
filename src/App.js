import React from 'react';
import { Container } from 'react-bootstrap';
import Board from './components/Board';
import GameStage from './components/GameStage';
import { GameProvider } from './context/GameContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <Container>
          <header className="App-header">
            <h1>Fair Quest</h1>
            <p>Educational Game for Research Data Management</p>
          </header>
          <GameStage />
          <Board />
        </Container>
      </div>
    </GameProvider>
  );
}

export default App;
