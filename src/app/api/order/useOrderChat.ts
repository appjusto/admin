import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ChatMessage, Flavor, Order, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useOrderChat = (orderId: string, counterpartId: string) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();

  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [chat, setChat] = React.useState<WithId<ChatMessage>[]>();
  const [names, setNames] = React.useState({});
  const [counterpartFlavor, setCounterpartFlavor] = React.useState<Flavor>();
  const [groupMessages, setGroupMessages] = React.useState<WithId<ChatMessage>[]>([]);

  // handlers;
  const [sendMessage, sendMessageResult] = useMutation(async (data: Partial<ChatMessage>) => {
    if (!businessId) return;
    const from = { agent: 'manager' as Flavor, id: businessId };
    api.order().sendMessage(orderId, {
      from,
      ...data,
    });
  });

  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    api.order().observeOrder(orderId, setOrder);
    api.order().observeOrderChat(orderId, setChat);
  }, [api, orderId]);

  React.useEffect(() => {
    if (!order) return;
    let counterpart = 'N/E';
    if (order.consumer?.id === counterpartId) {
      setCounterpartFlavor('consumer');
      counterpart = order.consumer?.name ?? 'N/E';
    }
    if (order.courier?.id === counterpartId) {
      setCounterpartFlavor('courier');
      counterpart = order.courier?.name ?? 'N/E';
    }
    const namesObject = {
      [businessId!]: order.business?.name ?? 'N/E',
      [counterpartId]: counterpart,
    };
    setNames(namesObject);
  }, [order, counterpartId]);

  React.useEffect(() => {
    if (!chat) return;
    const group = chat.filter((msg) => {
      if (
        (msg.from.id === businessId && msg.to.id === counterpartId) ||
        (msg.to.id === businessId && msg.from.id === counterpartId)
      ) {
        return msg;
      }
      return;
    });
    setGroupMessages(group);
  }, [chat, businessId, counterpartId]);

  // return
  return { names, counterpartFlavor, groupMessages, sendMessage, sendMessageResult };
};
