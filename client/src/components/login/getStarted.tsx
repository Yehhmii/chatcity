import React, { useState, useEffect } from 'react';
import './getStarted.css';
import {  useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../api';
import TypingEffect from './typingEffect';
import LoginCard from './loginCard';
import SignupCard from './signUpCard';
import text from '../../images/Messaging-pana.png';
import textppl from '../../images/textppl.jpg';
import textreply from '../../images/text-reply.png';
import texting from '../../images/Texting-bro.png';
import logo from '../../images/logo.png';
import logo1 from '../../images/logo1.png';

const GetStarted: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const messages = [
    'Welcome to ChatCity!',
    'Connect with your friends instantly.',
    'Enjoy secure and private conversations.',
  ];

  // cardType can be 'login', 'signup', 'success', or null
  const [cardType, setCardType] = useState<'login' | 'signup' | 'success' | null>(null);
  const navigate = useNavigate();   

  const handleCardOpen = (type: 'login' | 'signup') => {
    setCardType(type);
  };

  const handleCardClose = () => {
    setCardType(null);
  };

  // Called when signup is successful.
  const handleSignupSuccess = () => {
    setCardType('success');

    setTimeout(() => {
      setCardType('login');
    }, 3000);
  };

  // handles login successful and stores token
  const handleLoginSuccess = (data: any) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user._id);
    setAuthToken(data.token);
    navigate('/roadmap');
  }

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.matchMedia('(max-width: 480px)').matches);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="getStartedContainer">
      <div className="clipside">
        <div className="clipesideImg">
          <div className="rectangledummy">
            <img src={textppl} alt="" />
          </div>
          <div className="buttomdummy">
            <div><img src={text} alt="" /></div>
            <div><img src={textreply} alt="" /></div>
            <div><img src={texting} alt="" /></div>
          </div>
        </div>
        <div className="textCardcon">
          <div>
            <img src={isSmallScreen ? logo1 : logo} alt="Responsive Logo" />
          </div>
          <div className="typingDiv">
            <TypingEffect messages={messages} />
          </div>
        </div>
      </div>
      <div className="loginDiv">
        {!cardType && (
          <button className="get-started-btn" onClick={() => handleCardOpen('login')}>
            Get Started
          </button>
        )}
        {cardType === 'login' && (
          <div className="card-wrapper">
            <LoginCard
              onClose={handleCardClose}
              onSignup={() => handleCardOpen('signup')}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        )}
        {cardType === 'signup' && (
          <div className="card-wrapper">
            <SignupCard onClose={handleCardClose} onSignupSuccess={handleSignupSuccess} />
          </div>
        )}
        {cardType === 'success' && (
          <div className="card-wrapper">
            <div className="signup-success-card">
              <h2>Sign up successful!</h2>
              <p>You will be redirected shortly...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStarted;
