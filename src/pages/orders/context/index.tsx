import { splitByStatus2 } from 'app/api/order/selectors';
import { useOrders } from 'app/api/order/useOrders';
import { useContextApi } from 'app/state/api/context';
//import { useOrders } from 'app/api/order/useOrders';
import { useContextBusiness } from 'app/state/business/context';
import { Business, DispatchingState, Order, OrderStatus, OrderType, WithId } from 'appjusto-types';
import { IuguInvoice } from 'appjusto-types/payment/iugu';
import React from 'react';

/*interface FakeOrder {
  id: string;
  type: OrderType;
  status: string;
  comments?: string;
  consumer: {
    id: string;
    name: string;
    cpf?: string;
  };
  courier: {
    id: string;
    name: string;
    location: LatLng;
  };
  business: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  code: string;
  payment?: {
    paymentMethodId: string;
  };
  // places & route
  origin?: Place;
  destination?: Place | null;
  route?: OrderRoute | null;
  dispatchingState?: DispatchingState;
}*/

const fakeItem = (price: number, qtd: number) => {
  return {
    product: {
      name: 'Item',
      price: price, // in cents
      id: Math.random().toString(),
      externalId: '',
    },
    quantity: qtd,
    notes: '',
  };
};

const fakeOrder = {
  type: 'food' as OrderType,
  code: `${Math.random().toString()}`,
  status: 'confirming' as OrderStatus,
  comments: 'cpf',
  consumer: {
    id: '8jnAYorqWL98OPfMypu6',
    name: 'Renan',
    cpf: '35214602820',
  },
  courier: {
    id: 'KfpVLMg9rEURH8BOCMJ8',
    name: 'Kelly',
    joined: ('1 de fevereiro de 2021 00:00:00 UTC-3' as unknown) as firebase.firestore.FieldValue,
    location: {
      latitude: -8.0591539,
      longitude: -34.9063069,
    },
  },
  business: {
    id: 'Ik2Ju9mot8oxIusMci1G',
    name: 'Itapuama vegan',
  },
  items: [fakeItem(1200, 1), fakeItem(1600, 2)],
  payment: {
    paymentMethodId: 'Crédito',
    invoice: {} as IuguInvoice,
  },
  origin: {
    address: {
      main: 'Rua bom pastor, 1485',
      description: '',
    },
    additionalInfo: '',
    intructions: '',
    location: {
      latitude: -8.0502761,
      longitude: -34.9413061,
    },
  },
  destination: {
    address: {
      main: 'Rua João Ivo da Silva, 453',
      description: '',
    },
    additionalInfo: '',
    intructions: '',
    location: {
      latitude: -8.0622085,
      longitude: -34.9115396,
    },
  },
  route: {
    distance: 4500, // in meters
    duration: 14 * 60, // in seconds
    polyline: '',
    issue: null,
  },
  dispatchingState: 'matching' as DispatchingState,
};

interface ContextProps {
  business: WithId<Business> | null | undefined;
  getOrderById(id: string): any;
  //confirm(code: string | undefined): void;
  //ready(code: string | undefined): void;
  //dispatching(code: string | undefined): void;
  //delivered(code: string | undefined): void;
  createFakeOrder(): void;
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
  const api = useContextApi();
  const business = useContextBusiness();
  const orders = useOrders(undefined, business!.id);
  /*const fakeOrders = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'].map(
    (item) => ({
      ...fakeOrder,
      id: Math.random().toString(),
      code: item,
    })
  );*/
  //state
  //const [orders, setOrders] = React.useState<FakeOrder[]>([]);
  const [minutesToAccept, setMinutesToAccept] = React.useState<{
    isEditing: boolean;
    minutes: number;
  }>({ isEditing: false, minutes: 5 });

  /*React.useEffect(() => {
    setOrders(fakeOrders);
  }, []);*/

  const ordersByStatus = splitByStatus2(orders);

  const getOrderById = (id: string) => {
    const order = orders.find((order: WithId<Order>) => order.id === id);
    return order;
  };

  const handleMinutesToAccept = (isEditing: boolean, minutes: number) => {
    setMinutesToAccept({ isEditing, minutes });
  };

  //Development
  const createFakeOrder = async () => {
    await api.order().createFakeOrder(fakeOrder);
  };

  /*const changeState = (code: string, status: string) => {
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
  };*/
  return (
    <OrdersContext.Provider
      value={{
        business,
        getOrderById,
        //confirm,
        //ready,
        //dispatching,
        //delivered,
        createFakeOrder,
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
