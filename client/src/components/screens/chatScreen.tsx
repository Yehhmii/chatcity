import React from 'react';
import SearchCompoenent from './chatComponent/searchComponent';
import ConversationList from './chatComponent/conversationList';

const ChatsScreen: React.FC = () => {
  return (
    <div>
      <h2>Chats</h2>
      <SearchCompoenent />
      <ConversationList />
    </div>
  );
};

export default ChatsScreen;
