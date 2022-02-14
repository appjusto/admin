import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { ChatMessage, Flavor, Order, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';
import { GroupedChatMessages, Participants } from 'app/api/chat/types';
import { groupOrderChatMessages, sortMessages } from 'app/api/chat/utils';
import { getTimeUntilNow } from 'utils/functions';
import { useCustomMutation } from '../mutation/useCustomMutation';

const orderActivedStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];
const orderCompleteStatuses = ['delivered', 'canceled'] as OrderStatus[];

export const useObserveBusinessOrderChatByType = (
  getServerTime: () => Date,
  orderId: string,
  counterpartId: string
) => {
  // context
  const api = useContextApi();
  const { business } = useContextBusiness();
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [isActive, setIsActive] = React.useState(false);
  const [participants, setParticipants] = React.useState<Participants[]>([]);
  const [counterPartFlavor, setCounterPartFlavor] = React.useState<Flavor>();
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>([]);
  const [chat, setChat] = React.useState<GroupedChatMessages[]>([]);
  // mutations;
  const { mutateAsync: sendMessage, mutationResult: sendMessageResult } = useCustomMutation(
    async (data: Partial<ChatMessage>) => {
      if (!business?.id || !business?.name) return;
      const from = { agent: 'business' as Flavor, id: business.id, name: business.name };
      api.chat().sendMessage({
        orderId,
        participantsIds: [business.id, counterpartId],
        from,
        ...data,
      });
    },
    'sendChatMessage',
    false
  );
  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    const unsub = api.order().observeOrder(orderId, setOrder);
    return () => unsub();
  }, [api, orderId]);
  React.useEffect(() => {
    if (!business?.id) return;
    if (!order) return;
    let flavor = 'courier' as Flavor;
    if (order.consumer?.id === counterpartId) {
      flavor = 'consumer';
    }
    setCounterPartFlavor(flavor);
  }, [order, counterpartId, business?.id]);
  React.useEffect(() => {
    if (!orderId || !counterPartFlavor) return;
    const chatType = counterPartFlavor === 'courier' ? 'business-courier' : 'business-consumer';
    const unsub = api.chat().observeOrderChatByType(orderId, chatType, setChatMessages);
    return () => unsub();
  }, [api, orderId, counterPartFlavor]);
  React.useEffect(() => {
    if (!order?.status) return;
    if (orderActivedStatuses.includes(order.status)) setIsActive(true);
    else if (orderCompleteStatuses.includes(order.status)) {
      const baseTime =
        order.status === 'delivered' && order.timestamps.delivered
          ? (order.timestamps.delivered as firebase.firestore.Timestamp).toMillis()
          : (order.updatedOn as firebase.firestore.Timestamp).toMillis();
      const now = getServerTime().getTime();
      const elapsedTime = getTimeUntilNow(now, baseTime, false);
      if (elapsedTime < 60) setIsActive(true);
      else setIsActive(false);
    } else setIsActive(false);
  }, [getServerTime, order?.status, order?.timestamps?.delivered, order?.updatedOn]);
  React.useEffect(() => {
    const sorted = chatMessages.sort(sortMessages);
    const groups = groupOrderChatMessages(sorted).reverse();
    setChat(groups);
  }, [chatMessages]);
  React.useEffect(() => {
    if (!chat) return;
    (async () => {
      const updateParticipants = async (participants: Participants[]) => {
        const result = Promise.all(
          participants.map(async (participant) => {
            if (participant.flavor === 'courier' && !participant.image) {
              const image = await api
                .courier()
                .getCourierProfilePictureURL(participant.id, '_160x160');
              return {
                ...participant,
                image,
              };
            } else return participant;
          })
        );
        return result;
      };
      let participants = chat.reduce<Participants[]>((result, group) => {
        let currentParticipantsIds = result.map((res) => res.id);
        if (!currentParticipantsIds.includes(group.from.id)) {
          let participantObj = {
            id: group.from.id,
            name: group.from.name ?? 'N/E',
            flavor: group.from.agent,
            image: null,
          } as Participants;
          return [...result, participantObj];
        } else return result;
      }, []);
      const newArray = await updateParticipants(participants);
      setParticipants(newArray);
    })();
  }, [api, chat]);
  // return
  return { isActive, orderCode: order?.code, participants, chat, sendMessage, sendMessageResult };
};
