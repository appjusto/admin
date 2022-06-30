import { ChatMessage } from '@appjusto/types';
import { useCustomMutation } from 'app/api/mutation/useCustomMutation';
import { useContextApi } from 'app/state/api/context';

export const useUpdateChatMessage = () => {
  // context
  const api = useContextApi();
  // mutations
  const { mutate: updateChatMessage, mutationResult: updateResult } = useCustomMutation(
    (data: { messageId: string; changes: Partial<ChatMessage> }) =>
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
