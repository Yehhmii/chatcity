import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Roadmap.css';
import roadmapBg from '../../images/roadmap.jpg';
import sideImage from '../../images/sidelogo.png';
import logo from '../../images/logoicon.png';

const Roadmap: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);

  useEffect(() => {
    // Function to update the screen size state
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="roadmap-container">
      {/* Conditionally render the side image */}
      {!isSmallScreen && (
        <div className="side-image">
          <img src={sideImage} alt="Side Graphic" />
        </div>
      )}

      {/* Roadmap Background */}
      <div className="roadmap-content" style={{ backgroundImage: `url(${roadmapBg})` }}>
        <div className="link-wrapper">
          {/* Application Logo for small screens */}
          {isSmallScreen && (
            <div className="game-logo">
              <img src={logo} alt="App Logo" />
            </div>
          )}

          {/* Game-like links */}
          <Link to="/chats" className="game-link" style={{ top: '10%', left: '20%' }}>
            Chats
          </Link>
          <Link to="/motivation" className="game-link" style={{ top: '40%', left: '50%' }}>
            Motivation
          </Link>
          <Link
            to="/profile"
            className="game-link"
            style={isSmallScreen ? { top: '60%', left: '17%' } : { top: '70%', left: '30%' }}
          >
            Profile
          </Link>
          <Link
            to="/leaderboard"
            className="game-link"
            style={isSmallScreen ? { top: '85%', left: '45%' } : { top: '85%', left: '70%' }}
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
