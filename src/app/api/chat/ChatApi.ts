import { ChatMessage, ChatMessageType, WithId } from '@appjusto/types';
import * as Sentry from '@sentry/react';
import dayjs from 'dayjs';
import {
  addDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { customCollectionSnapshot } from '../utils';

export default class ChatApi {
  constructor(private refs: FirebaseRefs) {}
  // firestore
  observeOrderParticipantChatMessages(
    orderId: string,
    participantId: string,
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ): Unsubscribe {
    const q = query(
      this.refs.getChatsRef(),
      where('orderId', '==', orderId),
      where('participantsIds', 'array-contains', participantId),
      orderBy('timestamp', 'asc')
    );
    return customCollectionSnapshot(q, resultHandler);
  }

  // async observeBusinessActiveChatMessages(
  //   businessId: string,
  //   ordersIds: string[],
  //   resultHandler: (messages: WithId<ChatMessage>[]) => void
  // ) {
  //   const IdsLimit = 10;
  //   let unsubscribes = [];
  //   for (var i = 0; i < ordersIds.length; i = i + IdsLimit) {
  //     const ids = ordersIds.slice(i, i + IdsLimit);
  //     const q = query(
  //       this.refs.getChatsRef(),
  //       where('orderId', 'in', ids),
  //       where('participantsIds', 'array-contains', businessId),
  //       orderBy('timestamp', 'asc')
  //     );
  //     unsubscribes.push(
  //       onSnapshot(
  //         q,
  //         (snapshot) => {
  //           if (!snapshot.empty) {
  //             resultHandler(documentsAs<ChatMessage>(snapshot.docs));
  //           }
  //         },
  //         (error) => {
  //           console.error(error);
  //           Sentry.captureException(error);
  //         }
  //       )
  //     );
  //   }
  //   return Promise.all(unsubscribes).then((content) => content.flat());
  // }

  observeBusinessActiveChatMessages(
    businessId: string,
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ) {
    const timeLimit = dayjs().subtract(2, 'hour').toDate();
    const q = query(
      this.refs.getChatsRef(),
      orderBy('timestamp', 'asc'),
      where('participantsIds', 'array-contains', businessId),
      where('timestamp', '>=', timeLimit)
    );
    return customCollectionSnapshot(q, resultHandler, {
      avoidPenddingWrites: false,
      captureException: true,
    });
  }

  observeBusinessNewChatMessages(
    businessId: string,
    resultHandler: (messagesIds: string[]) => void
  ) {
    const timeLimit = dayjs().subtract(2, 'hour').toDate();
    const q = query(
      this.refs.getChatsRef(),
      orderBy('timestamp', 'asc'),
      where('to.id', '==', businessId),
      where('read', '==', false),
      where('timestamp', '>=', timeLimit)
    );
    // returns the unsubscribe function
    return onSnapshot(
      q,
      (snapshot) => {
        const ids = snapshot.docs.map((message) => message.id);
        resultHandler(ids);
      },
      (error) => {
        console.error(error);
        Sentry.captureException(error);
      }
    );
  }

  observeOrderChatMessages(
    { orderId, queryLimit }: { orderId: string; queryLimit?: number },
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ) {
    let q = query(
      this.refs.getChatsRef(),
      where('orderId', '==', orderId),
      orderBy('timestamp', 'asc')
    );
    if (queryLimit) q = query(q, limit(queryLimit));
    return customCollectionSnapshot(q, resultHandler);
  }

  observeOrderChatByType(
    orderId: string,
    type: ChatMessageType,
    resultHandler: (messages: WithId<ChatMessage>[]) => void
  ) {
    const q = query(
      this.refs.getChatsRef(),
      where('orderId', '==', orderId),
      where('type', '==', type),
      orderBy('timestamp', 'asc')
    );
    return customCollectionSnapshot(q, resultHandler);
  }

  async sendMessage(message: Partial<ChatMessage>) {
    const timestamp = serverTimestamp();
    return addDoc(this.refs.getChatsRef(), {
      ...message,
      timestamp,
    });
  }

  async updateChatMessage(messageId: string, changes: Partial<ChatMessage>) {
    await updateDoc(this.refs.getChatMessageRef(messageId), {
      ...changes,
    } as Partial<ChatMessage>);
  }
}
