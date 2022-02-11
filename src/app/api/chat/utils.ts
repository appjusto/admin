import { ChatMessage, WithId } from 'appjusto-types';
import { first } from 'lodash';
import { GroupedChatMessages, OrderChatGroup } from './types';
import firebase from 'firebase/app';

export const timestampToDate = (value: firebase.firestore.FieldValue) =>
  (value as firebase.firestore.Timestamp).toDate();

export const sortMessages = (a: ChatMessage, b: ChatMessage) => {
  if (a.timestamp && b.timestamp)
    return timestampToDate(a.timestamp).getTime() - timestampToDate(b.timestamp).getTime();
  if (!a.timestamp) return 1;
  else if (!b.timestamp) return -1;
  return 0;
};

export const getOrderChatGroup = (businessId: string, messages: WithId<ChatMessage>[]) => {
  return messages.reduce<OrderChatGroup[]>((groups, message) => {
    const existingGroup = groups.find((group) => group.orderId === message.orderId);
    const counterPartId = businessId === message.from.id ? message.to.id : message.from.id;
    const counterPartFlavor =
      counterPartId === message.from.id ? message.from.agent : message.to.agent;
    const isUnread = message.from.id !== businessId && !message.read;
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
};

export const groupOrderChatMessages = (messages: WithId<ChatMessage>[]) =>
  messages.reduce<GroupedChatMessages[]>((groups, message) => {
    const currentGroup = first(groups);
    if (message.from.id === currentGroup?.from) {
      currentGroup!.messages.push(message);
      return groups;
    }
    // use as id for chat group the id of the first message of the group
    return [{ id: message.id, from: message.from.id, messages: [message] }, ...groups];
  }, []);

export const getUnreadChatMessages = (chats: GroupedChatMessages[], counterpartId: string) => {
  const unreadMessagesIds = chats.reduce<string[]>((list, chat) => {
    const unread = chat.messages
      .filter((msg) => msg.from.id === counterpartId && !msg.read)
      .map((msg) => msg.id);
    return list.concat([...unread]);
  }, []);
  return unreadMessagesIds;
};
