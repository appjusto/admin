import { ChatMessage, WithId } from 'appjusto-types';
import { first } from 'lodash';
import { OrderChatGroup } from '../business/chat/useBusinessChats';
import { GroupedChatMessages } from './types';

export const timestampToDate = (value: firebase.firestore.FieldValue) =>
  (value as firebase.firestore.Timestamp).toDate();

export const sortMessages = (a: ChatMessage, b: ChatMessage) => {
  if (a.timestamp && b.timestamp)
    return timestampToDate(a.timestamp).getTime() - timestampToDate(b.timestamp).getTime();
  if (!a.timestamp) return -1;
  else if (b.timestamp) return 1;
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

export const getNotReadChatMessages = (chats: OrderChatGroup[]) => {
  let notReadMessages = [] as string[];
  chats.forEach((group) => {
    group.counterParts.forEach((part) => {
      if (part.notReadMessages && part.notReadMessages?.length > 0) {
        notReadMessages = notReadMessages.concat(part.notReadMessages);
      }
    });
  });
  return notReadMessages;
};
