import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ChatMessage, Flavor, Order, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { useCourierProfilePicture } from '../courier/useCourierProfilePicture';
import { GroupedChatMessages } from 'app/api/chat/types';
import { groupOrderChatMessages, sortMessages } from 'app/api/chat/utils';
import { useOrdersContext } from 'app/state/order';
import { getTimeUntilNow } from 'utils/functions';

const orderActivedStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];
const orderCompleteStatuses = ['delivered', 'canceled'] as OrderStatus[];

export const useOrderChat = (orderId: string, counterpartId: string) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  const courierProfilePicture = useCourierProfilePicture(counterpartId);
  const { getOrderById } = useOrdersContext();

  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [isActive, setIsActive] = React.useState(false);
  const [participants, setParticipants] = React.useState({});
  const [chatFromBusiness, setChatFromBusiness] = React.useState<WithId<ChatMessage>[]>([]);
  const [chatFromCounterPart, setChatFromCounterPart] = React.useState<WithId<ChatMessage>[]>([]);
  const [chat, setChat] = React.useState<GroupedChatMessages[]>([]);

  // mutations;
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
    if (!orderId) return;
    const order = getOrderById(orderId);
    setOrder(order);
  }, [orderId, getOrderById]);

  React.useEffect(() => {
    if (!orderId || !businessId || !counterpartId) return;
    const unsub = api
      .order()
      .observeOrderChat(orderId, businessId, counterpartId, setChatFromBusiness);
    const unsub2 = api
      .order()
      .observeOrderChat(orderId, counterpartId, businessId, setChatFromCounterPart);
    return () => {
      unsub();
      unsub2();
    };
  }, [api, orderId, businessId, counterpartId]);

  React.useEffect(() => {
    if (!order) return;
    let counterpartName = 'N/E';
    let flavor = 'courier';
    if (order.consumer?.id === counterpartId) {
      flavor = 'consumer';
      counterpartName = order.consumer?.name ?? 'N/E';
    } else if (order.courier?.id === counterpartId) {
      counterpartName = order.courier?.name ?? 'N/E';
    }
    const participantsObject = {
      [businessId!]: {
        name: order.business?.name ?? 'N/E',
        image: null,
      },
      [counterpartId]: {
        name: counterpartName,
        flavor,
        image: courierProfilePicture,
      },
    };
    setParticipants(participantsObject);
  }, [order, counterpartId, businessId, courierProfilePicture]);

  React.useEffect(() => {
    if (!order?.status) return;
    if (orderActivedStatuses.includes(order.status)) setIsActive(true);
    else if (orderCompleteStatuses.includes(order.status)) {
      const baseTime =
        order.status === 'delivered' && order.deliveredOn
          ? (order.deliveredOn as firebase.firestore.Timestamp).toMillis()
          : (order.updatedOn as firebase.firestore.Timestamp).toMillis();
      const elapsedTime = getTimeUntilNow(baseTime, false);
      console.log('elapsedTime', elapsedTime);
      if (elapsedTime < 60) setIsActive(true);
      else setIsActive(false);
    } else setIsActive(false);
  }, [order?.status]);

  React.useEffect(() => {
    const sorted = chatFromBusiness.concat(chatFromCounterPart).sort(sortMessages);
    const groups = groupOrderChatMessages(sorted).reverse();
    setChat(groups);
  }, [chatFromBusiness, chatFromCounterPart]);

  // return
  return { isActive, orderCode: order?.code, participants, chat, sendMessage, sendMessageResult };
};
