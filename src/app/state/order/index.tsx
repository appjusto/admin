import {
  Business,
  Order,
  OrderStatus,
  PlatformParams,
  WithId,
} from '@appjusto/types';
import { useToast } from '@chakra-ui/react';
import { useBusinessOpenClose } from 'app/api/business/profile/useBusinessOpenClose';
import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useFreshDesk } from 'app/api/business/useFresdesk';
import { OrderChatGroup } from 'app/api/chat/types';
import { useBusinessChats } from 'app/api/chat/useBusinessChats';
import { useNewChatMessages } from 'app/api/order/useNewChatMessages';
import { useObserveCanceledOrdersInTheLastHour } from 'app/api/order/useObserveCanceledOrdersInTheLastHour';
import { useObserveConfirmedOrders } from 'app/api/order/useObserveConfirmedOrders';
import { useObserveOrders } from 'app/api/order/useObserveOrders';
import { useObservePreparingOrders } from 'app/api/order/useObservePreparingOrders';
import { useObserveScheduledOrders } from 'app/api/order/useObserveScheduledOrders';
import { usePlatformParams } from 'app/api/platform/usePlatformParams';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { CustomToastAutoPlay } from 'common/components/CustomToast';
import React from 'react';
import { useContextFirebaseUser } from '../auth/context';
import { useContextAppRequests } from '../requests/context';

interface ContextProps {
  business: WithId<Business> | null | undefined;
  scheduledOrders: WithId<Order>[];
  scheduledOrdersNumber: number;
  orders: WithId<Order>[];
  canceledOrders: WithId<Order>[];
  confirmedNumber: number;
  activeChat?(): void;
  chats: OrderChatGroup[];
  newChatMessages: string[];
  fetchNextScheduledOrders(): void;
  fetchNextCanceledOrders(): void;
  getOrderById(id: string): WithId<Order> | undefined;
  changeOrderStatus(orderId: string, status: OrderStatus): void;
  setOrderCookingTime(orderId: string, cookingTime: number | null): void;
  platformParams?: PlatformParams | null;
}

const OrdersContext = React.createContext<ContextProps>({} as ContextProps);

const statuses = [
  'confirmed',
  'preparing',
  'ready',
  'dispatching',
] as OrderStatus[];

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const OrdersContextProvider = (props: ProviderProps) => {
  // context
  const api = useContextApi();
  const { platformParams, isPlatformLive } = usePlatformParams();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { isBackofficeUser } = useContextFirebaseUser();
  const { business } = useContextBusiness();
  const { sendBusinessKeepAlive } = useBusinessProfile();
  const { scheduledOrders, scheduledOrdersNumber, fetchNextScheduledOrders } =
    useObserveScheduledOrders(business?.id);
  const activeOrders = useObserveOrders(statuses, business?.id);
  const { canceledOrders, fetchNextCanceledOrders } =
    useObserveCanceledOrdersInTheLastHour(business?.id);
  const confirmedNumber = useObserveConfirmedOrders(business?.id);
  useObservePreparingOrders(business?.id);
  // freshdesk
  const businessPhone = business?.phones ? business?.phones[0].number : 'N/E';
  useFreshDesk(business?.id, business?.name, businessPhone);
  // automatic opening and closing of the business
  useBusinessOpenClose(business);
  //state
  const [businessAlertDisplayed, setBusinessAlertDisplayed] =
    React.useState(false);
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [isChatActive, setIsChatActive] = React.useState(false);
  const chats = useBusinessChats(business?.id, isChatActive);
  // handle new chat messages
  const newChatMessages = useNewChatMessages(business?.id);
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
  const activeChat = React.useCallback(() => {
    setIsChatActive(true);
  }, []);
  // side effects
  React.useEffect(() => {
    if (business?.situation !== 'approved' || business?.status !== 'open')
      return;
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
    setOrders(activeOrders);
  }, [activeOrders]);
  // business keep alive
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (!isPlatformLive) return;
    if (business?.situation !== 'approved') return;
    if (business?.status !== 'open') return;
    sendBusinessKeepAlive();
    const time =
      process.env.REACT_APP_ENVIRONMENT === 'live' ? 300_000 : 30_000;
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
        scheduledOrders,
        scheduledOrdersNumber,
        orders,
        canceledOrders,
        confirmedNumber,
        activeChat,
        chats,
        newChatMessages,
        fetchNextCanceledOrders,
        fetchNextScheduledOrders,
        getOrderById,
        changeOrderStatus,
        setOrderCookingTime,
        platformParams,
      }}
      {...props}
    />
  );
};

export const useOrdersContext = () => {
  const context = React.useContext(OrdersContext);
  if (!context) {
    throw new Error(
      'useOrdersContext must be used within the OrdersContextProvider'
    );
  }
  return context;
};
