import { ChatMessage, WithId, Flavor } from 'appjusto-types';
import firebase from 'firebase/app';

export interface GroupedChatMessages {
  id: string;
  from: string;
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
