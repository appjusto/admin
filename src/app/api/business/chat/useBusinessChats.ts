import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ChatMessage, Flavor, Order, WithId } from 'appjusto-types';
import React from 'react';

export interface OrderChatGroup {
  orderId: string;
  orderCode?: string;
  lastUpdate?: firebase.firestore.FieldValue;
  counterParts: [
    {
      id: string;
      flavor: Flavor;
      updatedOn: firebase.firestore.FieldValue;
      name?: string;
      notReadMessages?: string[];
    }
  ];
}

export interface BusinessChatMessage extends ChatMessage {
  orderId: string;
}

export const useBusinessChats = (orders: WithId<Order>[]) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();

  // state
  const [messagesAsFrom, setMessagesAsFrom] = React.useState<WithId<BusinessChatMessage>[]>([]);
  const [messagesAsTo, setMessagesAsTo] = React.useState<WithId<BusinessChatMessage>[]>([]);
  const [orderChatGroup, setOrderChatGroup] = React.useState<OrderChatGroup[]>([]);

  // handlers;
  const obserBusinessMessages = React.useCallback(() => {
    if (!orders || !businessId) return;
    orders.forEach((order) => {
      api.business().observeBusinessChatMessageAsFrom(order.id, businessId, setMessagesAsFrom);
      api.business().observeBusinessChatMessageAsTo(order.id, businessId, setMessagesAsTo);
    });
  }, [api, orders, businessId]);

  const createOrderChatGroup = React.useCallback(() => {
    const allMessages = [...messagesAsFrom, ...messagesAsTo];
    const result = allMessages.reduce<OrderChatGroup[]>((groups, message) => {
      const existingGroup = groups.find((group) => group.orderId === message.orderId);
      const counterPartId = businessId === message.from.id ? message.to.id : message.from.id;
      const counterPartFlavor =
        counterPartId === message.from.id ? message.from.agent : message.to.agent;
      //console.log(message.timestamp);
      const isNotRead = message.from.id !== businessId && !message.read;
      const counterPartObject = {
        id: counterPartId,
        flavor: counterPartFlavor,
        updatedOn: message.timestamp,
        notReadMessages: isNotRead ? [message.id] : [],
      };
      if (existingGroup) {
        const existingCounterpart = existingGroup.counterParts.find(
          (part) => part.id === counterPartId
        );
        if (existingCounterpart) {
          if (isNotRead) existingCounterpart.notReadMessages?.push(message.id);
          else
            existingCounterpart.notReadMessages = existingCounterpart.notReadMessages?.filter(
              (msg) => msg !== message.id
            );
          return groups;
        }
        existingGroup.counterParts.push(counterPartObject);
        return groups;
      }
      return [
        {
          orderId: message.orderId,
          notReadMessages: isNotRead ? [message.id] : [],
          counterParts: [counterPartObject],
        },
        ...groups,
      ];
    }, []);
    setOrderChatGroup(result);
  }, [messagesAsFrom, messagesAsTo, businessId]);

  // side effects
  React.useEffect(() => {
    if (!orders || !businessId) return;
    obserBusinessMessages();
  }, [orders, businessId, obserBusinessMessages]);

  React.useEffect(() => {
    createOrderChatGroup();
  }, [createOrderChatGroup]);

  // return
  return orderChatGroup;
};
