import { ChatMessage, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { OrderChatTypeGroup } from './types';
import { getOrderChatTypeGroup } from './utils';

export const useObserveOrderChatMessages = (
  orderId?: string,
  limit?: number,
  isDisabled?: boolean
) => {
  // context
  const api = useContextApi();
  // state
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>(
    []
  );
  const [orderChatGroup, setOrderChatGroup] = React.useState<
    OrderChatTypeGroup[]
  >([]);
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    if (isDisabled) return;
    const unsub = api
      .chat()
      .observeOrderChatMessages(
        { orderId, queryLimit: limit },
        setChatMessages
      );
    return () => unsub();
  }, [api, orderId, limit, isDisabled]);
  React.useEffect(() => {
    if (!chatMessages) return;
    setOrderChatGroup(getOrderChatTypeGroup(chatMessages));
  }, [chatMessages]);
  // return
  return { chatMessages, orderChatGroup };
};
