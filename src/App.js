import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import LandingPage from './components/LandingPage';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<Board />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GameProvider>
  );
}

export default App;
