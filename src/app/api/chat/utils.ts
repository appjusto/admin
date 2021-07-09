import { ChatMessage, WithId } from 'appjusto-types';
import { first } from 'lodash';
import { OrderChatGroup } from 'app/api/chat/types';
import { GroupedChatMessages } from './types';
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

export const getUnreadChatMessages = (chats: OrderChatGroup[]) => {
  let unreadMessages = [] as string[];
  chats.forEach((group) => {
    group.counterParts.forEach((part) => {
      if (part.unreadMessages && part.unreadMessages?.length > 0) {
        unreadMessages = unreadMessages.concat(part.unreadMessages);
      }
    });
  });
  return unreadMessages;
};
