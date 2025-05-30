import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import LandingPage from './components/LandingPage';
import Board from './components/Board';
import './App.css';

function App() {
  // Use basename only in production (GitHub Pages)
  const basename = process.env.NODE_ENV === 'production' ? '/FairQuest' : '';

  return (
    <GameProvider>
      <Router basename={basename}>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game" element={<Board />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
