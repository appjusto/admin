import { useContextApi } from 'app/state/api/context';
import { ChatMessage, WithId } from 'appjusto-types';
import React from 'react';
import { GroupedChatMessages } from 'app/api/chat/types';
import { groupOrderChatMessages, sortMessages } from 'app/api/chat/utils';
import { ChatMessageType } from 'appjusto-types/order/chat';

export const useObserveOrderChatByType = (orderId: string, type: ChatMessageType) => {
  // context
  const api = useContextApi();
  // state
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>([]);
  const [chat, setChat] = React.useState<GroupedChatMessages[]>([]);
  React.useEffect(() => {
    if (!orderId || !type) return;
    const unsub = api.chat().observeOrderChatByType(orderId, type, setChatMessages);
    return () => unsub();
  }, [api, orderId, type]);
  React.useEffect(() => {
    const sorted = chatMessages.sort(sortMessages);
    const groups = groupOrderChatMessages(sorted).reverse();
    setChat(groups);
  }, [chatMessages]);
  // return
  return { chat };
};
