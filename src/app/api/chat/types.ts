import { ChatMessage, ChatMessageType, ChatMessageUser, Flavor, WithId } from '@appjusto/types';
import { FieldValue } from 'firebase/firestore';

export interface GroupedChatMessages {
  id: string;
  from: ChatMessageUser;
  messages: WithId<ChatMessage>[];
}

export interface OrderChatGroup {
  orderId: string;
  orderCode?: string;
  lastUpdate?: FieldValue;
  counterParts: [
    {
      id: string;
      flavor: Flavor;
      updatedOn: FieldValue;
      name?: string;
      unreadMessages?: string[];
    }
  ];
}

export interface OrderChatTypeGroup {
  orderId: string;
  lastUpdate?: FieldValue;
  type: ChatMessageType;
  participantsIds: string[];
  unreadMessages: boolean;
}

export type Participants = {
  id: string;
  name: string;
  flavor?: Flavor;
  image?: string | null;
};
