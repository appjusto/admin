import { useContextApi } from 'app/state/api/context';
import { ChatMessage, WithId } from 'appjusto-types';
import React from 'react';

export const useObserveOrderChatMessages = (orderId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>([]);
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.chat().observeOrderChatMessages(orderId, setChatMessages);
    return () => unsub();
  }, [api, orderId]);
  // return
  return chatMessages;
};
