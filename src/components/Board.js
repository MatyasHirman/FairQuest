import React, { useState, useEffect } from 'react';
import QuestCard from './QuestCard';
import EventCard from './EventCard';
import Timer from './Timer';
import * as XLSX from 'xlsx';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { flipSound, successSound, whooshSound } from '../sounds';
import { useGame } from '../context/GameContext';
import './Board.css';

function Board() {
  const { state, dispatch } = useGame();
  const [revealedCard, setRevealedCard] = useState(null);
  const [revealedEventCard, setRevealedEventCard] = useState(null);
  const [cards, setCards] = useState({});
  const [completedCards, setCompletedCards] = useState({});
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    console.log("Fetching cards.xlsx");
    fetch(`${process.env.PUBLIC_URL}/cards.xlsx`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.arrayBuffer();
      })
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const cardData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Card data loaded:", cardData);
        const cardsBySector = cardData.reduce((acc, card) => {
          const { sector, type } = card;
          if (!acc[sector]) {
            acc[sector] = { events: [], quests: [] };
          }
          acc[sector][type === 'event' ? 'events' : 'quests'].push(card);
          return acc;
        }, {});
        setCards(cardsBySector);
        setCompletedCards(Object.keys(cardsBySector).reduce((acc, sector) => {
          acc[sector] = { events: [], quests: [] };
          return acc;
        }, {}));
      })
      .catch(error => {
        console.error('Error loading cards:', error);
        setAlert('Failed to load cards. Please try again later.');
      });
  }, []);

  const handleRevealQuestCard = () => {
    if (!revealedEventCard) {
      setAlert('You must reveal an Event card before revealing Quest cards.');
      return;
    }

    const sectorCards = cards[state.selectedSector]?.quests || [];
    const completedSectorCards = completedCards[state.selectedSector]?.quests || [];

    if (sectorCards.length === completedSectorCards.length) {
      setAlert(`No more quest cards available for this stage.`);
      return;
    }

    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * sectorCards.length);
    } while (completedSectorCards.includes(randomIndex));

    flipSound.play();
    setRevealedCard({ ...sectorCards[randomIndex], index: randomIndex });
    setAlert(null);
  };

  const handleRevealEventCard = () => {
    const sectorCards = cards[state.selectedSector]?.events || [];
    if (sectorCards.length === 0) {
      setAlert(`No event cards available for this stage.`);
      return;
    }

    const randomIndex = Math.floor(Math.random() * sectorCards.length);
    flipSound.play();
    setRevealedEventCard(sectorCards[randomIndex]);
    setAlert(null);
  };

  const handleCompleteCard = (isCompleted) => {
    if (isCompleted && revealedCard) {
      dispatch({ 
        type: 'UPDATE_PLAYER_POINTS', 
        payload: { points: revealedCard.points } 
      });

      const newCompletedCards = { ...completedCards };
      newCompletedCards[state.selectedSector].quests.push(revealedCard.index);
      setCompletedCards(newCompletedCards);

      successSound.play();
    }
    setRevealedCard(null);
  };

  const handleCompleteEventCard = (isCompleted) => {
    if (isCompleted && revealedEventCard) {
      whooshSound.play();
      successSound.play();
      dispatch({ type: 'ADVANCE_STAGE' });
      setRevealedEventCard(null);
    }
  };

  return (
    <Container className="board-container">
      <Row>
        <Col md={3}>
          <div className="team-panel">
            <h3>Team Members</h3>
            <div className="team-list">
              {state.players.map(player => (
                <div key={player.id} className="team-member">
                  {player.name}
                </div>
              ))}
            </div>
            <div className="team-points">
              Total Points: {state.points}
            </div>
          </div>
        </Col>
        <Col md={9}>
          <div className="game-area">
            {alert && (
              <Alert variant="info" onClose={() => setAlert(null)} dismissible>
                {alert}
              </Alert>
            )}
            <div className="card-actions">
              <Button
                variant="primary"
                className="reveal-btn"
                onClick={handleRevealEventCard}
                disabled={revealedEventCard !== null}
              >
                Reveal Event Card
              </Button>
              <Button
                variant="success"
                className="reveal-btn"
                onClick={handleRevealQuestCard}
                disabled={!revealedEventCard || revealedCard !== null}
              >
                Reveal Quest Card
              </Button>
            </div>
            <div className="cards-display">
              {revealedEventCard && (
                <EventCard
                  card={revealedEventCard}
                  onComplete={handleCompleteEventCard}
                />
              )}
              {revealedCard && (
                <QuestCard
                  card={revealedCard}
                  onComplete={handleCompleteCard}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
      <div className="timer-container">
        <Timer />
      </div>
    </Container>
  );
}

export default Board;
