import { useContextApi } from 'app/state/api/context';
import { ChatMessage } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useUpdateChatMessage = () => {
  // context
  const api = useContextApi();
  // mutations
  const [
    updateChatMessage,
    updateResult,
  ] = useMutation(
    async (data: { orderId: string; messageId: string; changes: Partial<ChatMessage> }) =>
      api.business().updateChatMessage(data.orderId, data.messageId, data.changes)
  );
  // result
  return {
    updateChatMessage,
    updateResult,
  };
};
