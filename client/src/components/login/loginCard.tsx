import React, { useState } from 'react';
import './loginCard.css';
import api, { setAuthToken } from '../../api';

interface LoginCardProps {
  onClose: () => void;
  onSignup: () => void;
  onLoginSuccess: (data: any) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ onClose, onSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      // Store the token
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
      onLoginSuccess(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login Failed');
    }
  };

  return (
    <div className="login-card">
      <div className="login-card-header">
        <h2>Login</h2>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="login-btn">
          Login
        </button>
        <div className='noAccount'>
          <p>
            Don't have an account?{' '}
            <button type="button" className="link-btn" onClick={onSignup}>
              Signup
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;
