import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

const SECTORS = ['Plan', 'Collect', 'Process', 'Analyze', 'Preserve', 'Share', 'Reuse'];

const initialState = {
  points: 0,
  revealedCard: null,
  revealedEventCard: null,
  selectedSector: SECTORS[0],
  sectors: SECTORS,
  cards: {},
  completedCards: {},
  players: [],
  teamName: '',
  password: '',
  loading: false,
  error: null,
  gameStatus: 'playing',
  currentStage: 0,
  maxStages: SECTORS.length,
  isGameComplete: false,
  tutorial: {
    active: false,
    step: 0
  }
};

function gameReducer(state, action) {
  console.log('GameReducer called with action:', action.type);
  console.log('Current state:', state);

  switch (action.type) {
    case 'SET_TEAM_INFO':
      console.log('Setting team info with payload:', action.payload);
      // Initialize completedCards for each sector
      const initialCompletedCards = SECTORS.reduce((acc, sector) => {
        acc[sector] = { quests: [], eventCompleted: false };
        return acc;
      }, {});
      
      const newState = {
        ...state,
        teamName: action.payload.teamName,
        players: action.payload.players,
        password: action.payload.password,
        completedCards: initialCompletedCards
      };
      console.log('New state after SET_TEAM_INFO:', newState);
      return newState;
    case 'SET_SECTOR':
      return {
        ...state,
        selectedSector: action.payload,
        revealedCard: null,
        revealedEventCard: null,
        points: 0 // Reset points when changing sectors
      };
    case 'SET_CARDS':
      return { ...state, cards: action.payload, loading: false };
    case 'REVEAL_QUEST_CARD':
      return { 
        ...state, 
        revealedCard: action.payload 
      };
    case 'REVEAL_EVENT_CARD':
      return { 
        ...state, 
        revealedEventCard: action.payload,
        revealedCard: null 
      };
    case 'COMPLETE_CARD':
      const sectorCards = state.completedCards[state.selectedSector] || { quests: [], eventCompleted: false };
      if (state.revealedCard) {
        return {
          ...state,
          completedCards: {
            ...state.completedCards,
            [state.selectedSector]: {
              ...sectorCards,
              quests: [...sectorCards.quests, state.revealedCard]
            }
          },
          revealedCard: null
        };
      }
      return state;
    case 'UPDATE_POINTS':
      return {
        ...state,
        points: state.points + action.payload.points
      };
    case 'ADVANCE_STAGE':
      // Find the index of the current sector in the SECTORS array
      const currentSectorIndex = SECTORS.indexOf(state.selectedSector);
      if (currentSectorIndex === -1) return state; // Safety check
      
      // Next sector is always the next one in the sequence
      const nextSectorIndex = currentSectorIndex + 1;
      const nextSector = SECTORS[nextSectorIndex];

      // Check if we've completed all sectors
      if (nextSectorIndex >= SECTORS.length) {
        return {
          ...state,
          isGameComplete: true,
          gameStatus: 'completed',
          revealedCard: null,
          revealedEventCard: null
        };
      }

      // Mark current sector as completed and move to next
      return {
        ...state,
        selectedSector: nextSector,
        gameStatus: 'playing',
        points: 0,
        revealedCard: null,
        revealedEventCard: null,
        completedCards: {
          ...state.completedCards,
          [state.selectedSector]: {
            ...state.completedCards[state.selectedSector],
            eventCompleted: true
          }
        }
      };
    case 'RETURN_TO_GAME':
      return {
        ...state,
        isGameComplete: false,
        gameStatus: 'reviewing',
        selectedSector: SECTORS[0],
        revealedCard: null,
        revealedEventCard: null,
        points: 0
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SAVE_GAME':
      const gameState = {
        ...state,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`fairQuest_${state.teamName}_${state.password}`, JSON.stringify(gameState));
      return state;
    case 'LOAD_GAME':
      const savedState = JSON.parse(localStorage.getItem(`fairQuest_${state.teamName}_${state.password}`));
      return savedState ? { ...savedState } : state;
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  console.log('GameProvider current state:', state);

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