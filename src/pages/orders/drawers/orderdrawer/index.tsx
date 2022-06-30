import { CancelOrderPayload, Issue, WithId } from '@appjusto/types';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useGetOutsourceDelivery } from 'app/api/order/useGetOutsourceDelivery';
import { useOrder } from 'app/api/order/useOrder';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { useContextAppRequests } from 'app/state/requests/context';
import { CustomInput } from 'common/components/form/input/CustomInput';
import { SectionTitle } from 'pages/backoffice/drawers/generics/SectionTitle';
import printJS from 'print-js';
import React from 'react';
import { useParams } from 'react-router-dom';
import { formatCurrency } from 'utils/formatters';
import { getOrderCancellator, useQuery } from 'utils/functions';
import { t } from 'utils/i18n';
import { OrderBaseDrawer } from '../OrderBaseDrawer';
import { Cancelation } from './Cancelation';
import { CookingTime } from './CookingTime';
import { DeliveryInfos } from './DeliveryInfos';
import { OrderDetails } from './OrderDetails';
import { OrderIssuesTable } from './OrderIssuesTable';
import { OrderToPrinting2 } from './OrderToPrinting2';

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
  const query = useQuery();
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
  const {
    getOutsourceDelivery,
    outsourceDeliveryResult,
    updateOutsourcingCourierInfos,
    updateOutsourcingCourierInfosResult,
  } = useGetOutsourceDelivery(orderId);
  // state
  const [isCanceling, setIsCanceling] = React.useState(false);
  const [isOutsourceDelivery, setIsOutsourceDelivery] = React.useState<boolean>();
  const [outsourcingCourierName, setOutsourcingCourierName] = React.useState<string>();
  // refs
  const printComponent = React.useRef<HTMLDivElement>(null);
  // helpers
  const cancellator = getOrderCancellator(orderCancellation?.issue?.type);
  const deliveryFare = order?.fare?.courier?.value
    ? formatCurrency(order.fare.courier.value)
    : 'N/E';
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
  const printOrder = () => printJS({ printable: 'template-to-print', type: 'html' });
  // const printOrder = useReactToPrint({
  //   content: () => printComponent.current,
  // });
  // side effects
  React.useEffect(() => {
    if (!query || isOutsourceDelivery !== undefined) return;
    if (order?.dispatchingStatus === 'outsourced') setIsOutsourceDelivery(true);
    if (query.get('outsource')) setIsOutsourceDelivery(true);
  }, [query, isOutsourceDelivery, order]);
  React.useEffect(() => {
    if (!order?.courier?.name) return;
    setOutsourcingCourierName(order?.courier?.name);
  }, [order?.courier?.name]);
  React.useEffect(() => {
    if (!cancelResult.isSuccess) return;
    onClose();
  }, [cancelResult.isSuccess, onClose])
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
      <Box position="relative">
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
              {(order?.status === 'ready' || order?.status === 'dispatching') &&
                (isOutsourceDelivery ? (
                  order.dispatchingStatus === 'outsourced' ? (
                    <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" bg="" p="4">
                      <SectionTitle mt="0">{t('Logística fora da rede AppJusto')}</SectionTitle>
                      {order.outsourcedBy === 'business' ? (
                        <>
                          <Text mt="2">
                            {t(
                              `Não foi possível encontrar entregadores disponíveis na nossa rede e você optou por assumir a logística, recebendo o repasse do valor do frete (${deliveryFare}).`
                            )}
                          </Text>
                          <HStack mt="4">
                            <CustomInput
                              mt="0"
                              id="out-courier-name"
                              label={t('Informe o nome do entregador')}
                              value={outsourcingCourierName ?? ''}
                              onChange={(ev) => setOutsourcingCourierName(ev.target.value)}
                            />
                            <Button
                              h="60px"
                              onClick={() => updateOutsourcingCourierInfos({ name: outsourcingCourierName! })}
                              isLoading={updateOutsourcingCourierInfosResult.isLoading}
                              isDisabled={!outsourcingCourierName}
                            >
                              {t('Salvar')}
                            </Button>
                          </HStack>
                          <Text mt="6">
                            {t(`Após a realização da entrega, confirme com o botão abaixo:`)}
                          </Text>
                          <Button
                            mt="4"
                            onClick={() => updateOrder({ status: 'delivered' })}
                            isLoading={updateResult.isLoading}
                            isDisabled={order.status !== 'dispatching'}
                          >
                            {t('Confirmar que o pedido foi entregue ao cliente')}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Text mt="2">
                            {t(
                              `Não foi possível encontrar entregadores disponíveis na nossa rede. Um entregador de outra rede fará a retirada. A equipe AppJusto está monitorando o pedido e concluirá o mesmo após a realização da entrega.`
                            )}
                          </Text>
                          <Text mt="4">
                            {t('Nome do entregador: ')}
                            <Text as="span" fontWeight="700">
                              {order.courier?.name ?? 'Buscando'}
                            </Text>
                          </Text>
                        </>
                      )}
                      {/*<Text mt="2">
                        {t(
                          `O AppJusto não terá como monitorar o pedido a partir daqui. Caso seja necessário, entre em contato com o cliente para mantê-lo informado sobre sua entrega.`
                        )}
                      </Text>
                      */}
                    </Box>
                  ) : (
                    <Box mt="4" border="2px solid #FFBE00" borderRadius="lg" bg="" p="4">
                      <SectionTitle mt="0">{t('Assumir logística')}</SectionTitle>
                      <Text mt="2">
                        {t(
                          `Ao assumir a logística de entrega, iremos repassar o valor de ${deliveryFare} pelo custo da entrega, além do valor do pedido que já foi cobrado do cliente. O AppJusto não terá como monitorar o pedido a partir daqui.`
                        )}
                      </Text>
                      <HStack mt="4">
                        <Button
                          mt="0"
                          variant="dangerLight"
                          onClick={() => setIsOutsourceDelivery(false)}
                        >
                          {t('Cancelar')}
                        </Button>
                        <Button
                          mt="0"
                          onClick={() => getOutsourceDelivery({})}
                          isLoading={outsourceDeliveryResult.isLoading}
                        >
                          {t('Confirmar')}
                        </Button>
                      </HStack>
                    </Box>
                  )
                ) : (
                  <DeliveryInfos order={order} setOutsource={setIsOutsourceDelivery} />
                ))}
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
                      {orderCancellation?.params?.refund.includes('products') ? 'Sim' : 'Não'}
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
        {/* <OrderToPrinting businessName={business?.name} order={order} ref={printComponent} /> */}
        <OrderToPrinting2 order={order} />
      </Box>
    </OrderBaseDrawer>
  );
};
