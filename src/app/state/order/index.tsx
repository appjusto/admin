import { Business, Order, OrderStatus, WithId } from '@appjusto/types';
import { useToast } from '@chakra-ui/react';
import { useBusinessOpenClose } from 'app/api/business/profile/useBusinessOpenClose';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useFreshDesk } from 'app/api/business/useFresdesk';
import { OrderChatGroup } from 'app/api/chat/types';
import { useBusinessChats } from 'app/api/chat/useBusinessChats';
import { useObserveConfirmedOrders } from 'app/api/order/useObserveConfirmedOrders';
import { useObserveOrders } from 'app/api/order/useObserveOrders';
import { useObserveOrdersCompletedInTheLastHour } from 'app/api/order/useObserveOrdersCompletedInTheLastHour';
import { useObservePreparingOrders } from 'app/api/order/useObservePreparingOrders';
import { usePlatformParams } from 'app/api/platform/usePlatformParams';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { CustomToastAutoPlay } from 'common/components/CustomToast';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';
import { useContextAppRequests } from '../requests/context';

interface ContextProps {
  business: WithId<Business> | null | undefined;
  orders: WithId<Order>[];
  confirmedNumber: number;
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
  const { isPlatformLive } = usePlatformParams();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { isBackofficeUser } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { sendBusinessKeepAlive } = useBusinessProfile();
  const activeOrders = useObserveOrders(statuses, business?.id);
  const completedAndActiveOrders = useObserveOrdersCompletedInTheLastHour(business?.id);
  //const canceledOrders = useCanceledOrders(business?.id);
  const chats = useBusinessChats(activeOrders, completedAndActiveOrders);
  const confirmedNumber = useObserveConfirmedOrders(business?.id);
  useObservePreparingOrders(business?.id);
  // freshdesk
  useFreshDesk(business?.id, business?.name, business?.phone);
  // automatic opening and closing of the business
  useBusinessOpenClose(business);
  //state
  const [businessAlertDisplayed, setBusinessAlertDisplayed] = React.useState(false);
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
        dispatchAppRequestResult({
          status: 'error',
          requestId: 'changeOrderStatus-valid',
          error,
          message: {
            title: 'O status do pedido não pode ser alterado.',
            description: 'Verifica a conexão com a internet?',
          },
        });
      }
    },
    [api, dispatchAppRequestResult]
  );
  const setOrderCookingTime = React.useCallback(
    async (orderId: string, cookingTime: number | null) => {
      try {
        await api.order().updateOrder(orderId, { cookingTime });
      } catch (error) {
        dispatchAppRequestResult({
          status: 'error',
          requestId: 'setOrderCookingTime-valid',
          error,
          message: {
            title: 'O tempo de preparo do pedido não foi alterado.',
            description: 'Verifica a conexão com a internet?',
          },
        });
      }
    },
    [api, dispatchAppRequestResult]
  );
  // side effects
  React.useEffect(() => {
    if (business?.situation !== 'approved' || business?.status !== 'open') return;
    setTimeout(() => {
      const root = document.getElementById('root');
      let audio = document.createElement('audio');
      audio.setAttribute('id', 'audio-to-test');
      root?.appendChild(audio);
      audio
        .play()
        .then(() => console.log('Play success'))
        .catch((err) => {
          const isInteractionError = err.message.includes('user');
          if (isInteractionError && !toast.isActive('AutoPlayToast')) {
            toast({
              id: 'AutoPlayToast',
              duration: null,
              render: () => <CustomToastAutoPlay />,
            });
          }
        });
      audio.remove();
    }, 2000);
  }, [toast, business?.situation, business?.status]);
  React.useEffect(() => {
    setOrders([...activeOrders, ...completedAndActiveOrders]);
  }, [activeOrders, completedAndActiveOrders]);
  React.useEffect(() => {
    if (chats.length > 0) {
      let unreadMessages = [] as string[];
      chats.forEach((group) => {
        group.counterParts.forEach((part) => {
          if (part.unreadMessages && part.unreadMessages.length > 0) {
            unreadMessages.push(...part.unreadMessages);
          }
        });
      });
      setNewChatMessages(unreadMessages);
    }
  }, [chats]);
  // business keep alive
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (!isPlatformLive) return;
    if (business?.situation !== 'approved') return;
    if (business?.status !== 'open') return;
    sendBusinessKeepAlive();
    const time = process.env.REACT_APP_ENVIRONMENT === 'live' ? 300_000 : 30_000;
    const keepAliveInterval = setInterval(() => {
      sendBusinessKeepAlive();
    }, time);
    return () => clearInterval(keepAliveInterval);
  }, [
    isPlatformLive,
    isBackofficeUser,
    business?.situation,
    business?.status,
    sendBusinessKeepAlive,
  ]);
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (business?.situation !== 'approved') return;
    if (businessAlertDisplayed) return;
    if (!business?.enabled) {
      dispatchAppRequestResult({
        status: 'error',
        requestId: 'disabled-business-alert',
        message: {
          title: 'Seu restaurante está desligado.',
          description:
            'Desligado, seu restaurante não aparecerá para seus clientes. Para ligá-lo, vá até o perfil do restaurante ou contate o administrador desta unidade.',
        },
        duration: 12000,
      });
      setBusinessAlertDisplayed(true);
      return;
    }
  }, [
    isBackofficeUser,
    business?.situation,
    business?.enabled,
    businessAlertDisplayed,
    setBusinessAlertDisplayed,
    dispatchAppRequestResult,
  ]);
  // provider
  return (
    <OrdersContext.Provider
      value={{
        business,
        orders,
        confirmedNumber,
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
