import { ChatMessageUser, ChatMessage, WithId, Flavor, ChatMessageType } from '@appjusto/types';
import firebase from 'firebase/app';

export interface GroupedChatMessages {
  id: string;
  from: ChatMessageUser;
  messages: WithId<ChatMessage>[];
}

export interface OrderChatGroup {
  orderId: string;
  orderCode?: string;
  lastUpdate?: firebase.firestore.FieldValue;
  counterParts: [
    {
      id: string;
      flavor: Flavor;
      updatedOn: firebase.firestore.FieldValue;
      name?: string;
      unreadMessages?: string[];
    }
  ];
}

export interface OrderChatTypeGroup {
  orderId: string;
  lastUpdate?: firebase.firestore.FieldValue;
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
