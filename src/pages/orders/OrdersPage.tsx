import { Box } from '@chakra-ui/react';
import Container from 'common/components/Container';
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { OrdersContextProvider } from './context';
import { OrderDrawer } from './drawers/orderdrawer';
import { OrdersKanban } from './kanban/OrdersKanban';
import { OrdersHeader } from './OrdersHeader';

const OrdersPage = () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const closeDrawerHandler = () => history.replace(path);
  return (
    <OrdersContextProvider>
      <Box>
        <OrdersHeader />
        <Container maxW={{ base: '100%', md: '740px', lg: '1260px' }}>
          <OrdersKanban />
        </Container>
      </Box>
      <Switch>
        <Route path={`${path}/:orderId`}>
          <OrderDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </OrdersContextProvider>
  );
};

export default OrdersPage;
