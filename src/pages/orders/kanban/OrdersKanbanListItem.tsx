import { Box, Button, Flex, HStack, Progress, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { ReactComponent as Alarm } from 'common/img/alarm_outlined.svg';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';

interface Props {
  order: WithId<Order>;
}

export const OrdersKanbanListItem = ({ order }: Props) => {
  const { url } = useRouteMatch();
  const { confirm, ready, dispatching } = useOrdersContext();

  const hasCurrier = order.code && parseInt(order.code) > 3 ? true : false;
  const wasDelivered = order.code && parseInt(order.code) > 6 ? true : false;

  if (order.status === 'dispatching') {
    return (
      <Box
        px="4"
        py={wasDelivered ? '3' : '2'}
        borderRadius="lg"
        borderColor={wasDelivered ? 'gray' : 'black'}
        borderWidth="1px"
        color={wasDelivered ? 'gray' : 'black'}
        bgColor={wasDelivered ? 'gray.500' : 'white'}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="700">
            #{order.code}
          </Text>
          <Flex flexDir="column" color="gray.700" fontSize="xs" alignItems="flex-end">
            {wasDelivered ? (
              <Text fontWeight="700">{t('Pedido entregue')}</Text>
            ) : (
              <>
                <Text fontWeight="700">{t('Entregador à caminho')}</Text>
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
      <Box p="4" borderRadius="lg" borderColor="black" borderWidth="1px" color="black">
        <Flex flexDir="column" fontWeight="700">
          <Flex justifyContent="space-between">
            <Text fontSize="lg">#{order.code}</Text>
            <Flex flexDir="column" fontSize="xs" alignItems="flex-end">
              {hasCurrier ? (
                <>
                  <Text color="black" fontWeight="700">
                    {t('Entregador no local')}
                  </Text>
                  <Text color="black" fontWeight="500">
                    {t('Nome: João')}
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
          isDisabled={!hasCurrier}
          mt="2"
          w="full"
          maxH="34px"
          siz="xs"
          fontSize="xs"
          onClick={() => dispatching(order.code)}
        >
          {t('Entregar pedido')}
        </Button>
      </Box>
    );
  }

  if (order.status === 'preparing') {
    return (
      <Box p="4" borderRadius="lg" borderColor="black" borderWidth="1px" color="black">
        <Flex flexDir="column" fontWeight="700">
          <Flex justifyContent="space-between">
            <Text fontSize="lg">#{order.code}</Text>
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
          onClick={() => ready(order.code)}
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
        borderWidth="1px"
        color="black"
        //onClick={() => confirm(order.code)}
        cursor="pointer"
      >
        <Box>
          <Flex>
            <Text fontWeight="700">#{order.code}</Text>
          </Flex>
        </Box>
      </Box>
    </Link>
  );
};
