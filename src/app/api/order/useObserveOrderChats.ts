import { useContextApi } from 'app/state/api/context';
import { ChatMessage } from 'appjusto-types';
import React from 'react';

export const useObserveOrderChats = (orderId: string) => {
  // context
  const api = useContextApi();
  // state
  const [messages, setMessages] = React.useState<ChatMessage[]>();
  // side effects
  React.useEffect(() => {
    const unsub = api.order().observeOrderChats(orderId, setMessages);
    return () => unsub();
  }, [api, orderId]);
  // result
  return messages;
};
