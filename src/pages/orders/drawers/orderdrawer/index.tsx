import { Box, Text } from '@chakra-ui/react';
import { useOrder } from 'app/api/order/useOrder';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { CancelOrderPayload, Issue, WithId } from 'appjusto-types';
import { SuccessAndErrorHandler } from 'common/components/error/SuccessAndErrorHandler';
import { initialError } from 'common/components/error/utils';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getOrderCancellator } from 'utils/functions';
import { t } from 'utils/i18n';
import { OrderBaseDrawer } from '../OrderBaseDrawer';
import { Cancelation } from './Cancelation';
import { CookingTime } from './CookingTime';
import { DeliveryInfos } from './DeliveryInfos';
import { OrderDetails } from './OrderDetails';
import { OrderIssuesTable } from './OrderIssuesTable';
import { OrderToPrinting } from './OrderToPrinting';
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
  const {
    order,
    cancelOrder,
    updateResult,
    cancelResult,
    orderIssues,
    orderCancellation,
    orderCancellationCosts,
  } = useOrder(orderId);
  const { manager } = useContextManagerProfile();

  // state
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [error, setError] = React.useState(initialError);

  // refs
  const submission = React.useRef(0);
  const printComponent = React.useRef<HTMLDivElement>(null);

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
      orderId,
      acknowledgedCosts: orderCancellationCosts,
      cancellation: issue,
    } as CancelOrderPayload;
    await cancelOrder(cancellationData);
    props.onClose();
  };

  const printOrder = useReactToPrint({
    content: () => printComponent.current,
  });

  // side effects
  React.useEffect(() => {
    if (updateResult.isError) {
      setError({
        status: true,
        error: updateResult.error,
      });
    } else if (cancelResult.isError) {
      setError({
        status: true,
        error: cancelResult.error,
      });
    }
  }, [updateResult.isError, updateResult.error, cancelResult.isError, cancelResult.error]);

  // UI
  return (
    <OrderBaseDrawer
      {...props}
      order={order}
      cancellator={cancellator}
      cancel={() => setIsCanceling(true)}
      isCanceling={isCanceling}
      printOrder={printOrder}
    >
      <Box position="relative">
        <Box pos="absolute" top="0" left="0" w="100%" h="100vh" bg="white" zIndex="-100" />
        <Box w="100%">
          {isCanceling ? (
            <Cancelation
              handleConfirm={handleCancel}
              handleKeep={() => setIsCanceling(false)}
              isLoading={cancelResult.isLoading}
              orderCancellationCosts={orderCancellationCosts}
            />
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
              {order?.status !== 'ready' && order?.status !== 'dispatching' && (
                <>
                  <Text mt="8" fontSize="xl" color="black">
                    {t('Destino do pedido')}
                  </Text>
                  <Text fontSize="sm">{order?.destination?.address.description}</Text>
                </>
              )}
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
        </Box>
        <OrderToPrinting businessName={business?.name} order={order} ref={printComponent} />
      </Box>
      <SuccessAndErrorHandler
        submission={submission.current}
        isError={error.status}
        error={error.error}
        errorMessage={error.message}
      />
    </OrderBaseDrawer>
  );
};
