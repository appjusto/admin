import { ChatMessage, ChatMessageType, WithId } from '@appjusto/types';
import { FieldValue, Timestamp } from 'firebase/firestore';
import { first } from 'lodash';
import {
  GroupedChatMessages,
  OrderChatGroup,
  OrderChatTypeGroup,
} from './types';

export const timestampToDate = (value: FieldValue) =>
  (value as Timestamp).toDate();

export const sortMessages = (a: ChatMessage, b: ChatMessage) => {
  if (a.timestamp && b.timestamp)
    return (
      timestampToDate(a.timestamp).getTime() -
      timestampToDate(b.timestamp).getTime()
    );
  if (!a.timestamp) return 1;
  else if (!b.timestamp) return -1;
  return 0;
};

// chat page
export const getOrderChatGroup = (
  businessId: string,
  messages: WithId<ChatMessage>[]
) => {
  return messages.reduce<OrderChatGroup[]>((groups, message) => {
    const existingGroup = groups.find(
      (group) => group.orderId === message.orderId
    );
    const counterPartId =
      businessId === message.from.id ? message.to.id : message.from.id;
    const counterPart =
      counterPartId === message.from.id ? message.from : message.to;
    const counterPartFlavor = counterPart.agent;
    const counterPartName = counterPart.name;
    const isUnread = message.from.id !== businessId && !message.read;
    const counterPartObject = {
      id: counterPartId,
      flavor: counterPartFlavor,
      name: counterPartName,
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
          existingCounterpart.unreadMessages =
            existingCounterpart.unreadMessages?.filter(
              (msg) => msg !== message.id
            );
        }
        if (existingCounterpart.updatedOn < message.timestamp) {
          existingCounterpart.updatedOn = message.timestamp;
        }
        return groups;
      }
      if (counterPartFlavor === 'courier') {
        let currentCourierIndex = existingGroup.counterParts.findIndex(
          (part) => part.flavor === 'courier'
        );
        if (currentCourierIndex > -1) {
          existingGroup.counterParts[currentCourierIndex] = counterPartObject;
          return groups;
        }
      }
      existingGroup.counterParts.push(counterPartObject);
      return groups;
    }
    return [
      {
        orderId: message.orderId,
        orderCode: message.orderCode,
        lastUpdate: message.timestamp,
        counterParts: [counterPartObject],
      },
      ...groups,
    ];
  }, []);
};

export const getOrderChatTypeGroup = (messages: WithId<ChatMessage>[]) => {
  return messages.reduce<OrderChatTypeGroup[]>((groups, message) => {
    let currentGroup = groups.find((group) => group.type === message.type);
    if (currentGroup) {
      if (
        !currentGroup?.lastUpdate ||
        currentGroup.lastUpdate < message.timestamp
      ) {
        currentGroup.lastUpdate = message.timestamp;
      }
      if (!message.read) currentGroup.unreadMessages = true;
      return groups;
    } else {
      currentGroup = {
        orderId: message.orderId,
        type: message.type,
        participantsIds: message.participantsIds,
        lastUpdate: message.timestamp,
        unreadMessages: message.read ? !message.read : true,
      };
      return [...groups, currentGroup];
    }
  }, []);
};

export const groupOrderChatMessages = (messages: WithId<ChatMessage>[]) =>
  messages.reduce<GroupedChatMessages[]>((groups, message) => {
    const currentGroup = first(groups);
    if (message.from.id === currentGroup?.from.id) {
      currentGroup!.messages.push(message);
      return groups;
    }
    // use as id for chat group the id of the first message of the group
    return [
      {
        id: message.id,
        from: message.from,
        messages: [message],
      },
      ...groups,
    ];
  }, []);

export const getUnreadChatMessages = (
  chats: GroupedChatMessages[],
  counterpartId: string
) => {
  const unreadMessagesIds = chats.reduce<string[]>((list, chat) => {
    const unread = chat.messages
      .filter((msg) => msg.from.id === counterpartId && !msg.read)
      .map((msg) => msg.id);
    return list.concat([...unread]);
  }, []);
  return unreadMessagesIds;
};

export const getChatTypeLabel = (type: ChatMessageType) => {
  if (type === 'business-consumer') return 'restaurante - consumidor';
  else if (type === 'business-courier') return 'restaurante - entregador';
  else if (type === 'consumer-courier') return 'consumidor - entregador';
  return 'N/E';
};

export const getChatLastUpdate = (chat: GroupedChatMessages[]) => {
  let messages = chat.reduce<WithId<ChatMessage>[]>((result, group) => {
    const msgs = group.messages;
    return [...result, ...msgs];
  }, []);
  let lastUpdate: FieldValue | undefined = undefined;
  messages.forEach((msg) => {
    if (!lastUpdate || lastUpdate < msg.timestamp) lastUpdate = msg.timestamp;
  });
  return lastUpdate as FieldValue | undefined;
};
