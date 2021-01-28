import { Box, Button, Flex, HStack, Progress, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { ReactComponent as Alarm } from 'common/img/alarm_outlined.svg';
import React from 'react';
import { t } from 'utils/i18n';
import { useOrdersContext } from '../context';

interface Props {
  order: WithId<Order>;
}

export const OrdersKanbanListItem = ({ order }: Props) => {
  const { confirm, ready, dispatching, delivered } = useOrdersContext();
  const handleStateChange = () => {
    if (order.status === 'confirming') {
      confirm(order.code);
    } else if (order.status === 'preparing') {
      ready(order.code);
    } else if (order.status === 'ready') {
      dispatching(order.code);
    } else if (order.status === 'dispatching') {
      delivered(order.code);
    }
  };

  if (order.status === 'dispatching') {
    return (
      <Box px="4" py="2" borderRadius="lg" borderColor="black" borderWidth="1px" color="black">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="700">
            #{order.code}
          </Text>
          <Flex flexDir="column" color="gray.700" fontSize="xs" alignItems="flex-end">
            <Text fontWeight="700">{t('Entregador à caminho')}</Text>
            <Text fontWeight="500">{t('Aprox. 10 minutos')}</Text>
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
            <Flex flexDir="column" color="gray.700" fontSize="xs" alignItems="flex-end">
              <Text fontWeight="700">{t('Entregador à caminho')}</Text>
              <Text fontWeight="500">{t('Aprox. 10 minutos')}</Text>
            </Flex>
          </Flex>
        </Flex>
        <Button
          isDisabled
          mt="4"
          w="full"
          maxH="34px"
          siz="xs"
          fontSize="xs"
          onClick={handleStateChange}
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
        <Button mt="4" w="full" maxH="34px" siz="xs" fontSize="xs" onClick={handleStateChange}>
          {t('Pedido pronto')}
        </Button>
      </Box>
    );
  }
  return (
    <Box
      p="4"
      bg="green.300"
      borderRadius="lg"
      borderColor="black"
      borderWidth="1px"
      color="black"
      onClick={handleStateChange}
      cursor="pointer"
    >
      <Box>
        <Flex>
          <Text fontWeight="700">#{order.code}</Text>
        </Flex>
      </Box>
    </Box>
  );
};
