import React, { useState } from 'react';
import './loginCard.css';
import api from '../../api';

interface SignupCardProps {
  onClose: () => void;
  onSignupSuccess: (data: any) => void;
}

const SignupCard: React.FC<SignupCardProps> = ({ onClose, onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/register', { username, email, password });
      onSignupSuccess(response.data); // Trigger callback on successful signup
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Signup Failed');
    }
  };

  return (
    <div className="signup-card">
      <div className="login-card-header">
        <h2>Signup</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-btn">Signup</button>
      </form>
    </div>
  );
};

export default SignupCard;
