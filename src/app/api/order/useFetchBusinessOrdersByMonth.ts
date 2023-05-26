import { Order, OrderStatus, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import { getPeriodBalance } from 'pages/finances/utils';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

const statuses = ['delivered', 'scheduled', 'canceled'] as OrderStatus[];

export const useFetchBusinessOrdersByMonth = (
  businessId: string | undefined,
  currentDate?: Date | null
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('orders');
  // state
  const [orders, setOrders] = React.useState<WithId<Order>[]>();
  const [productsAmount, setProductsAmount] = React.useState(0);
  const [deliveryAmount, setDeliveryAmount] = React.useState(0);
  const [iuguCosts, setIuguCosts] = React.useState(0);
  const [comission, setComission] = React.useState(0);
  const [extras, setExtras] = React.useState(0);
  const [netValue, setNetValue] = React.useState(0);
  const [ordersNumber, setOrdersNumber] = React.useState(0);
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!businessId) return;
    if (!currentDate) return;
    let startDate = dayjs(currentDate).startOf('month').toDate();
    let endDate = dayjs(currentDate).endOf('month').toDate();
    (async () => {
      const orders = await api
        .order()
        .fetchBusinessOrdersByPeriod(businessId, statuses, startDate, endDate);
      setOrders(orders);
    })();
  }, [api, userCanRead, businessId, currentDate]);
  React.useEffect(() => {
    const {
      products,
      delivery,
      iugu,
      comission,
      extras,
      netValue,
      ordersNumber,
    } = getPeriodBalance(orders);
    setProductsAmount(products);
    setDeliveryAmount(delivery);
    setIuguCosts(iugu);
    setComission(comission);
    setExtras(extras);
    setNetValue(netValue);
    setOrdersNumber(ordersNumber);
  }, [orders]);
  // return
  return {
    productsAmount,
    deliveryAmount,
    iuguCosts,
    comission,
    extras,
    netValue,
    ordersNumber,
  };
};
