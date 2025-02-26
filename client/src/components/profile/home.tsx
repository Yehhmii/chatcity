import React, {useState} from 'react';
import './home.css';
import LeftNavigation from './leftnavigation';
import ChatsScreen from '../screens/chatScreen';
import LeaderboardScreen from '../screens/leaderboardScreen';
import IncognitoScreen from '../screens/incognitoScreen';
import MotivationScreen from '../screens/motivationScreen';
import ProfileScreen from '../screens/profileScreen';
import SettingsScreen from '../screens/settingsScreen';
import ChatSection from '../screens/chatSection';
import FriendRequest from '../screens/friendRequest';


const Home: React.FC = () => {

    // This state will track which screen to display in the middle section
  const [activeScreen, setActiveScreen] = useState<string>('Chats');

  // Render the appropriate component based on activeScreen
  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Chats':
        return <ChatsScreen />;
      case 'FriendRequest':
        return <FriendRequest />;
      case 'Leaderboard':
        return <LeaderboardScreen />;
      case 'Incognito':
        return <IncognitoScreen />;
      case 'Motivation':
        return <MotivationScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Settings':
        return <SettingsScreen />;
      default:
        return <div>Welcome to the App</div>;
    }
  };

  return (
    <div className="containerBorders">
      <div className="gridContainer">
        {/* Left Navigation Panel */}
        <LeftNavigation onIconClick={setActiveScreen} activeScreen={activeScreen}/>

        {/* Middle Section (Displays clicked item) */}
        <div className="itemDisplay">
            {renderActiveScreen()}
        </div>

        {/* Right Section (Chats) */}
        <div className="chats">
          <ChatSection />
        </div>
      </div>
    </div>
  );
};

export default Home;
