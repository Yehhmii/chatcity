import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../../api';
import './chatSection.css';

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling']
}); // adjust if needed

const ChatComponent: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Load existing messages for this conversation
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/conversations/${conversationId}/messages`);
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    if (conversationId) {
      fetchMessages();
      socket.emit('joinConversation', conversationId);
    }

    // Listen for new messages
    socket.on('newMessage', (message: Message) => {
      if (message && message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      if (conversationId) {
        socket.emit('leaveConversation', conversationId);
      }
      socket.off('newMessage');
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !conversationId) return;
    const messageData = {
      conversationId,
      sender: localStorage.getItem('userId'), // assuming you store userId in localStorage
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    // Emit to Socket.IO
    socket.emit('send_message', messageData);
    // Update UI immediately
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <div className="chat-component">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === localStorage.getItem('userId') ? 'own' : ''}`}>
            <span className="message-content">{msg.content}</span>
            <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
