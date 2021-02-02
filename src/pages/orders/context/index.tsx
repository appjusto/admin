import { splitByStatus } from 'app/api/order/selectors';
import { useOrders } from 'app/api/order/useOrders';
import { useContextApi } from 'app/state/api/context';
import { useContextBusiness } from 'app/state/business/context';
import { Business, DispatchingState, Order, OrderStatus, OrderType, WithId } from 'appjusto-types';
import { IuguInvoice } from 'appjusto-types/payment/iugu';
import React from 'react';

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
  ordersByStatus: any;
  getOrderById(id: string): any;
  createFakeOrder(): void;
  changeOrderStatus(orderId: string, status: OrderStatus): void;
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
  const ordersByStatus = splitByStatus(orders);

  //Development
  const createFakeOrder = async () => {
    await api.order().createFakeOrder(fakeOrder);
  };

  //handlers
  const getOrderById = (id: string) => {
    const order = orders.find((order: WithId<Order>) => order.id === id);
    return order;
  };

  const changeOrderStatus = async (orderId: string, status: OrderStatus) => {
    await api.order().updateOrder(orderId, { status });
  };

  return (
    <OrdersContext.Provider
      value={{
        business,
        ordersByStatus,
        getOrderById,
        createFakeOrder,
        changeOrderStatus,
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
