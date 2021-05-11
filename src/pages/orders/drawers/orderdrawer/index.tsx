import { Text } from '@chakra-ui/react';
import { useOrder } from 'app/api/order/useOrder';
import { Issue, OrderIssue, WithId } from 'appjusto-types';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'utils/i18n';
import { OrderBaseDrawer } from '../OrderBaseDrawer';
import { Cancelation } from './Cancelation';
import { CookingTime } from './CookingTime';
import { DeliveryInfos } from './DeliveryInfos';
import { OrderDetails } from './OrderDetails';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
};

export const OrderDrawer = (props: Props) => {
  //context
  const isError = false;
  const error = '';
  const { orderId } = useParams<Params>();
  const { order, cancelOrder, orderIssues } = useOrder(orderId);

  // state
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [orderIssue, setOrderIssue] = React.useState<WithId<OrderIssue>>();

  // helpers
  const isCurrierArrived = order?.dispatchingState === 'arrived-pickup';

  // handlers
  const handleCancel = async (issue: WithId<Issue>) => {
    await cancelOrder({ issue });
    props.onClose();
  };

  // side effects
  React.useEffect(() => {
    if (orderIssues) {
      const issue = orderIssues.find((data) =>
        ['courier-cancel', 'consumer-cancel', 'restaurant-cancel'].includes(data.issue.type)
      );
      setOrderIssue(issue);
    }
  }, [orderIssues]);

  // UI
  return (
    <OrderBaseDrawer
      {...props}
      orderId={orderId}
      orderCode={order?.code ?? ''}
      orderStatus={order?.status!}
      orderIssue={orderIssue}
      isCurrierArrived={isCurrierArrived}
      client={order?.consumer?.name ?? ''}
      clientOrders={0}
      cancel={() => setIsCanceling(true)}
      isCanceling={isCanceling}
      isError={isError}
      error={error}
    >
      {isCanceling ? (
        <Cancelation handleConfirm={handleCancel} handleKeep={() => setIsCanceling(false)} />
      ) : (
        <>
          {(order?.status === 'ready' || order?.status === 'dispatching') && (
            <DeliveryInfos order={order} />
          )}
          <OrderDetails order={order} />
          {order?.status === 'canceled' && (
            <>
              <SectionTitle>{t('Motivo do cancelamento')}</SectionTitle>
              <Text mt="1" fontSize="md">
                {orderIssue?.issue.title ?? 'N/E'}
              </Text>
            </>
          )}
          {(order?.status === 'confirmed' || order?.status === 'preparing') && (
            <CookingTime orderId={order.id} cookingTime={order.cookingTime} />
          )}
        </>
      )}
    </OrderBaseDrawer>
  );
};
