import { Box, Flex, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import React from 'react';
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
  return (
    <Box
      p="4"
      borderRadius="lg"
      borderColor="gray.500"
      borderWidth="1px"
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
