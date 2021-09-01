import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ChatMessage, Order, WithId } from 'appjusto-types';
import React from 'react';
import { OrderChatGroup } from 'app/api/chat/types';

export interface BusinessChatMessage extends ChatMessage {
  orderId: string;
}

export const useBusinessChats = (
  activeOrders: WithId<Order>[],
  completedAndActiveOrders: WithId<Order>[]
) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  // state
  const [messagesAsFrom, setMessagesAsFrom] = React.useState<WithId<BusinessChatMessage>[]>([]);
  const [messagesAsTo, setMessagesAsTo] = React.useState<WithId<BusinessChatMessage>[]>([]);
  const [orderChatGroup, setOrderChatGroup] = React.useState<OrderChatGroup[]>([]);
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    const totalActiveOrders = activeOrders.concat(completedAndActiveOrders);
    const totalActiveOrdersIds = totalActiveOrders.map((order) => order.id);
    console.log('AcOrIds', totalActiveOrdersIds);
    if (totalActiveOrders.length === 0) {
      setOrderChatGroup([]);
      return;
    }
    totalActiveOrders.forEach((order) => {
      api
        .business()
        .observeBusinessChatMessageAsFrom(
          totalActiveOrdersIds,
          order.id,
          businessId,
          setMessagesAsFrom
        );
      api
        .business()
        .observeBusinessChatMessageAsTo(
          totalActiveOrdersIds,
          order.id,
          businessId,
          setMessagesAsTo
        );
    });
  }, [api, businessId, activeOrders, completedAndActiveOrders]);
  React.useEffect(() => {
    if (!businessId) return;
    const allMessages = messagesAsFrom.concat(messagesAsTo);
    console.log('allMessages', allMessages.length);
    const result = allMessages.reduce<OrderChatGroup[]>((groups, message) => {
      const existingGroup = groups.find((group) => group.orderId === message.orderId);
      const counterPartId = businessId === message.from.id ? message.to.id : message.from.id;
      const counterPartFlavor =
        counterPartId === message.from.id ? message.from.agent : message.to.agent;
      const isUnread = message.from.id !== businessId && !message.read;
      //console.log('isUnread', isUnread);
      const counterPartObject = {
        id: counterPartId,
        flavor: counterPartFlavor,
        updatedOn: message.timestamp,
        unreadMessages: isUnread ? [message.id] : [],
      };
      if (existingGroup) {
        const existingCounterpart = existingGroup.counterParts.find(
          (part) => part.id === counterPartId
        );
        if (existingCounterpart) {
          if (
            isUnread &&
            (!existingCounterpart.unreadMessages ||
              !existingCounterpart.unreadMessages?.includes(message.id))
          ) {
            existingCounterpart.unreadMessages
              ? existingCounterpart.unreadMessages.push(message.id)
              : (existingCounterpart.unreadMessages = [message.id]);
          } else {
            existingCounterpart.unreadMessages = existingCounterpart.unreadMessages?.filter(
              (msg) => msg !== message.id
            );
          }
          if (existingCounterpart.updatedOn < message.timestamp) {
            existingCounterpart.updatedOn = message.timestamp;
          }
          /*let unreadeList = groups
            .map((group) => {
              let list = group.counterParts.reduce<string[]>((list, part) => {
                if (part.unreadMessages) return list.concat(part.unreadMessages);
                else return list;
              }, []);
              return list;
            })
            .join(',');
          console.log('G_unreadMessages', unreadeList);*/
          return groups;
        }
        existingGroup.counterParts.push(counterPartObject);
        return groups;
      }
      return [
        {
          orderId: message.orderId,
          lastUpdate: message.timestamp,
          counterParts: [counterPartObject],
        },
        ...groups,
      ];
    }, []);
    setOrderChatGroup(result);
  }, [messagesAsFrom, messagesAsTo, businessId]);
  // return
  return orderChatGroup;
};
