import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ChatMessage, Flavor, Order, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';
import { useCourierProfilePicture } from '../courier/useCourierProfilePicture';

export const useOrderChat = (orderId: string, counterpartId: string) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  const courierProfilePicture = useCourierProfilePicture(counterpartId);

  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [chat, setChat] = React.useState<WithId<ChatMessage>[]>();
  const [participants, setParticipants] = React.useState({});
  const [groupMessages, setGroupMessages] = React.useState<WithId<ChatMessage>[]>([]);

  // handlers;
  const [sendMessage, sendMessageResult] = useMutation(async (data: Partial<ChatMessage>) => {
    if (!businessId) return;
    const from = { agent: 'manager' as Flavor, id: businessId };
    api.order().sendMessage(orderId, {
      from,
      ...data,
    });
  });

  // side effects
  React.useEffect(() => {
    if (!orderId) return;
    api.order().observeOrder(orderId, setOrder);
    api.order().observeOrderChat(orderId, setChat);
  }, [api, orderId]);

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
  }, [order, counterpartId, courierProfilePicture]);

  React.useEffect(() => {
    if (!chat) return;
    const group = chat.filter((msg) => {
      if (
        (msg.from.id === businessId && msg.to.id === counterpartId) ||
        (msg.to.id === businessId && msg.from.id === counterpartId)
      ) {
        return msg;
      }
      return;
    });
    setGroupMessages(group);
  }, [chat, businessId, counterpartId]);

  // return
  return { participants, groupMessages, sendMessage, sendMessageResult };
};
