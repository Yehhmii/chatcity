import React, { useState, useEffect } from 'react';
import api from '../../api';
import './friendRequest.css';

interface FriendRequestUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

const FriendRequests: React.FC = () => {
  const [requests, setRequests] = useState<FriendRequestUser[]>([]);
  const [error, setError] = useState('');

  const fetchFriendRequests = async () => {
    try {
      const response = await api.get('/friend-request/incoming');
      setRequests(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching friend requests:', err);
      setError(err.response?.data?.error || 'Error fetching friend requests.');
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const handleAccept = async (senderId: string) => {
    try {
      await api.post('/friend-request/accept', { senderId });
      setRequests((prev) => prev.filter((user) => user._id !== senderId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error accepting friend request.');
    }
  };

  const handleReject = async (senderId: string) => {
    try {
      await api.post('/friend-request/reject', { senderId });
      setRequests((prev) => prev.filter((user) => user._id !== senderId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error rejecting friend request.');
    }
  };

  return (
    <div className="friend-requests">
      <h2>Incoming Friend Requests</h2>
      {error && <p className="error">{error}</p>}
      {requests.length === 0 && !error ? (
        <p className="no-requests">No new friend requests.</p>
      ) : (
        <ul>
          {requests.map((user) => (
            <li key={user._id}>
              <div className="request-info">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <div className="placeholder-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.username}</span>
              </div>
              <div className="actions">
                <button className="accept-btn" onClick={() => handleAccept(user._id)}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => handleReject(user._id)}>
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
