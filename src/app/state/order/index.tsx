import { useToast } from '@chakra-ui/toast';
import * as Sentry from '@sentry/react';
import { useBusinessChats } from 'app/api/business/chat/useBusinessChats';
import { useBusinessOpenClose } from 'app/api/business/profile/useBusinessOpenClose';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useFreshDesk } from 'app/api/business/useFresdesk';
import { OrderChatGroup } from 'app/api/chat/types';
import { useObserveConfirmedOrders } from 'app/api/order/useObserveConfirmedOrders';
import { useObserveOrders } from 'app/api/order/useObserveOrders';
import { useObserveOrdersCompletedInTheLastHour } from 'app/api/order/useObserveOrdersCompletedInTheLastHour';
import { useObservePreparingOrders } from 'app/api/order/useObservePreparingOrders';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { Business, Order, OrderStatus, WithId } from 'appjusto-types';
import { CustomToast } from 'common/components/CustomToast';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';

export type localOrderType = { code: string; time: number };

interface ContextProps {
  business: WithId<Business> | null | undefined;
  orders: WithId<Order>[];
  chats: OrderChatGroup[];
  newChatMessages: string[];
  getOrderById(id: string): WithId<Order> | undefined;
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
  const { isBackofficeUser } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { sendBusinessKeepAlive } = useBusinessProfile();
  const activeOrders = useObserveOrders(statuses, business?.id);
  const completedAndActiveOrders = useObserveOrdersCompletedInTheLastHour(business?.id);
  //const canceledOrders = useCanceledOrders(business?.id);
  const chats = useBusinessChats(activeOrders, completedAndActiveOrders);
  useObserveConfirmedOrders(business?.id);
  useObservePreparingOrders(business?.id);
  // freshdesk
  useFreshDesk(business?.id, business?.name, business?.phone);
  // automatic opening and closing of the business
  useBusinessOpenClose(business);
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
  // side effects
  React.useEffect(() => {
    setOrders([...activeOrders, ...completedAndActiveOrders]);
  }, [activeOrders, completedAndActiveOrders]);
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
    if (business?.situation !== 'approved') return;
    const time = process.env.REACT_APP_ENVIRONMENT === 'live' ? 60000 : 30000;
    const keepAliveInterval = setInterval(() => {
      sendBusinessKeepAlive();
    }, time);
    return () => clearInterval(keepAliveInterval);
  }, [business?.situation, sendBusinessKeepAlive]);
  /*React.useEffect(() => {
    if (isBackofficeUser) return;
    if (business?.situation !== 'approved') return;
    if (business?.status !== 'open') return;
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
  }, [updateBusinessProfile, toast, isBackofficeUser, business?.situation, business?.status]);*/
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (business?.situation !== 'approved') return;
    if (!business?.enabled) {
      toast({
        duration: 12000,
        render: () => (
          <CustomToast
            type="warning"
            message={{
              title: 'Seu restaurante está desligado.',
              description:
                'Desligado, seu restaurante não aparecerá para seus clientes. Para ligá-lo, vá até o perfil do restaurante ou contate o administrador desta unidade.',
            }}
          />
        ),
      });
      return;
    }
  }, [isBackofficeUser, business?.situation, business?.enabled, business?.status, toast]);
  // provider
  return (
    <OrdersContext.Provider
      value={{
        business,
        orders,
        chats,
        newChatMessages,
        getOrderById,
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
