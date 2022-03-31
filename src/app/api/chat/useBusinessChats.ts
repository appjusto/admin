import { ChatMessage, Order, WithId } from '@appjusto/types';
import { OrderChatGroup } from 'app/api/chat/types';
import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { uniq } from 'lodash';
import React from 'react';
import { getOrderChatGroup } from './utils';

export const useBusinessChats = (
  activeOrders: WithId<Order>[],
  completedAndActiveOrders: WithId<Order>[]
) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  // state
  const [totalActiveOrdersIds, setTotalActiveOrdersIds] = React.useState<string[]>([]);
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>([]);
  const [orderChatGroup, setOrderChatGroup] = React.useState<OrderChatGroup[]>([]);
  // side effects
  React.useEffect(() => {
    const activeOrdersIds = [...activeOrders, ...completedAndActiveOrders].map((order) => order.id);
    setTotalActiveOrdersIds(activeOrdersIds);
  }, [activeOrders, completedAndActiveOrders]);
  React.useEffect(() => {
    if (!businessId) return;
    if (totalActiveOrdersIds.length === 0) {
      setOrderChatGroup([]);
      return;
    }
    const unsubsPromise = api
      .chat()
      .observeBusinessActiveChatMessages(
        businessId,
        totalActiveOrdersIds,
        (messages: WithId<ChatMessage>[]) => {
          setChatMessages((prev) => {
            const update = uniq([...prev, ...messages]);
            return update.filter((msg) => totalActiveOrdersIds.includes(msg.orderId));
          });
        }
      );
    return () => {
      unsubsPromise.then((unsubs) => unsubs.forEach((unsub) => unsub()));
    };
  }, [api, businessId, totalActiveOrdersIds]);
  React.useEffect(() => {
    if (!businessId) return;
    const result = getOrderChatGroup(businessId, chatMessages);
    setOrderChatGroup(result);
  }, [businessId, chatMessages]);
  // return
  return orderChatGroup;
};
