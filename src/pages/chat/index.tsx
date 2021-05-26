import { OrdersContextProvider } from 'pages/orders/context';
import React from 'react';
import { Chat } from './Chat';

const ChatPage = () => {
  // UI
  return (
    <OrdersContextProvider>
      <Chat />
    </OrdersContextProvider>
  );
};

export default ChatPage;
