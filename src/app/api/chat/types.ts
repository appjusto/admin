import { ChatMessage, WithId } from 'appjusto-types';

export interface GroupedChatMessages {
  id: string;
  from: string;
  messages: WithId<ChatMessage>[];
}
