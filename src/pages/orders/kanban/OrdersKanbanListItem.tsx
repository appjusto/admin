import { Box, Flex, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import React from 'react';

interface Props {
  order: WithId<Order>;
}

export const OrdersKanbanListItem = ({ order }: Props) => {
  return (
    <Box p="4" borderRadius="lg" borderColor="gray.500" borderWidth="1px">
      <Box>
        <Flex>
          <Text fontWeight="700">{order.code}</Text>
        </Flex>
      </Box>
    </Box>
  );
};
