import { Box } from '@chakra-ui/react';
import Container from 'common/components/Container';
import React from 'react';
import { OrdersContextProvider } from './context';
import { OrdersKanban } from './kanban/OrdersKanban';
import { OrdersHeader } from './OrdersHeader';

const OrdersPage = () => {
  return (
    <OrdersContextProvider>
      <Box>
        <OrdersHeader />
        <Container>
          <OrdersKanban />
        </Container>
      </Box>
    </OrdersContextProvider>
  );
};

export default OrdersPage;
