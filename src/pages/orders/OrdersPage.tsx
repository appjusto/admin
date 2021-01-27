import { Box } from '@chakra-ui/react';
import Container from 'common/components/Container';
import React from 'react';
import { OrdersKanban } from './kanban/OrdersKanban';
import { OrdersHeader } from './OrdersHeader';

const OrdersPage = () => {
  return (
    <Box>
      <OrdersHeader />
      <Container>
        <OrdersKanban />
      </Container>
    </Box>
  );
};

export default OrdersPage;
