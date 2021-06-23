import { Text } from '@chakra-ui/react';
import { CancellationData } from 'app/api/order/OrderApi';
import { useOrder } from 'app/api/order/useOrder';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { Issue, WithId } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { useParams } from 'react-router-dom';
import { getOrderCancellator } from 'utils/functions';
import { t } from 'utils/i18n';
import { OrderBaseDrawer } from '../OrderBaseDrawer';
import { Cancelation } from './Cancelation';
import { CookingTime } from './CookingTime';
import { DeliveryInfos } from './DeliveryInfos';
import { OrderDetails } from './OrderDetails';
import { OrderIssuesTable } from './OrderIssuesTable';
import { PrintSwitch } from './PrintSwitch';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
};

export const OrderDrawer = (props: Props) => {
  //context
  const { orderId } = useParams<Params>();
  const { business } = useContextBusiness();
  const { order, cancelOrder, result, orderIssues, orderCancellation } = useOrder(orderId);
  const { manager } = useContextManagerProfile();

  // state
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);

  // helpers
  const cancellator = getOrderCancellator(orderCancellation?.issue?.type);

  // handlers
  const handleCancel = async (issue: WithId<Issue>) => {
    submission.current += 1;
    if (!manager?.id || !manager?.name) {
      return setError({
        status: true,
        error: {
          error: 'Order cancellation incomplete. There is no manager:',
          id: manager?.id,
          name: manager?.name,
        },
        message: {
          title: 'Não foi possível cancelar o pedido.',
          description: 'Verifica a conexão com a internet?',
        },
      });
    }
    const cancellationData = {
      canceledById: manager?.id,
      issue,
    } as CancellationData;
    await cancelOrder(cancellationData);
    props.onClose();
  };

  // side effects
  React.useEffect(() => {
    if (result.isError) {
      setError({
        status: true,
        error: result.error,
      });
    }
  }, [result.isError, result.error]);

  // UI
  return (
    <OrderBaseDrawer
      {...props}
      order={order}
      cancellator={cancellator}
      cancel={() => setIsCanceling(true)}
      isCanceling={isCanceling}
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
              <SectionTitle>{t('Dados do cancelamento')}</SectionTitle>
              <Text mt="1" fontSize="md" fontWeight="700" color="black">
                {t('Motivo:')}{' '}
                <Text as="span" fontWeight="500">
                  {orderCancellation?.issue?.title ?? 'N/E'}
                </Text>
              </Text>
              <Text mt="1" fontSize="md" fontWeight="700" color="black">
                {t('Reembolso:')}{' '}
                <Text as="span" fontWeight="500">
                  {orderCancellation?.params.refund.includes('products') ? 'Sim' : 'Não'}
                </Text>
              </Text>
            </>
          )}
          {orderIssues && orderIssues.length > 0 && <OrderIssuesTable issues={orderIssues} />}
          {(order?.status === 'confirmed' || order?.status === 'preparing') && (
            <CookingTime
              orderId={order.id}
              cookingTime={order.cookingTime}
              averageCookingTime={business?.averageCookingTime}
            />
          )}
          {order?.status === 'confirmed' && <PrintSwitch />}
        </>
      )}
      <SuccessAndErrorHandler
        submission={submission.current}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </OrderBaseDrawer>
  );
};
