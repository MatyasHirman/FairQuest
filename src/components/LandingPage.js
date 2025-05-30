import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [formData, setFormData] = useState({
    teamName: '',
    player1: '',
    player2: '',
    player3: '',
    player4: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      // Only allow numbers and limit to 4 digits
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 4);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    // Validate all fields are filled
    if (Object.values(formData).some(value => !value)) {
      console.log('Validation failed: empty fields');
      setError('Please fill in all fields');
      return;
    }

    // Validate password is 4 digits
    if (formData.password.length !== 4) {
      console.log('Validation failed: password length');
      setError('Password must be 4 digits');
      return;
    }

    console.log('Dispatching SET_TEAM_INFO action');
    // Update game state with team info
    dispatch({
      type: 'SET_TEAM_INFO',
      payload: {
        teamName: formData.teamName,
        players: [
          { id: 1, name: formData.player1 },
          { id: 2, name: formData.player2 },
          { id: 3, name: formData.player3 },
          { id: 4, name: formData.player4 }
        ],
        password: formData.password
      }
    });

    console.log('Navigating to /game');
    // Navigate to game board
    navigate('/game');
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo" onClick={() => window.location.reload()}>
          <h1>FAIRQuest</h1>
        </div>
        <Button 
          variant="dark" 
          className="materials-btn"
          href={`${process.env.PUBLIC_URL}/game-materials.pdf`}
          download
        >
          Materials
        </Button>
      </nav>

      <Container className="form-container">
        <Form onSubmit={handleSubmit} className="registration-form">
          <Form.Group className="mb-4">
            <Form.Label>Team name</Form.Label>
            <Form.Control
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleInputChange}
              placeholder="Enter team name"
            />
          </Form.Group>

          <div className="players-grid">
            {[1, 2, 3, 4].map(num => (
              <Form.Group key={num} className="mb-3">
                <Form.Label>Player {num}</Form.Label>
                <Form.Control
                  type="text"
                  name={`player${num}`}
                  value={formData[`player${num}`]}
                  onChange={handleInputChange}
                  placeholder={`Enter player ${num} nickname`}
                />
              </Form.Group>
            ))}
          </div>

          <Form.Group className="mb-4">
            <Form.Label>Password (4 digits)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter 4-digit password"
              maxLength={4}
            />
          </Form.Group>

          {error && <div className="error-message">{error}</div>}

          <Button variant="primary" type="submit" className="submit-btn">
            Enter FAIRQuest
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default LandingPage; 