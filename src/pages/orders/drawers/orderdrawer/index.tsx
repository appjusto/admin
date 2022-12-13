import { CancelOrderPayload, Issue, WithId } from '@appjusto/types';
import { Box, Text } from '@chakra-ui/react';
import { useObserveLedgerByOrderIdAndOperation } from 'app/api/ledger/useObserveLedgerByOrderIdAndOperation';
import { useOrder } from 'app/api/order/useOrder';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import { isToday } from 'pages/orders/utils';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { formatCurrency } from 'utils/formatters';
import { getOrderCancellator } from 'utils/functions';
import { t } from 'utils/i18n';
import { OrderBaseDrawer } from '../OrderBaseDrawer';
import { Cancelation } from './Cancelation';
import { CookingTime } from './CookingTime';
import { CourierAllocation } from './CourierAllocation';
import { DeliveryInfos } from './DeliveryInfos';
import { OrderDetails } from './OrderDetails';
import { OrderIssuesTable } from './OrderIssuesTable';
import { OrderToPrinting } from './OrderToPrinting';
import { Outsourced } from './Outsourced';

interface Props {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
};

export const OrderDrawer = (props: Props) => {
  //context
  const { onClose } = props;
  const { dispatchAppRequestResult } = useContextAppRequests();
  // const query = useQuery();
  const { orderId } = useParams<Params>();
  const { business } = useContextBusiness();
  const {
    order,
    updateOrder,
    updateResult,
    cancelOrder,
    cancelResult,
    orderIssues,
    orderCancellation,
    orderCancellationCosts,
  } = useOrder(orderId);
  const { manager } = useContextManagerProfile();
  const { amount: insuranceAmount } = useObserveLedgerByOrderIdAndOperation(
    business?.id,
    orderId,
    'business-insurance'
  );
  // state
  const [isCanceling, setIsCanceling] = React.useState(false);
  // refs
  const printComponent = React.useRef<HTMLDivElement>(null);
  // helpers
  const cancellator = getOrderCancellator(orderCancellation?.issue?.type);
  const canAllocateCourier =
    order?.fulfillment === 'delivery' &&
    (!order?.scheduledTo || isToday(order?.scheduledTo)) &&
    business?.tags &&
    business.tags.includes('can-match-courier') &&
    order?.status &&
    (['scheduled', 'confirmed', 'preparing'].includes(order.status) ||
      (order.status === 'ready' && !order.courier));
  const canOutsource =
    business?.tags && business.tags.includes('can-outsource');
  const showDeliveryInfos =
    order?.fulfillment === 'delivery' &&
    (order?.status === 'ready' || order?.status === 'dispatching') &&
    order.dispatchingStatus !== 'outsourced';
  // handlers
  const handleCancel = (issue: WithId<Issue>) => {
    if (!manager?.id) {
      return dispatchAppRequestResult({
        status: 'error',
        requestId: 'OrderDrawer-valid',
        error: {
          code: 'order-cancellation-incomplete',
          message: `manager - id:${manager?.id}, name: ${manager?.name}`,
        },
        message: {
          title: 'Não foi possível cancelar o pedido.',
          description:
            'As permissões do seu usuário não foram encontradas. Verifica a conexão com a internet?',
        },
      });
    }
    const cancellationData = {
      orderId,
      acknowledgedCosts: orderCancellationCosts,
      cancellation: issue,
    } as CancelOrderPayload;
    cancelOrder(cancellationData);
  };
  const printOrder = useReactToPrint({
    content: () => printComponent.current,
  });
  // side effects
  // React.useEffect(() => {
  //   if (!query || isOutsourceDelivery !== undefined) return;
  //   if (order?.dispatchingStatus === 'outsourced') setIsOutsourceDelivery(true);
  //   if (query.get('outsource')) setIsOutsourceDelivery(true);
  // }, [query, isOutsourceDelivery, order]);
  React.useEffect(() => {
    if (!cancelResult.isSuccess) return;
    onClose();
  }, [cancelResult.isSuccess, onClose]);
  // UI
  return (
    <OrderBaseDrawer
      {...props}
      order={order}
      cancellator={cancellator}
      cancel={() => setIsCanceling(true)}
      isCanceling={isCanceling}
      printOrder={printOrder}
      orderPrinting={business?.orderPrinting}
      cookingTimeMode={business?.settings?.cookingTimeMode}
    >
      {canAllocateCourier && (
        <CourierAllocation orderId={orderId} courier={order?.courier} />
      )}
      <Box position="relative">
        <Box w="100%">
          {isCanceling ? (
            <Cancelation
              fulfillment={order?.fulfillment}
              handleConfirm={handleCancel}
              handleKeep={() => setIsCanceling(false)}
              isLoading={cancelResult.isLoading}
              orderCancellationCosts={orderCancellationCosts}
            />
          ) : (
            <>
              <Outsourced
                order={order}
                canOutsource={canOutsource}
                updateOrderStatus={(status) => updateOrder({ status })}
                isLoading={updateResult.isLoading}
              />
              {showDeliveryInfos && <DeliveryInfos order={order!} />}
              {order?.status === 'ready' && order.fulfillment === 'take-away' && (
                <Box
                  mt="4"
                  border="2px solid #FFBE00"
                  borderRadius="lg"
                  bg=""
                  p="4"
                >
                  <SectionTitle mt="0">
                    {t('Aguardando retirada pelo cliente')}
                  </SectionTitle>
                  <Text mt="2">
                    {t(
                      'O cliente optou por retirar o pedido no estabelecimento'
                    )}
                  </Text>
                </Box>
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
                    {t('Reembolso para cliente:')}{' '}
                    <Text as="span" fontWeight="500">
                      {orderCancellation?.params?.refund.includes('products')
                        ? 'Sim'
                        : 'Não'}
                    </Text>
                  </Text>
                </>
              )}
              {insuranceAmount > 0 && (
                <>
                  <SectionTitle>{t('Cobertura AppJusto')}</SectionTitle>
                  <Text mt="1" fontSize="md" fontWeight="700" color="black">
                    {t('Valor ressarcido:')}{' '}
                    <Text as="span" fontWeight="500">
                      {formatCurrency(insuranceAmount)}
                    </Text>
                  </Text>
                </>
              )}
              {orderIssues && orderIssues.length > 0 && (
                <OrderIssuesTable issues={orderIssues} />
              )}
              {order?.status !== 'ready' && order?.status !== 'dispatching' && (
                <>
                  <Text mt="8" fontSize="xl" color="black">
                    {t('Destino do pedido')}
                  </Text>
                  <Text fontSize="sm">
                    {order?.destination?.address.description}
                  </Text>
                </>
              )}
              {order?.status === 'confirmed' && (
                <CookingTime
                  orderId={order.id}
                  cookingTime={order.cookingTime}
                  averageCookingTime={business?.averageCookingTime}
                  cookingTimeMode={business?.settings?.cookingTimeMode}
                />
              )}
            </>
          )}
        </Box>
        <OrderToPrinting
          businessName={business?.name}
          order={order}
          ref={printComponent}
        />
      </Box>
    </OrderBaseDrawer>
  );
};
