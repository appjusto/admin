import { useContextApi } from 'app/state/api/context';
import { useContextBusinessId } from 'app/state/business/context';
import { ChatMessage, Flavor, Order, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';
import { useCourierProfilePicture } from '../courier/useCourierProfilePicture';
import { GroupedChatMessages } from 'app/api/chat/types';
import { groupOrderChatMessages, sortMessages } from 'app/api/chat/utils';
import { getTimeUntilNow } from 'utils/functions';
import { useCustomMutation } from '../mutation/useCustomMutation';

export interface Participants {
  [x: string]:
    | {
        name: string;
        image: null;
        flavor?: string;
      }
    | {
        name: string;
        flavor: string;
        image: string | null | undefined;
      };
}

const orderActivedStatuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];
const orderCompleteStatuses = ['delivered', 'canceled'] as OrderStatus[];

export const useObserveBusinessOrderChatByType = (
  getServerTime: () => Date,
  orderId: string,
  counterpartId: string
) => {
  // context
  const api = useContextApi();
  const businessId = useContextBusinessId();
  // state
  const [order, setOrder] = React.useState<WithId<Order> | null>();
  const [isActive, setIsActive] = React.useState(false);
  const [participants, setParticipants] = React.useState<Participants>({});
  const [counterPartFlavor, setCounterPartFlavor] = React.useState<Flavor>();
  const [chatMessages, setChatMessages] = React.useState<WithId<ChatMessage>[]>([]);
  const [chat, setChat] = React.useState<GroupedChatMessages[]>([]);
  const courierProfilePicture = useCourierProfilePicture(
    counterpartId,
    undefined,
    counterPartFlavor === 'courier'
  );
  // mutations;
  const { mutateAsync: sendMessage, mutationResult: sendMessageResult } = useCustomMutation(
    async (data: Partial<ChatMessage>) => {
      if (!businessId) return;
      const from = { agent: 'business' as Flavor, id: businessId };
      api.chat().sendMessage({
        orderId,
        participantsIds: [businessId, counterpartId],
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
    if (!order) return;
    let counterpartName = 'N/E';
    let flavor = 'courier' as Flavor;
    if (order.consumer?.id === counterpartId) {
      flavor = 'consumer';
      counterpartName = order.consumer?.name ?? 'N/E';
    } else if (order.courier?.id === counterpartId) {
      counterpartName = order.courier?.name ?? 'N/E';
    }
    setCounterPartFlavor(flavor);
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
    if (!orderId || !businessId || !counterPartFlavor) return;
    const chatType = counterPartFlavor === 'courier' ? 'business-courier' : 'business-consumer';
    const unsub = api.chat().observeOrderChatByType(orderId, chatType, setChatMessages);
    return () => unsub();
  }, [api, orderId, businessId, counterPartFlavor]);
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
  // return
  return { isActive, orderCode: order?.code, participants, chat, sendMessage, sendMessageResult };
};
