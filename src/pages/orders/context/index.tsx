import { useToast } from '@chakra-ui/toast';
import * as Sentry from '@sentry/react';
import { useBusinessChats } from 'app/api/business/chat/useBusinessChats';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { OrderChatGroup } from 'app/api/chat/types';
import { useCanceledOrders } from 'app/api/order/useCanceledOrders';
import { useObserveConfirmedOrders } from 'app/api/order/useObserveConfirmedOrders';
import { useObservePreparingOrders } from 'app/api/order/useObservePreparingOrders';
import { useOrders } from 'app/api/order/useOrders';
import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { Business, Order, OrderStatus, WithId } from 'appjusto-types';
import { CustomToast } from 'common/components/CustomToast';
import React from 'react';
import { updateLocalStorageOrderTime } from 'utils/functions';

export type localOrderType = { code: string; time: number };

interface ContextProps {
  business: WithId<Business> | null | undefined;
  orders: WithId<Order>[];
  chats: OrderChatGroup[];
  newChatMessages: string[];
  getUnreadChatMessages(orderId: string, counterPartId: string): string[];
  getOrderById(id: string): WithId<Order> | undefined;
  //createFakeOrder(): void;
  changeOrderStatus(orderId: string, status: OrderStatus): void;
  setOrderCookingTime(orderId: string, cookingTime: number | null): void;
}

const OrdersContext = React.createContext<ContextProps>({} as ContextProps);

const statuses = ['confirmed', 'preparing', 'ready', 'dispatching'] as OrderStatus[];

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const OrdersContextProvider = (props: ProviderProps) => {
  // context
  const api = useContextApi();
  const { isBackofficeUser } = useContextAgentProfile();
  const { business } = useContextBusiness();
  const { updateBusinessProfile, sendBusinessKeepAlive } = useBusinessProfile();
  const activeOrders = useOrders(statuses, business?.id);
  const canceledOrders = useCanceledOrders(business?.id);
  const chats = useBusinessChats(activeOrders);
  useObserveConfirmedOrders(business?.id);
  useObservePreparingOrders(business?.id);

  //state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [newChatMessages, setNewChatMessages] = React.useState<string[]>([]);

  //handlers
  const toast = useToast();

  const getOrderById = (id: string) => {
    const order = orders.find((order: WithId<Order>) => order.id === id);
    return order;
  };

  const changeOrderStatus = React.useCallback(
    async (orderId: string, status: OrderStatus) => {
      if (status === 'preparing') updateLocalStorageOrderTime(orderId);
      // optimistic update to avoid flickering
      setOrders((prevOrders) => {
        let newOrders = prevOrders.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              status,
            };
          } else {
            return order;
          }
        });
        return newOrders;
      });
      // firestore update
      try {
        await api.order().updateOrder(orderId, { status });
      } catch (error) {
        toast({
          duration: 8000,
          render: () => (
            <CustomToast
              type="error"
              message={{
                title: 'O status do pedido não pode ser alterado.',
                description: 'Verifica a conexão com a internet?',
              }}
            />
          ),
        });
        Sentry.captureException(error);
      }
    },
    [api, toast]
  );

  const setOrderCookingTime = React.useCallback(
    async (orderId: string, cookingTime: number | null) => {
      try {
        await api.order().updateOrder(orderId, { cookingTime });
      } catch (error) {
        toast({
          duration: 8000,
          render: () => (
            <CustomToast
              type="error"
              message={{
                title: 'O tempo de preparo do pedido não foi alterado.',
                description: 'Verifica a conexão com a internet?',
              }}
            />
          ),
        });
        Sentry.captureException(error);
      }
    },
    [api, toast]
  );

  const getUnreadChatMessages = React.useCallback(
    (orderId: string, counterPartId: string) => {
      if (chats) {
        const group = chats.find((chat) => chat.orderId === orderId);
        const messages =
          group?.counterParts.find((part) => part.id === counterPartId)?.unreadMessages ?? [];
        return messages;
      }
      return [];
    },
    [chats]
  );

  // side effects
  React.useEffect(() => {
    setOrders([...activeOrders, ...canceledOrders]);
  }, [activeOrders, canceledOrders]);

  React.useEffect(() => {
    if (chats.length > 0) {
      let unreadMessages = [] as string[];
      chats.forEach((group) => {
        group.counterParts.forEach((part) => {
          if (part.unreadMessages && part.unreadMessages?.length > 0) {
            unreadMessages = unreadMessages.concat(part.unreadMessages);
          }
        });
      });
      setNewChatMessages(unreadMessages);
    }
  }, [chats]);

  // business keep alive
  React.useEffect(() => {
    const time = process.env.REACT_APP_ENVIRONMENT === 'live' ? 60000 : 30000;
    const keepAliveInterval = setInterval(() => {
      sendBusinessKeepAlive();
    }, time);
    return () => clearInterval(keepAliveInterval);
  }, [sendBusinessKeepAlive]);

  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (business?.situation !== 'approved') return;
    const onCloseListener = (e: BeforeUnloadEvent) => {
      // Cancel the event
      e.preventDefault();
      console.log('onCloseListener');
      updateBusinessProfile({ status: 'closed' });
      toast({
        duration: 12000,
        render: () => (
          <CustomToast
            type="warning"
            message={{
              title: 'Seu restaurante foi fechado.',
              description:
                'Ao tentar fechar ou recarregar esta página, seu restaurante é fechado automaticamente. Se deseja continuar recebendo pedidos, basta abri-lo novamente.',
            }}
          />
        ),
      });
      // Chrome requires returnValue to be set
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onCloseListener);
    return () => window.removeEventListener('beforeunload', onCloseListener);
  }, [updateBusinessProfile, toast, isBackofficeUser, business?.situation]);

  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (business?.situation !== 'approved') return;
    if (business?.status === 'closed') {
      toast({
        duration: 12000,
        render: () => (
          <CustomToast
            type="warning"
            message={{
              title: 'Seu restaurante está fechado.',
              description:
                'Para começar a receber pedidos é preciso ir até o "gerenciador de pedidos" e mudar o status do restaurante para "aberto".',
            }}
          />
        ),
      });
    }
  }, [isBackofficeUser, business?.situation, business?.status, toast]);

  // provider
  return (
    <OrdersContext.Provider
      value={{
        business,
        orders,
        chats,
        newChatMessages,
        getUnreadChatMessages,
        getOrderById,
        //createFakeOrder,
        changeOrderStatus,
        setOrderCookingTime,
      }}
      {...props}
    />
  );
};

export const useOrdersContext = () => {
  const context = React.useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrdersContext must be used within the OrdersContextProvider');
  }
  return context;
};
