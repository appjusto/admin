import { Box, Button, Flex, HStack, Progress, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { ReactComponent as Alarm } from 'common/img/alarm_outlined.svg';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getLocalStorageOrderTime, getTimeUntilNow } from 'utils/functions';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';

interface CodeLinkProps {
  url: string;
  orderId: string;
  code?: string;
}

const CodeLink = ({ url, orderId, code }: CodeLinkProps) => {
  return (
    <Link to={`${url}/${orderId}`}>
      <Text fontSize="lg" textDecor="underline" _hover={{ color: 'green.700' }}>
        #{code}
      </Text>
    </Link>
  );
};

interface Props {
  order: WithId<Order>;
}

export const OrdersKanbanListItem = ({ order }: Props) => {
  // context
  const { url } = useRouteMatch();
  const { business, changeOrderStatus } = useOrdersContext();
  // state
  const [elapsedTime, setElapsedTime] = React.useState<number | null>(0);

  // handlers
  const isCurrierArrived = order.dispatchingState === 'arrived-pickup';
  const wasDelivered = order.status === 'delivered';

  React.useEffect(() => {
    const localOrderTime = getLocalStorageOrderTime(order.id);
    const setNewTime = () => {
      if (localOrderTime) {
        let time = getTimeUntilNow(localOrderTime);
        setElapsedTime(time);
      } else {
        setElapsedTime(null);
      }
    };
    setNewTime();
    const timeInterval = setInterval(setNewTime, 60000);
    if (order.status !== 'confirming') return clearInterval(timeInterval);
    return () => clearInterval(timeInterval);
  }, [order.status]);

  React.useEffect(() => {
    const orderAcceptanceTime = business?.orderAcceptanceTime;
    if (order?.status === 'confirming') {
      if (elapsedTime && orderAcceptanceTime && orderAcceptanceTime <= elapsedTime) {
        changeOrderStatus(order.id, 'preparing');
      }
    }
  }, [elapsedTime]);

  if (order.status === 'canceled') {
    console.log(order);
    return (
      <Box
        px="4"
        py="2"
        borderRadius="lg"
        borderColor="gray"
        borderWidth="1px"
        color="gray"
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <CodeLink url={url} orderId={order.id} code={order.code} />
          <Flex flexDir="column" color="gray.700" fontSize="xs" alignItems="flex-end">
            <Text fontWeight="500">{t('Cancelado por')}</Text>
            <Text fontWeight="700">{t('Cliente')}</Text>
          </Flex>
        </Flex>
      </Box>
    );
  }

  if (order.status === 'dispatching') {
    return (
      <Box
        px="4"
        py={wasDelivered ? '3' : '2'}
        borderRadius="lg"
        borderColor="gray"
        borderWidth="1px"
        color={wasDelivered ? 'gray' : 'black'}
        bgColor={wasDelivered ? 'gray.500' : 'white'}
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <CodeLink url={url} orderId={order.id} code={order.code} />
          <Flex flexDir="column" color="gray.700" fontSize="xs" alignItems="flex-end">
            {wasDelivered ? (
              <Text fontWeight="700">{t('Pedido entregue')}</Text>
            ) : (
              <>
                <Text fontWeight="700">{t('Pedido à caminho')}</Text>
                <Text fontWeight="500">{t('Aprox. 10 minutos')}</Text>
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    );
  }

  if (order.status === 'ready') {
    return (
      <Box
        p="4"
        borderRadius="lg"
        borderColor={isCurrierArrived ? 'black' : 'gray'}
        borderWidth={isCurrierArrived ? '2px' : '1px'}
        color="black"
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
      >
        <Flex flexDir="column" fontWeight="700">
          <Flex justifyContent="space-between">
            <CodeLink url={url} orderId={order.id} code={order.code} />
            <Flex flexDir="column" fontSize="xs" alignItems="flex-end">
              {isCurrierArrived ? (
                <>
                  <Text color="black" fontWeight="700">
                    {t('Entregador no local')}
                  </Text>
                  <Text color="black" fontWeight="500">
                    {t('Nome: ') + order.courier?.name}
                  </Text>
                </>
              ) : (
                <>
                  <Text color="gray.700" fontWeight="700">
                    {t('Entregador à caminho')}
                  </Text>
                  <Text color="gray.700" fontWeight="500">
                    {t('Aprox. 10 minutos')}
                  </Text>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Button
          isDisabled={!isCurrierArrived}
          mt="2"
          w="full"
          maxH="34px"
          siz="xs"
          fontSize="xs"
          onClick={() => changeOrderStatus(order.id, 'dispatching')}
        >
          {t('Entregar pedido')}
        </Button>
      </Box>
    );
  }

  if (order.status === 'preparing') {
    return (
      <Box
        p="4"
        borderRadius="lg"
        borderColor="black"
        borderWidth="2px"
        color="black"
        boxShadow="0px 8px 16px -4px rgba(105,118,103,0.1)"
      >
        <Flex flexDir="column" fontWeight="700">
          <Flex justifyContent="space-between">
            <CodeLink url={url} orderId={order.id} code={order.code} />
            <Flex flexDir="column">
              <HStack spacing={2}>
                <HStack spacing={1}>
                  <Alarm />
                  <Text fontSize="xs">10 min</Text>
                </HStack>
                <Text fontSize="xs" color="gray.700">
                  15 min
                </Text>
              </HStack>
              <Progress
                mt="1"
                ml="22px"
                w="80px"
                size="sm"
                value={66}
                colorScheme="green"
                borderRadius="lg"
              />
            </Flex>
          </Flex>
        </Flex>
        <Button
          mt="3"
          w="full"
          maxH="34px"
          siz="xs"
          fontSize="xs"
          onClick={() => changeOrderStatus(order.id, 'ready')}
        >
          {t('Pedido pronto')}
        </Button>
      </Box>
    );
  }
  return (
    <Link to={`${url}/${order.id}`}>
      <Box
        p="4"
        bg="green.300"
        borderRadius="lg"
        borderColor="black"
        borderWidth="2px"
        color="black"
        cursor="pointer"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="700">
            #{order.code}
          </Text>
          {elapsedTime !== null ? (
            elapsedTime > 0 ? (
              <Text fontSize="sm">{t(`${elapsedTime} min. atrás`)}</Text>
            ) : (
              <Text fontSize="sm">{t(`Agora`)}</Text>
            )
          ) : (
            <Text fontSize="sm">{t(`Tempo não encontrado`)}</Text>
          )}
        </Flex>
      </Box>
    </Link>
  );
};
