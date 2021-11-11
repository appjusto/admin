import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';
import { ChatMessage } from 'appjusto-types';

export const useUpdateChatMessage = () => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutateAsync: updateChatMessage,
    mutationResult: updateResult,
  } = useCustomMutation(
    async (data: { orderId: string; messageId: string; changes: Partial<ChatMessage> }) =>
      api.business().updateChatMessage(data.orderId, data.messageId, data.changes)
  );
  // result
  return {
    updateChatMessage,
    updateResult,
  };
};
