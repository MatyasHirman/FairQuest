import React, { useState, useEffect } from 'react';
import TaskCard from './Card';
import EventCard from './EventCard';
import Player from './Player';
import CustomProgressBar from './ProgressBar';
import Timer from './Timer';
import * as XLSX from 'xlsx';
import { Container, Row, Col, Button, Dropdown, DropdownButton, Alert, Modal } from 'react-bootstrap';
import { flipSound, successSound, whooshSound } from '../sounds';
import './Board.css';
import './Tutorial.css';

const MAX_POINTS = 200;
const SECTORS = ['Plan', 'Collect', 'Process', 'Analyze', 'Preserve', 'Share', 'Reuse'];

function Board() {
  const [points, setPoints] = useState(0);
  const [revealedCard, setRevealedCard] = useState(null);
  const [revealedEventCard, setRevealedEventCard] = useState(null);
  const [selectedSector, setSelectedSector] = useState(SECTORS[0]);
  const [cards, setCards] = useState({});
  const [completedCards, setCompletedCards] = useState({});
  const [players, setPlayers] = useState([
    { name: 'Ethan', points: 0 },
    { name: 'Grace', points: 0 },
    { name: 'Leo', points: 0 },
    { name: 'Mia', points: 0 }
  ]);
  const [alert, setAlert] = useState(null);
  const [showEnding, setShowEnding] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

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

  useEffect(() => {
    // Aktualizace celkového počtu bodů
    const totalPoints = players.reduce((sum, player) => sum + player.points, 0);
    setPoints(totalPoints);
  }, [players]);

  const handleRevealQuestCard = () => {
    if (!revealedEventCard) {
      setAlert('You must reveal an Event card before revealing Quest cards.');
      return;
    }

    const sectorCards = cards[selectedSector]?.quests || [];
    const completedSectorCards = completedCards[selectedSector]?.quests || [];

    if (sectorCards.length === completedSectorCards.length) {
      setAlert(`No more quest cards available for sector ${selectedSector}. Moving to the next sector.`);
      setTimeout(() => handleSectorChange(SECTORS[(SECTORS.indexOf(selectedSector) + 1) % SECTORS.length]), 2000);
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
    const sectorCards = cards[selectedSector]?.events || [];
    if (sectorCards.length === 0) {
      setAlert(`No event cards available for sector ${selectedSector}.`);
      return;
    }

    const randomIndex = Math.floor(Math.random() * sectorCards.length);
    flipSound.play();
    setRevealedEventCard(sectorCards[randomIndex]);
    setAlert(null);
  };

  const handleCompleteCard = (isCompleted) => {
    if (isCompleted && revealedCard && revealedCard.assignedPlayers) {
      const updatedPlayers = players.map(player => {
        if (revealedCard.assignedPlayers.includes(player.name)) {
          return { ...player, points: player.points + revealedCard.points };
        }
        return player;
      });
      setPlayers(updatedPlayers);

      const newCompletedCards = { ...completedCards };
      newCompletedCards[selectedSector].quests.push(revealedCard.index);
      setCompletedCards(newCompletedCards);

      successSound.play(); // Přidání zvuku úspěchu

      if (points + revealedCard.points >= MAX_POINTS) {
        setShowEnding(true);
      }
    }
    setRevealedCard(null);
  };

  const handleCompleteEventCard = (isCompleted) => {
    if (isCompleted && revealedEventCard) {
      const requiredPoints = revealedEventCard.points;
      if (points >= requiredPoints) {
        // Logika pro splnění Event karty a postup do dalšího sektoru
        setAlert(`Event card for sector ${selectedSector} has been completed. Moving to next sector.`);
        whooshSound.play();
        successSound.play(); // Přidání zvuku úspěchu
        const nextSectorIndex = (SECTORS.indexOf(selectedSector) + 1) % SECTORS.length;
        const nextSector = SECTORS[nextSectorIndex];
        setSelectedSector(nextSector);
        setRevealedEventCard(null);
      } else {
        setAlert(`Not enough points to complete the event card. Required: ${requiredPoints}, Current: ${points}`);
      }
    }
  };

  const handleTogglePlayer = (playerName) => {
    setRevealedCard(prevCard => {
      const isAssigned = prevCard.assignedPlayers && prevCard.assignedPlayers.includes(playerName);
      return {
        ...prevCard,
        assignedPlayers: isAssigned
          ? prevCard.assignedPlayers.filter(name => name !== playerName)
          : prevCard.assignedPlayers
          ? [...prevCard.assignedPlayers, playerName]
          : [playerName]
      };
    });
  };

  const handleSectorChange = (sector) => {
    setSelectedSector(sector);
    setAlert(null);
    setRevealedEventCard(null); // Skryje event kartu při změně sektoru
    setRevealedCard(null); // Skryje quest kartu při změně sektoru

    // Kontrola, zda má nový sektor dostupné quest karty
    const sectorCards = cards[sector]?.quests || [];
    const completedSectorCards = completedCards[sector]?.quests || [];
    if (sectorCards.length === completedSectorCards.length) {
      setAlert(`No more quest cards available for sector ${sector}. Moving to the next sector.`);
      setTimeout(() => {
        const nextSectorIndex = (SECTORS.indexOf(sector) + 1) % SECTORS.length;
        const nextSector = SECTORS[nextSectorIndex];
        handleSectorChange(nextSector);
      }, 2000);
    }
  };

  const handleSaveGame = () => {
    const gameState = {
      points,
      revealedCard,
      revealedEventCard,
      selectedSector,
      cards,
      completedCards,
      players,
    };
    localStorage.setItem('fairQuestGameState', JSON.stringify(gameState));
    alert('Game has been saved!');
  };

  const handleLoadGame = () => {
    const savedGame = localStorage.getItem('fairQuestGameState');
    if (savedGame) {
      const {
        points,
        revealedCard,
        revealedEventCard,
        selectedSector,
        cards,
        completedCards,
        players,
      } = JSON.parse(savedGame);
      setPoints(points);
      setRevealedCard(revealedCard);
      setRevealedEventCard(revealedEventCard);
      setSelectedSector(selectedSector);
      setCards(cards);
      setCompletedCards(completedCards);
      setPlayers(players);
      alert('Game has been loaded!');
    } else {
      alert('No saved game found.');
    }
  };

  const tutorialSteps = [
    { element: '.Players', text: 'Here are the players and their points.' },
    { element: '.sector-button', text: 'Select the current sector here.' },
    { element: '.Timer', text: 'Set the timer for the game.' },
    { element: '.event-button', text: 'Reveal an Event Card here.' },
    { element: '.quest-button', text: 'Reveal a Quest Card here.' },
    { element: '.ProgressBar', text: 'This is the progress bar showing your points.' },
    { element: '.total-points', text: 'These are the total points collected.' },
    { element: '.save-button', text: 'Save your game progress.' },
    { element: '.load-button', text: 'Load your saved game.' },
    { element: '.download-button', text: 'Download game materials here.' },
  ];

  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const getTutorialStepStyle = (element) => {
    const targetElement = document.querySelector(element);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX + (element === '.Timer' ? rect.width / 4 : 0), // Adjust for Timer
        width: rect.width,
      };
    }
    return {};
  };

  return (
    <Container>
      <div className="Players">
        <span className="points-label">Your Current Points:</span>
        {players.map(player => (
          <Player key={player.name} name={player.name} points={player.points} />
        ))}
      </div>
      <Row className="mb-3">
        <Col>
          <DropdownButton
            id="dropdown-basic-button"
            title={`Current Sector: ${selectedSector}`}
            variant="dark"
            onSelect={handleSectorChange}
            className="fade-in sector-button"
          >
            {SECTORS.map(sector => (
              <Dropdown.Item key={sector} eventKey={sector}>
                {sector}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
        <Col className="text-center">
          <Timer />
        </Col>
      </Row>
      {alert && <Alert variant="warning">{alert}</Alert>}
      <Row>
        <Col xs={12} md={6}>
          <div className="EventCards">
            <Button variant="dark" className="event-button" onClick={handleRevealEventCard}>Reveal Event Card</Button>
            {revealedEventCard && (
              <EventCard
                title={revealedEventCard.title}
                description={revealedEventCard.description}
                points={revealedEventCard.points}
                onComplete={handleCompleteEventCard}
                className="card-flip"
              />
            )}
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="QuestCards">
            <Button variant="dark" className="quest-button" onClick={handleRevealQuestCard}>Reveal Quest Card</Button>
            {revealedCard && (
              <TaskCard
                title={revealedCard.title}
                description={revealedCard.description}
                points={revealedCard.points}
                assignedPlayers={revealedCard.assignedPlayers}
                onTogglePlayer={handleTogglePlayer}
                onComplete={handleCompleteCard}
                className="card-flip"
              />
            )}
          </div>
        </Col>
      </Row>
      <CustomProgressBar points={points} maxPoints={MAX_POINTS} />
      <div className="total-points">Total Points: {points}/{MAX_POINTS}</div>

      <Row className="mt-3">
        <Col className="text-left">
          <Button variant="secondary" className="save-button" onClick={handleSaveGame}>Save Game</Button>
          <Button variant="secondary" className="load-button" onClick={handleLoadGame}>Load Game</Button>
          <Button variant="secondary" className="tutorial-button" onClick={startTutorial}>Tutorial</Button>
        </Col>
        <Col className="text-right">
          <Button variant="secondary" className="download-button" href="path_to_your_pdf.pdf" download>Download Game Materials</Button>
        </Col>
      </Row>

      <Modal show={showEnding} onHide={() => setShowEnding(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            The four heroes united, embarked on an epic adventure, and ultimately defeated Close. After a legendary battle, where they utilized all their skills, they return to King Datus Managus Planus, restoring the land to its former glory, beautiful, organized, and open to all.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEnding(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-step" style={getTutorialStepStyle(tutorialSteps[tutorialStep].element)}>
            <p>{tutorialSteps[tutorialStep].text}</p>
            <Button variant="secondary" onClick={nextTutorialStep}>Next</Button>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Board;
