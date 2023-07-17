import {
  Business,
  Order,
  OrderStatus,
  PlatformParams,
  WithId,
} from '@appjusto/types';
import { useBusinessOpenClose } from 'app/api/business/profile/useBusinessOpenClose';
import { useBusinessKeepAlive } from 'app/api/business/useBusinessKeepAlive';
import { useCustomToastAutoPlay } from 'app/api/business/useCustomToastAutoPlay';
import { useFreshDesk } from 'app/api/business/useFresdesk';
import { useUpdateManagerLastBusinessId } from 'app/api/business/useUpdateManagerLastBusinessId';
import { useVisibilityToast } from 'app/api/business/useVisibilityToast';
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
import React from 'react';
import { useContextManagerProfile } from '../manager/context';
import { useContextAppRequests } from '../requests/context';
import { useContextStaffProfile } from '../staff/context';
import { getOrderAcceptedFrom } from './utils';

interface ContextProps {
  business: WithId<Business> | null | undefined;
  isBusinessOpen: boolean;
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
  const { platformParams } = usePlatformParams();
  const { dispatchAppRequestResult } = useContextAppRequests();
  const { isBackofficeUser } = useContextStaffProfile();
  const { manager } = useContextManagerProfile();
  const { business } = useContextBusiness();
  useBusinessKeepAlive(business?.id);
  useVisibilityToast(business);
  useCustomToastAutoPlay(business);
  useUpdateManagerLastBusinessId(manager, business?.id);
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
  const isBusinessOpen = useBusinessOpenClose(business);
  //state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);
  const [isChatActive, setIsChatActive] = React.useState(false);
  const chats = useBusinessChats(business?.id, isChatActive);
  // handle new chat messages
  const newChatMessages = useNewChatMessages(business?.id);
  //handlers
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
        const changes = { status } as Partial<Order>;
        if (status === 'preparing') {
          changes.acceptedFrom = getOrderAcceptedFrom(isBackofficeUser);
        }
        await api.order().updateOrder(orderId, changes);
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
    [api, dispatchAppRequestResult, isBackofficeUser]
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
    setOrders(activeOrders);
  }, [activeOrders]);
  // provider
  return (
    <OrdersContext.Provider
      value={{
        business,
        isBusinessOpen,
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
