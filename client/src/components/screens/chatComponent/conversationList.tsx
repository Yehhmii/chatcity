import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { useNavigate } from 'react-router-dom';
import './conversationList.css';

interface Conversation {
  _id: string;
  participants: Array<{ _id: string; username: string; avatar?: string }>;
  updatedAt: string;
}

const ConversationList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/conversations'); // endpoint to get conversations for current user
        setConversations(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error fetching conversations.');
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="conversation-list">
      <h2>Your Conversations</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {conversations.map((conv) => (
          <li key={conv._id} onClick={() => navigate(`/chat/${conv._id}`)}>
            <div className="conversation-info">
              {/* Display friend names (assuming two participants) */}
              <span>
                {conv.participants
                  .filter(p => p._id !== localStorage.getItem('userId'))
                  .map(p => p.username)
                  .join(', ')}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
