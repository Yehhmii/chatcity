import React, { useState, useEffect } from 'react';
import api from '../../../api';
import './searchComponent.css';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  friendStatus: 'none' | 'waiting' | 'friends';
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Debounce search: Tiggers search 500ms after user stops typing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const delayBounceFn = setTimeout(() => {
      const fetchData = async () => {
        try {
          const response = await api.get(`/friend-request/search?query=${query}`);
          setResults(response.data);
          setError('');
        } catch (err: any) {
          setError(err.response?.data?.error || 'Error searching users.');
        }
      };
      fetchData();
    }, 500);
    return () => clearTimeout(delayBounceFn);
  }, [query]);

  const handleSendFriendRequest = async (receiverId: string) => {
    try {
      await api.post('/friend-request', { receiverId });
      setSuccessMessage('Friend request sent!');
      // Update friend status locally to "waiting"
      setResults((prevResults) =>
        prevResults.map((user) =>
          user._id === receiverId ? { ...user, friendStatus: 'waiting' } : user
        )
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Failed to send friend request.');
    }
  };

  return (
    <div className="search-component">
      <div className='form'>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      {query && results.length === 0 && !error && (
        <p className="no-results">No such user exists.</p>
      )}
      {successMessage && <div className="toast">{successMessage}</div>}
      <ul>
        {results.map((user) => (
          <li key={user._id}>
            <div className="user-info">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className="placeholder-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{user.username}</span> {/* (<span>{user.email}</span>) */}
            </div>
            <button
              onClick={() => handleSendFriendRequest(user._id)}
              disabled={user.friendStatus === 'waiting' || user.friendStatus === 'friends'}
            >
              {user.friendStatus === 'waiting'
                ? 'Waiting'
                : user.friendStatus === 'friends'
                ? 'Friends'
                : 'Send Request'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
