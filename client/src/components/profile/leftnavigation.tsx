import React from 'react';
import './leftnavigation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faComment, faLightbulb, faTrophy, faUser, faUserSecret } from '@fortawesome/free-solid-svg-icons';

interface LeftNavigationProps {
  onIconClick: (iconName: string) => void;
  activeScreen: string;
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ onIconClick, activeScreen }) => {
  return (
    <div className="navItems">
      <div className="top-icons">
        <div
          className={`icon-container ${activeScreen === 'Chats' ? 'active' : ''}`}
          onClick={() => onIconClick('Chats')}
        >
          <FontAwesomeIcon icon={faComment} className="nav-icon" />
          <span className="tooltip">Chats</span>
        </div>
        <div
          className={`icon-container ${activeScreen === 'FriendRequest' ? 'active' : ''}`}
          onClick={() => onIconClick('FriendRequest')}
        >
          <FontAwesomeIcon icon={faComment} className="nav-icon" />
          <span className="tooltip">FriendRequest</span>
        </div>
        <div
          className={`icon-container ${activeScreen === 'Leaderboard' ? 'active' : ''}`}
          onClick={() => onIconClick('Leaderboard')}
        >
          <FontAwesomeIcon icon={faTrophy} className="nav-icon" />
          <span className="tooltip">Leaderboard</span>
        </div>
        <div
          className={`icon-container ${activeScreen === 'Incognito' ? 'active' : ''}`}
          onClick={() => onIconClick('Incognito')}
        >
          <FontAwesomeIcon icon={faUserSecret} className="nav-icon" />
          <span className="tooltip">Incognito</span>
        </div>
        <div
          className={`icon-container ${activeScreen === 'Motivation' ? 'active' : ''}`}
          onClick={() => onIconClick('Motivation')}
        >
          <FontAwesomeIcon icon={faLightbulb} className="nav-icon" />
          <span className="tooltip">Motivation</span>
        </div>
      </div>
      <div className="bottom-icons">
        <div
          className={`icon-container ${activeScreen === 'Profile' ? 'active' : ''}`}
          onClick={() => onIconClick('Profile')}
        >
          <FontAwesomeIcon icon={faUser} className="nav-icon" />
          <span className="tooltip">Profile</span>
        </div>
        <div
          className={`icon-container ${activeScreen === 'Settings' ? 'active' : ''}`}
          onClick={() => onIconClick('Settings')}
        >
          <FontAwesomeIcon icon={faCog} className="nav-icon" />
          <span className="tooltip">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default LeftNavigation;
