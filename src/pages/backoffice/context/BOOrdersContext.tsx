import { useBOOrders } from 'app/api/order/useBOOrders';
import { useContextApi } from 'app/state/api/context';
import { Issue, Order, OrderStatus, WithId } from 'appjusto-types';
import React from 'react';
import { updateLocalStorageOrderTime } from 'utils/functions';

interface ContextProps {
  orders: WithId<Order>[] | undefined;
  getOrderById(id: string): WithId<Order> | undefined;
  changeOrderStatus(orderId: string, status: OrderStatus): void;
  fetchCancelOptions(): Promise<WithId<Issue>[]>;
  cancelOrder(orderId: string, issue: WithId<Issue>): void;
  //getOrderIssue(orderId: string): void;
}

const BOOrdersContext = React.createContext<ContextProps>({} as ContextProps);

const options = { active: true, inactive: true };

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const BOOrdersContextProvider = (props: ProviderProps) => {
  // context
  const api = useContextApi();
  const hookOrders = useBOOrders(options);

  //state
  const [orders, setOrders] = React.useState<WithId<Order>[]>([]);

  //handlers
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
      await api.order().updateOrder(orderId, { status });
    },
    [api]
  );

  const fetchCancelOptions = React.useCallback(async () => {
    const options = await api.order().fetchIssues('restaurant-cancel');
    return options;
  }, [api]);

  const cancelOrder = async (orderId: string, issue: WithId<Issue>) => {
    await api.order().updateOrder(orderId, { status: 'canceled' });
    await api.order().setOrderIssue(orderId, issue);
  };

  //const getOrderIssue = async (orderId: string) => {
  // without permission
  //const issues = await api.order().getOrderIssue(orderId);
  //console.log(issues);
  //};

  // side effects
  React.useEffect(() => {
    if (hookOrders) {
      setOrders(hookOrders);
    }
  }, [hookOrders]);
  // provider
  return (
    <BOOrdersContext.Provider
      value={{
        orders,
        getOrderById,
        changeOrderStatus,
        fetchCancelOptions,
        cancelOrder,
        //getOrderIssue,
      }}
      {...props}
    />
  );
};

export const useBOOrdersContext = () => {
  const context = React.useContext(BOOrdersContext);
  if (!context) {
    throw new Error('useBOOrdersContext must be used within the BOOrdersContextProvider');
  }
  return context;
};
