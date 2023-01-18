import { Order, WithId } from '@appjusto/types';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useOrderArrivalTimes } from 'app/api/order/useOrderArrivalTimes';
import { useOrderDeliveryInfos } from 'app/api/order/useOrderDeliveryInfos';
import { useOrdersContext } from 'app/state/order';
import { useContextServerTime } from 'app/state/server-time';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { OrderBaseCard } from './OrderBaseCard';
import { OrderCodeBox } from './OrderCodeBox';

interface Props {
  order: WithId<Order>;
}

export const OrderReadyCard = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { getServerTime } = useContextServerTime();
  const { changeOrderStatus } = useOrdersContext();
  const arrivalTime = useOrderArrivalTimes(getServerTime, order);
  const { isMatched, isCurrierArrived, orderDispatchingKanbanItemText } =
    useOrderDeliveryInfos(getServerTime, order);
  // helpers
  const hasIssues = React.useMemo(() => {
    return order.flags?.includes('issue');
  }, [order.flags]);
  const activeBorderColor = React.useMemo(() => {
    if (hasIssues) return 'red';
    else if (order.dispatchingStatus === 'outsourced') return '#FFBE00';
    else if (order.status === 'ready' && isCurrierArrived) return 'black';
    return 'gray';
  }, [order.dispatchingStatus, order.status, hasIssues, isCurrierArrived]);
  const showArrivalTime =
    typeof arrivalTime === 'number' &&
    order.dispatchingState !== 'arrived-pickup' &&
    order.dispatchingState !== 'arrived-destination';
  const showArrivalTimeCalc =
    order.dispatchingState !== 'arrived-pickup' &&
    order.dispatchingState !== 'arrived-destination';
  const consumerName = React.useMemo(
    () => (order.consumer.name ? order.consumer.name.split(' ')[0] : 'N/E'),
    [order.consumer.name]
  );
  // handlers
  const handleOrderDispatching = () => {
    if (order.fulfillment === 'delivery') {
      changeOrderStatus(order.id, 'dispatching');
    } else {
      changeOrderStatus(order.id, 'delivered');
    }
  };
  // UI
  if (order.status === 'ready') {
    return (
      <OrderBaseCard
        borderColor={activeBorderColor}
        borderWidth={
          order?.dispatchingStatus === 'outsourced'
            ? '2px'
            : isCurrierArrived
            ? '2px'
            : '1px'
        }
        color="black"
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
        zIndex="100"
        flags={order.flags}
      >
        <Link to={`${url}/${order.id}`}>
          <Box w="100%" h="100%" px="4" pt="4" pb="58px">
            <Flex flexDir="column" fontWeight="700">
              <Flex justifyContent="space-between">
                <Box maxW="70px">
                  <OrderCodeBox code={order.code} hasIssues={hasIssues} />
                  <Text fontSize="xs" lineHeight="lg" fontWeight="500">
                    {`{${consumerName}}`}
                  </Text>
                </Box>
                {order.fulfillment === 'delivery' ? (
                  <Box>
                    <Text
                      color={isCurrierArrived ? 'red' : 'gray.700'}
                      fontWeight="700"
                      textAlign="end"
                    >
                      {orderDispatchingKanbanItemText}
                    </Text>
                    {order?.dispatchingStatus === 'outsourced' && (
                      <Text mt="1" fontSize="xs" textAlign="end">
                        {t('Um entregador de outra rede fará a retirada.')}
                      </Text>
                    )}
                    {isMatched &&
                      (isCurrierArrived ? (
                        <Text color="black" fontSize="xs" fontWeight="500">
                          {t('Nome: ') + order.courier?.name}
                        </Text>
                      ) : (
                        <>
                          {showArrivalTime ? (
                            arrivalTime! > 0 ? (
                              <Text color="gray.700" fontWeight="500">
                                {t(
                                  `Aprox. ${
                                    arrivalTime! > 1
                                      ? arrivalTime + ' minutos'
                                      : arrivalTime + ' minuto'
                                  }`
                                )}
                              </Text>
                            ) : (
                              <Text color="gray.700" fontWeight="500">
                                {t(`Menos de 1 minuto`)}
                              </Text>
                            )
                          ) : (
                            <Text color="gray.700" fontWeight="500">
                              {t(`Calculando...`)}
                            </Text>
                          )}
                        </>
                      ))}
                  </Box>
                ) : (
                  <Box>
                    <Text color="gray.700" fontWeight="700" textAlign="end">
                      {t('Aguardando retirada')}
                    </Text>
                    <Text color="gray.700" fontWeight="700" textAlign="end">
                      {t('pelo cliente')}
                    </Text>
                  </Box>
                )}
              </Flex>
            </Flex>
          </Box>
        </Link>
        <Box position="absolute" w="100%" bottom="0" px="4" mb="4" zIndex="999">
          <Button
            isDisabled={
              order.fulfillment === 'delivery' &&
              !isCurrierArrived &&
              order?.dispatchingStatus !== 'outsourced'
            }
            w="full"
            maxH="34px"
            size="sm"
            fontSize="xs"
            onClick={handleOrderDispatching}
          >
            {t('Entregar pedido')}
          </Button>
        </Box>
      </OrderBaseCard>
    );
  }
  return (
    <Link to={`${url}/${order.id}`}>
      <OrderBaseCard
        px="4"
        py="2"
        borderColor={activeBorderColor}
        borderWidth={order?.dispatchingStatus === 'outsourced' ? '2px' : '1px'}
        color="black"
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
        flags={order.flags}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box maxW="70px">
            <OrderCodeBox code={order.code} hasIssues={hasIssues} />
            <Text fontSize="xs" lineHeight="lg" fontWeight="500">
              {`{${consumerName}}`}
            </Text>
          </Box>
          {order.dispatchingStatus === 'outsourced' ? (
            <Flex
              flexDir="column"
              color="gray.700"
              fontSize="xs"
              alignItems="flex-end"
            >
              <Text fontWeight="700">{t('A caminho da entrega')}</Text>
              <Text fontWeight="500">{t('Logística fora da rede')}</Text>
            </Flex>
          ) : (
            <Flex
              flexDir="column"
              color="gray.700"
              fontSize="xs"
              alignItems="flex-end"
            >
              <Text fontWeight="700">{orderDispatchingKanbanItemText}</Text>
              {showArrivalTime ? (
                arrivalTime! > 0 ? (
                  <Text color="gray.700" fontWeight="500">
                    {t(
                      `Aprox. ${
                        arrivalTime! > 1
                          ? arrivalTime + ' minutos'
                          : arrivalTime + ' minuto'
                      }`
                    )}
                  </Text>
                ) : (
                  <Text color="gray.700" fontWeight="500">
                    {t(`Menos de 1 minuto`)}
                  </Text>
                )
              ) : (
                showArrivalTimeCalc && (
                  <Text color="gray.700" fontWeight="500">
                    {t(`Calculando...`)}
                  </Text>
                )
              )}
            </Flex>
          )}
        </Flex>
      </OrderBaseCard>
    </Link>
  );
};
