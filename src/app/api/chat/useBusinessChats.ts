import { ChatMessage, WithId } from '@appjusto/types';
import { OrderChatGroup } from 'app/api/chat/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { getOrderChatGroup } from './utils';

export const useBusinessChats = (
  businessId?: string,
  isChatActive?: boolean
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('chats');
  // state
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>(
    []
  );
  const [orderChatGroup, setOrderChatGroup] = React.useState<OrderChatGroup[]>(
    []
  );
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!isChatActive) return;
    const unsub = api
      .chat()
      .observeBusinessActiveChatMessages(businessId, setChatMessages);
    return () => unsub();
  }, [api, userCanRead, businessId, isChatActive]);
  React.useEffect(() => {
    if (!businessId) return;
    const result = getOrderChatGroup(businessId, chatMessages);
    setOrderChatGroup(result);
  }, [businessId, chatMessages]);
  // return
  return orderChatGroup;
};
