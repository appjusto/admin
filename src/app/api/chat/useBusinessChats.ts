import { ChatMessage, WithId } from '@appjusto/types';
import { OrderChatGroup } from 'app/api/chat/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { getOrderChatGroup } from './utils';

export const useBusinessChats = (businessId?: string) => {
  // context
  const api = useContextApi();
  // state
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>(
    []
  );
  const [orderChatGroup, setOrderChatGroup] = React.useState<OrderChatGroup[]>(
    []
  );
  React.useEffect(() => {
    if (!businessId) return;
    const unsub = api
      .chat()
      .observeBusinessActiveChatMessages(businessId, setChatMessages);
    return () => unsub();
  }, [api, businessId]);
  React.useEffect(() => {
    if (!businessId) return;
    const result = getOrderChatGroup(businessId, chatMessages);
    setOrderChatGroup(result);
  }, [businessId, chatMessages]);
  // return
  return orderChatGroup;
};
