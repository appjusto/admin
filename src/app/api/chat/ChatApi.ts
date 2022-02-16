import { WithId, ChatMessage } from 'appjusto-types';
import FirebaseRefs from '../FirebaseRefs';
import firebase from 'firebase/app';
import { customCollectionSnapshot } from '../utils';
import { ChatMessageType } from 'appjusto-types/order/chat';

export default class ChatApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  observeOrderParticipantChatMessages(
    orderId: string,
    participantId: string,
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ): firebase.Unsubscribe {
    const query = this.refs
      .getChatsRef()
      .where('orderId', '==', orderId)
      .where('participantsIds', 'array-contains', participantId)
      .orderBy('timestamp', 'asc');
    return customCollectionSnapshot(query, resultHandler);
  }

  observeBusinessActiveChatMessages(
    businessId: string,
    ordersIds: string[],
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ) {
    const query = this.refs
      .getChatsRef()
      .where('orderId', 'in', ordersIds)
      .where('participantsIds', 'array-contains', businessId)
      .orderBy('timestamp', 'asc');
    return customCollectionSnapshot(query, resultHandler);
  }

  observeOrderChatMessages(
    { orderId, limit }: { orderId: string; limit?: number },
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ) {
    let query = this.refs.getChatsRef().where('orderId', '==', orderId).orderBy('timestamp', 'asc');
    if (limit) query = query.limit(limit);
    return customCollectionSnapshot(query, resultHandler);
  }

  observeOrderChatByType(
    orderId: string,
    type: ChatMessageType,
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ) {
    const query = this.refs
      .getChatsRef()
      .where('orderId', '==', orderId)
      .where('type', '==', type)
      .orderBy('timestamp', 'asc');
    return customCollectionSnapshot(query, resultHandler);
  }

  async sendMessage(message: Partial<ChatMessage>) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return this.refs.getChatsRef().add({
      ...message,
      timestamp,
    });
  }

  async updateChatMessage(messageId: string, changes: Partial<ChatMessage>) {
    await this.refs.getChatMessageRef(messageId).update({
      ...changes,
    } as Partial<ChatMessage>);
  }
}
