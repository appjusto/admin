import { Box, Circle, Flex, Text } from '@chakra-ui/react';
import { Order } from 'appjusto-types';
import React from 'react';

interface Props {
  title: string;
  orders: Order[];
}

export const OrdersKanbanList = ({ title, orders }: Props) => {
  return (
    <Box
      w={['272px', '306px', '272px']}
      h={['452px']}
      borderRadius="lg"
      borderColor="gray.500"
      borderWidth="1px"
      borderTopWidth="0px"
    >
      <Box
        h={['60px']}
        p="2"
        bg="gray.50"
        borderColor="gray.500"
        borderTopWidth="1px"
        borderTopRadius="lg"
        borderBottomWidth="1px"
      >
        <Flex alignItems="center">
          <Circle size={['40px']} bg="white">
            <Text fontSize="lg" color="black">
              {orders.length}
            </Text>
          </Circle>
          <Text ml="4" fontSize="lg" color="black" fontWeight="bold">
            {title}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
