import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './Tutorial.css';

const tutorialSteps = [
  {
    target: '.sectors-sidebar',
    content: 'Here you can find all stages of the game and switch between them.',
    position: 'right'
  },
  {
    target: '.points-display',
    content: 'This shows your current points and how many points you need to complete the current event.',
    position: 'bottom'
  },
  {
    target: '.card-area:first-child',
    content: 'Event cards show what you need to accomplish in the current stage.',
    position: 'left'
  },
  {
    target: '.card-area:last-child',
    content: 'Quest cards help you earn points to complete the event.',
    position: 'left'
  },
  {
    target: '.timer-section',
    content: 'Keep track of your time and save/load your game progress here.',
    position: 'top'
  }
];

const Tutorial = ({ currentStep, onNextStep, onClose }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const updatePosition = () => {
      if (currentStep >= tutorialSteps.length) return;

      const step = tutorialSteps[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const pos = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        };
        setPosition(pos);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep]);

  if (currentStep >= tutorialSteps.length || !position) {
    return null;
  }

  const step = tutorialSteps[currentStep];
  
  // Calculate tooltip position
  let tooltipStyle = {};
  const margin = 20;
  const tooltipWidth = 300;
  const tooltipHeight = 120;
  
  const calculatePosition = () => {
    switch (step.position) {
      case 'right':
        // Check if tooltip would overflow right edge
        if (position.left + position.width + margin + tooltipWidth > window.innerWidth) {
          return {
            right: window.innerWidth - position.left + margin,
            top: position.top + (position.height / 2),
            position: 'left' // Switch to left position
          };
        }
        return {
          left: position.left + position.width + margin,
          top: position.top + (position.height / 2)
        };
      
      case 'left':
        // Check if tooltip would overflow left edge
        if (position.left - margin - tooltipWidth < 0) {
          return {
            left: position.left + position.width + margin,
            top: position.top + (position.height / 2),
            position: 'right' // Switch to right position
          };
        }
        return {
          right: window.innerWidth - position.left + margin,
          top: position.top + (position.height / 2)
        };
      
      case 'bottom':
        // Check if tooltip would overflow bottom edge
        if (position.top + position.height + margin + tooltipHeight > window.innerHeight) {
          return {
            left: position.left + (position.width / 2),
            bottom: window.innerHeight - position.top + margin,
            position: 'top' // Switch to top position
          };
        }
        return {
          left: position.left + (position.width / 2),
          top: position.top + position.height + margin
        };
      
      case 'top':
        // Check if tooltip would overflow top edge
        if (position.top - margin - tooltipHeight < 0) {
          return {
            left: position.left + (position.width / 2),
            top: position.top + position.height + margin,
            position: 'bottom' // Switch to bottom position
          };
        }
        return {
          left: position.left + (position.width / 2),
          bottom: window.innerHeight - position.top + margin
        };
      
      default:
        return {
          left: position.left + position.width + margin,
          top: position.top + (position.height / 2)
        };
    }
  };

  const positionData = calculatePosition();
  tooltipStyle = positionData;
  const tooltipPosition = positionData.position || step.position;

  // Highlight style
  const highlightStyle = {
    left: position.left - 5,
    top: position.top - 5,
    width: position.width + 10,
    height: position.height + 10
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-highlight" style={highlightStyle}>
        <div 
          className={`tutorial-tooltip ${tooltipPosition}`}
          style={tooltipStyle}
        >
          <p>{step.content}</p>
          <div className="tutorial-actions">
            <Button 
              variant="light" 
              size="sm" 
              onClick={onNextStep}
            >
              {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
            <Button 
              variant="link" 
              size="sm" 
              onClick={onClose}
            >
              Skip Tutorial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial; 