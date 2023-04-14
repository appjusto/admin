import {
  ChatMessage,
  Flavor,
  Order,
  OrderStatus,
  WithId,
} from '@appjusto/types';
import { GroupedChatMessages, Participants } from 'app/api/chat/types';
import { groupOrderChatMessages, sortMessages } from 'app/api/chat/utils';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { FirebaseError } from 'firebase/app';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { getTimeUntilNow } from 'utils/functions';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';
import { useCustomMutation } from '../mutation/useCustomMutation';

const orderActivedStatuses = [
  'scheduled',
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
] as OrderStatus[];
const orderCompleteStatuses = ['delivered', 'canceled'] as OrderStatus[];

export const useObserveBusinessOrderChatByType = (
  getServerTime: () => Date,
  orderId: string,
  counterpartId: string
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('chats');
  const { business } = useContextBusiness();
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [isActive, setIsActive] = React.useState(false);
  const [participants, setParticipants] = React.useState<Participants[]>([]);
  const [counterPartFlavor, setCounterPartFlavor] = React.useState<Flavor>();
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>(
    []
  );
  const [chat, setChat] = React.useState<GroupedChatMessages[]>([]);
  // mutations;
  const { mutate: sendMessage, mutationResult: sendMessageResult } =
    useCustomMutation(
      (data: Partial<ChatMessage>) => {
        if (!business?.id || !business?.name) {
          throw new FirebaseError(
            'sendMessageError',
            'Não foi possível encontrar os dados do restaurante.'
          );
        }
        if (!order?.code) {
          throw new FirebaseError(
            'sendMessageError',
            'Não foi possível encontrar os dados do pedido.'
          );
        }
        const from = {
          agent: 'business' as Flavor,
          id: business.id,
          name: business.name,
        };
        return api.chat().sendMessage({
          orderId,
          orderCode: order.code,
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
    if (!business?.id || !business?.name) return;
    if (!order) return;
    let flavor = 'courier' as Flavor;
    let counterpartObj;
    if (order.consumer?.id === counterpartId) {
      flavor = 'consumer';
      counterpartObj = {
        id: order.consumer.id,
        name: order.consumer.name,
        flavor: 'consumer',
        image: null,
      } as Participants;
    }
    if (order.courier?.id === counterpartId) {
      counterpartObj = {
        id: order.courier.id,
        name: order.courier.name,
        flavor: 'courier',
        image: null,
      } as Participants;
    }
    let businessObj = {
      id: business.id,
      name: business.name,
      flavor: 'business',
      image: null,
    } as Participants;
    setCounterPartFlavor(flavor);
    if (counterpartObj) setParticipants([businessObj, counterpartObj]);
    else setParticipants([businessObj]);
  }, [order, counterpartId, business?.id, business?.name]);
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!orderId || !counterPartFlavor) return;
    const chatType =
      counterPartFlavor === 'courier'
        ? 'business-courier'
        : 'business-consumer';
    const unsub = api
      .chat()
      .observeOrderChatByType(orderId, chatType, setChatMessages);
    return () => unsub();
  }, [api, userCanRead, orderId, counterPartFlavor]);
  React.useEffect(() => {
    if (!order?.status) return;
    if (orderActivedStatuses.includes(order.status)) setIsActive(true);
    else if (orderCompleteStatuses.includes(order.status)) {
      const baseTime =
        order.status === 'delivered' && order.timestamps.delivered
          ? (order.timestamps.delivered as Timestamp).toMillis()
          : (order.updatedOn as Timestamp).toMillis();
      const now = getServerTime().getTime();
      const elapsedTime = getTimeUntilNow(now, baseTime, false);
      if (elapsedTime < 60) setIsActive(true);
      else setIsActive(false);
    } else setIsActive(false);
  }, [
    getServerTime,
    order?.status,
    order?.timestamps?.delivered,
    order?.updatedOn,
  ]);
  React.useEffect(() => {
    const sorted = chatMessages.sort(sortMessages);
    const groups = groupOrderChatMessages(sorted).reverse();
    setChat(groups);
  }, [chatMessages]);
  React.useEffect(() => {
    if (!chat) return;
    (async () => {
      const updateCouriers = async (couriers: Participants[]) => {
        const result = Promise.all(
          couriers.map(async (courier) => {
            if (courier.flavor === 'courier' && !courier.image) {
              const image = await api
                .courier()
                .getCourierProfilePictureURL(courier.id, '_160x160');
              return {
                ...courier,
                image,
              };
            } else return courier;
          })
        );
        return result;
      };
      let couriers = chat.reduce<Participants[]>((result, group) => {
        let currentParticipantsIds = result.map((res) => res.id);
        if (
          !currentParticipantsIds.includes(group.from.id) &&
          group.from.agent === 'courier'
        ) {
          let courierObj = {
            id: group.from.id,
            name: group.from.name ?? 'N/E',
            flavor: group.from.agent,
            image: null,
          } as Participants;
          return [...result, courierObj];
        } else return result;
      }, []);
      if (couriers.length > 0) {
        const newCouriers = await updateCouriers(couriers);
        setParticipants((prev) => {
          let business = prev.filter(
            (participant) => participant.flavor === 'business'
          );
          return [...business, ...newCouriers];
        });
      }
    })();
  }, [api, chat]);
  // return
  return {
    isActive,
    orderCode: order?.code,
    participants,
    chat,
    sendMessage,
    sendMessageResult,
  };
};
