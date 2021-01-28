import { Box, Circle, Flex, Stack, Text } from '@chakra-ui/react';
import { Order, WithId } from 'appjusto-types';
import { ShowIf } from 'core/components/ShowIf';
import React from 'react';
import { OrdersKanbanListItem } from './OrdersKanbanListItem';

interface Props {
  title: string;
  orders: WithId<Order>[];
  details?: string;
}

export const OrdersKanbanList = ({ title, orders, details }: Props) => {
  return (
    <Flex
      w="100%"
      maxW="300px"
      h={['500px']}
      borderRadius="lg"
      borderColor="gray.500"
      borderWidth="1px"
      borderTopWidth="0px"
      direction="column"
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
      <ShowIf test={orders.length === 0 && Boolean(details)}>
        {() => (
          <Flex flex={1} p="6" alignItems="center">
            <Text fontSize="sm" textColor="gray.700" align="center">
              {details}
            </Text>
          </Flex>
        )}
      </ShowIf>
      <ShowIf test={orders.length > 0}>
        {() => (
          <Stack flex={1} p="4" overflowX="hidden">
            {orders.map((order) => (
              <OrdersKanbanListItem key={order.code} order={order} />
            ))}
          </Stack>
        )}
      </ShowIf>
    </Flex>
  );
};
