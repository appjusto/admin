import { ChatMessage, ChatMessageType, WithId } from '@appjusto/types';
import { GroupedChatMessages } from 'app/api/chat/types';
import { groupOrderChatMessages, sortMessages } from 'app/api/chat/utils';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useObserveOrderChatByType = (
  orderId: string,
  type: ChatMessageType
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('chats');
  // state
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>(
    []
  );
  const [chat, setChat] = React.useState<GroupedChatMessages[]>([]);
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId || !type) return;
    const unsub = api
      .chat()
      .observeOrderChatByType(orderId, type, setChatMessages);
    return () => unsub();
  }, [api, userCanRead, orderId, type]);
  React.useEffect(() => {
    const sorted = chatMessages.sort(sortMessages);
    const groups = groupOrderChatMessages(sorted).reverse();
    setChat(groups);
  }, [chatMessages]);
  // return
  return { chat };
};
