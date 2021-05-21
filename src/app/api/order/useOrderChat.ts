import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ChatMessage, Flavor, Order, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { useCourierProfilePicture } from '../courier/useCourierProfilePicture';
import { first } from 'lodash';

export interface GroupedChatMessages {
  id: string;
  from: string;
  messages: WithId<ChatMessage>[];
}

const orderActivedStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

export const useOrderChat = (orderId: string, counterpartId: string) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  const courierProfilePicture = useCourierProfilePicture(counterpartId);

  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [isActive, setIsActive] = React.useState(false);
  const [participants, setParticipants] = React.useState({});
  const [chatFromBusiness, setChatFromBusiness] = React.useState<WithId<ChatMessage>[]>([]);
  const [chatFromCounterPart, setChatFromCounterPart] = React.useState<WithId<ChatMessage>[]>([]);
  const [chat, setChat] = React.useState<GroupedChatMessages[]>([]);

  // handlers;
  const [sendMessage, sendMessageResult] = useMutation(async (data: Partial<ChatMessage>) => {
    if (!businessId) return;
    const from = { agent: 'business' as Flavor, id: businessId };
    api.order().sendMessage(orderId, {
      from,
      ...data,
    });
  });

  // side effects
  React.useEffect(() => {
    if (!orderId || !businessId || !counterpartId) return;
    const unsub = api.order().observeOrder(orderId, setOrder);
    const unsub2 = api
      .order()
      .observeOrderChat(orderId, businessId, counterpartId, setChatFromBusiness);
    const unsub3 = api
      .order()
      .observeOrderChat(orderId, counterpartId, businessId, setChatFromCounterPart);
    return () => {
      unsub();
      unsub2();
      unsub3();
    };
  }, [api, orderId, businessId, counterpartId]);

  React.useEffect(() => {
    if (!order) return;
    let counterpartName = 'N/E';
    let flavor = 'courier';
    //let code = 'N/E';
    if (order.consumer?.id === counterpartId) {
      //code = order.consumer.id;
      flavor = 'consumer';
      counterpartName = order.consumer?.name ?? 'N/E';
    } else if (order.courier?.id === counterpartId) {
      //code = order.courier.id;
      counterpartName = order.courier?.name ?? 'N/E';
    }
    const participantsObject = {
      [businessId!]: {
        name: order.business?.name ?? 'N/E',
        image: null,
      },
      [counterpartId]: {
        //code,
        name: counterpartName,
        flavor,
        image: courierProfilePicture,
      },
    };
    setParticipants(participantsObject);
  }, [order, counterpartId, businessId, courierProfilePicture]);

  React.useEffect(() => {
    if (order?.status && orderActivedStatuses.includes(order.status)) {
      setIsActive(true);
    } else setIsActive(false);
  }, [order?.status]);

  React.useEffect(() => {
    setChat(
      groupOrderChatMessages(
        chatFromBusiness.concat(chatFromCounterPart).sort(sortMessages)
      ).reverse()
    );
  }, [chatFromBusiness, chatFromCounterPart]);

  // return
  return { isActive, participants, chat, sendMessage, sendMessageResult };
};

const timestampToDate = (value: firebase.firestore.FieldValue) =>
  (value as firebase.firestore.Timestamp).toDate();

const sortMessages = (a: ChatMessage, b: ChatMessage) => {
  if (a.timestamp && b.timestamp)
    return timestampToDate(a.timestamp).getTime() - timestampToDate(b.timestamp).getTime();
  if (!a.timestamp) return -1;
  else if (b.timestamp) return 1;
  return 0;
};

const groupOrderChatMessages = (messages: WithId<ChatMessage>[]) =>
  messages.reduce<GroupedChatMessages[]>((groups, message) => {
    const currentGroup = first(groups);
    if (message.from.id === currentGroup?.from) {
      currentGroup!.messages.push(message);
      return groups;
    }
    // use as id for chat group the id of the first message of the group
    return [{ id: message.id, from: message.from.id, messages: [message] }, ...groups];
  }, []);
