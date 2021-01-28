import { splitByStatus2 } from 'app/api/order/selectors';
//import { useOrders } from 'app/api/order/useOrders';
import { useContextBusiness } from 'app/state/business/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';

interface FakeOrder {
  id: string;
  type: string;
  status: string;
  consumer: {
    id: string;
    name: string;
  };
  courier: {};
  business: {
    id: string;
    name: string;
  };
  items: string[];
  code: string;
}

const fakeOrder = {
  type: 'food',
  status: 'confirming',
  consumer: {
    id: 'sefsese',
    name: 'Zé',
  },
  courier: {},
  business: {
    id: '',
    name: 'Itapuama vegan',
  },
  items: [],
};

interface ContextProps {
  business: WithId<Business> | null | undefined;
  confirm(code: string | undefined): void;
  ready(code: string | undefined): void;
  dispatching(code: string | undefined): void;
  delivered(code: string | undefined): void;
  ordersByStatus: any;
  minutesToAccept: { isEditing: boolean; minutes: number };
  handleMinutesToAccept(isEditing: boolean, minutes: number): void;
}

const OrdersContext = React.createContext<ContextProps>({} as ContextProps);

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const OrdersContextProvider = (props: ProviderProps) => {
  // context
  const business = useContextBusiness();
  //const orders = useOrders(undefined, business!.id);
  const fakeOrders = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'].map(
    (item) => ({
      ...fakeOrder,
      id: Math.random().toString(),
      code: item,
    })
  );
  //state
  const [orders, setOrders] = React.useState<FakeOrder[]>([]);
  const [minutesToAccept, setMinutesToAccept] = React.useState<{
    isEditing: boolean;
    minutes: number;
  }>({ isEditing: false, minutes: 5 });

  React.useEffect(() => {
    setOrders(fakeOrders);
  }, []);

  const ordersByStatus = splitByStatus2(orders);

  const handleMinutesToAccept = (isEditing: boolean, minutes: number) => {
    setMinutesToAccept({ isEditing, minutes });
  };

  const changeState = (code: string, status: string) => {
    setOrders((prev) => {
      const newOrder = prev.map((order) => {
        if (order.code === code) {
          return {
            ...order,
            status,
          };
        } else {
          return order;
        }
      });
      return newOrder;
    });
  };
  const confirm = (code: string) => {
    changeState(code, 'preparing');
  };
  const ready = (code: string) => {
    changeState(code, 'ready');
  };
  const dispatching = (code: string) => {
    changeState(code, 'dispatching');
  };
  const delivered = (code: string) => {
    changeState(code, 'delivered');
  };
  return (
    <OrdersContext.Provider
      value={{
        business,
        confirm,
        ready,
        dispatching,
        delivered,
        ordersByStatus,
        minutesToAccept,
        handleMinutesToAccept,
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
