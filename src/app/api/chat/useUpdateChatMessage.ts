import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';
import { ChatMessage } from '@appjusto/types';

export const useUpdateChatMessage = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutateAsync: updateChatMessage, mutationResult: updateResult } = useCustomMutation(
    async (data: { messageId: string; changes: Partial<ChatMessage> }) =>
      api.chat().updateChatMessage(data.messageId, data.changes),
    'updateChatMessage',
    false
  );
  // result
  return {
    updateChatMessage,
    updateResult,
  };
};
