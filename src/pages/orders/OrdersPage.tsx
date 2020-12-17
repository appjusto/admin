import { Box, Center } from '@chakra-ui/react';
import React from 'react';
import { OrdersKanban } from './kanban/OrdersKanban';
import { OrdersHeader } from './OrdersHeader';

const OrdersPage = () => {
  return (
    <Box>
      <OrdersHeader />
      <Center w="100%">
        <OrdersKanban />
      </Center>
    </Box>
  );
};

export default OrdersPage;
