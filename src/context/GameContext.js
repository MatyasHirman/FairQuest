import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  points: 0,
  revealedCard: null,
  revealedEventCard: null,
  selectedSector: 'Plan',
  cards: {},
  completedCards: {},
  players: [
    { id: 1, name: 'Ethan', points: 0 },
    { id: 2, name: 'Grace', points: 0 },
    { id: 3, name: 'Leo', points: 0 },
    { id: 4, name: 'Mia', points: 0 }
  ],
  loading: false,
  error: null,
  gameStatus: 'idle', // 'idle' | 'playing' | 'paused' | 'completed'
  currentStage: 0,
  maxStages: 7,
  tutorial: {
    active: false,
    step: 0
  }
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.payload, loading: false };
    case 'REVEAL_QUEST_CARD':
      return { ...state, revealedCard: action.payload };
    case 'REVEAL_EVENT_CARD':
      return { ...state, revealedEventCard: action.payload };
    case 'COMPLETE_CARD':
      return {
        ...state,
        completedCards: {
          ...state.completedCards,
          [state.selectedSector]: {
            ...state.completedCards[state.selectedSector],
            quests: [...state.completedCards[state.selectedSector].quests, action.payload]
          }
        }
      };
    case 'UPDATE_PLAYER_POINTS':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.playerId
            ? { ...player, points: player.points + action.payload.points }
            : player
        )
      };
    case 'SET_SECTOR':
      return { ...state, selectedSector: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_GAME_STATUS':
      return { ...state, gameStatus: action.payload };
    case 'ADVANCE_STAGE':
      return { 
        ...state, 
        currentStage: Math.min(state.currentStage + 1, state.maxStages),
        gameStatus: state.currentStage + 1 >= state.maxStages ? 'completed' : state.gameStatus
      };
    case 'TOGGLE_TUTORIAL':
      return {
        ...state,
        tutorial: {
          ...state.tutorial,
          active: action.payload.active,
          step: action.payload.step
        }
      };
    case 'SAVE_GAME':
      localStorage.setItem('fairQuestGameState', JSON.stringify(state));
      return state;
    case 'LOAD_GAME':
      return { ...action.payload };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 