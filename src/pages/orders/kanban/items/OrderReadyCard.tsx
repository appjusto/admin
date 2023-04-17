import { Order, WithId } from '@appjusto/types';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useOrderArrivalTimes } from 'app/api/order/useOrderArrivalTimes';
import { useOrderDeliveryInfos } from 'app/api/order/useOrderDeliveryInfos';
import { useOrdersContext } from 'app/state/order';
import { useContextServerTime } from 'app/state/server-time';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';

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
  const logisticsIncluded = React.useMemo(
    () => order.fare?.courier?.payee === 'platform',
    [order.fare?.courier?.payee]
  );
  const isDelivery = React.useMemo(
    () => order.fulfillment === 'delivery',
    [order.fulfillment]
  );
  const isOutsourced = React.useMemo(
    () => order?.dispatchingStatus === 'outsourced',
    [order?.dispatchingStatus]
  );
  const showArrivalTime = React.useMemo(
    () =>
      typeof arrivalTime === 'number' &&
      order.dispatchingState &&
      !['arrived-pickup', 'arrived-destination'].includes(
        order.dispatchingState
      ),
    [arrivalTime, order.dispatchingState]
  );
  const showArrivalTimeCalc = React.useMemo(
    () =>
      order.dispatchingState &&
      !['arrived-pickup', 'arrived-destination'].includes(
        order.dispatchingState
      ),
    [order.dispatchingState]
  );
  const consumerName = React.useMemo(
    () => (order.consumer.name ? order.consumer.name.split(' ')[0] : 'N/E'),
    [order.consumer.name]
  );
  const btnIsDisabled = React.useMemo(
    () => logisticsIncluded && isDelivery && !isCurrierArrived && !isOutsourced,
    [logisticsIncluded, isDelivery, isCurrierArrived, isOutsourced]
  );
  const readyBtnLabel = React.useMemo(() => {
    if (isDelivery) return 'Despachar pedido';
    return 'Entrega realizada';
  }, [isDelivery]);
  // handlers
  const handleOrderDispatching = React.useCallback(() => {
    if (isDelivery) {
      changeOrderStatus(order.id, 'dispatching');
    } else {
      changeOrderStatus(order.id, 'delivered');
    }
  }, [isDelivery, changeOrderStatus, order.id]);
  // UI
  if (order.status === 'ready') {
    return (
      <Box
        position="relative"
        borderRadius="lg"
        borderColor={
          isOutsourced ? '#FFBE00' : isCurrierArrived ? 'black' : 'gray'
        }
        borderWidth={isOutsourced ? '2px' : isCurrierArrived ? '2px' : '1px'}
        color="black"
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
        zIndex="100"
      >
        <Link to={`${url}/${order.id}`}>
          <Box w="100%" h="100%" px="4" pt="4" pb="58px">
            <Flex flexDir="column" fontWeight="700">
              <Flex justifyContent="space-between">
                <Box maxW="70px">
                  <Text fontSize="lg" fontWeight="700">
                    #{order.code}
                  </Text>
                  <Text fontSize="xs" lineHeight="lg" fontWeight="500">
                    {`{${consumerName}}`}
                  </Text>
                </Box>
                {isDelivery && logisticsIncluded && (
                  <Box>
                    <Text
                      color={isCurrierArrived ? 'red' : 'gray.700'}
                      fontWeight="700"
                      textAlign="end"
                    >
                      {orderDispatchingKanbanItemText}
                    </Text>
                    {isOutsourced && (
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
                )}
                {isDelivery && !logisticsIncluded && (
                  <Box>
                    <Text color="gray.700" fontWeight="700" textAlign="end">
                      {t('Aguardando')}
                    </Text>
                    <Text color="gray.700" fontWeight="700" textAlign="end">
                      {t('entregador próprio')}
                    </Text>
                  </Box>
                )}
                {!isDelivery && (
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
            w="full"
            maxH="34px"
            size="sm"
            fontSize="xs"
            onClick={handleOrderDispatching}
            isDisabled={btnIsDisabled}
          >
            {t(readyBtnLabel)}
          </Button>
        </Box>
      </Box>
    );
  }
  return (
    <Link to={`${url}/${order.id}`}>
      <Box
        px="4"
        py="2"
        borderRadius="lg"
        borderColor={isOutsourced ? '#FFBE00' : 'gray'}
        borderWidth={isOutsourced ? '2px' : '1px'}
        color="black"
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box maxW="70px">
            <Text fontSize="lg" fontWeight="700">
              #{order.code}
            </Text>
            <Text fontSize="xs" lineHeight="lg" fontWeight="500">
              {`{${consumerName}}`}
            </Text>
          </Box>
          {!logisticsIncluded && (
            <Flex
              flexDir="column"
              color="gray.700"
              fontSize="xs"
              alignItems="flex-end"
            >
              <Text fontWeight="700">{t('A caminho da entrega')}</Text>
              <Text fontWeight="500">{t('Entrega própria')}</Text>
            </Flex>
          )}
          {logisticsIncluded && isOutsourced && (
            <Flex
              flexDir="column"
              color="gray.700"
              fontSize="xs"
              alignItems="flex-end"
            >
              <Text fontWeight="700">{t('A caminho da entrega')}</Text>
              <Text fontWeight="500">{t('Logística fora da rede')}</Text>
            </Flex>
          )}
          {logisticsIncluded && !isOutsourced && (
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
      </Box>
    </Link>
  );
};
