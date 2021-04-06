import { Box } from '@chakra-ui/react';
import { useFirebaseUserRole } from 'app/api/auth/useFirebaseUserRole';
import { useContextBusiness } from 'app/state/business/context';
import Container from 'common/components/Container';
import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { OrdersContextProvider } from './context';
import { OrderAcceptanceTimeDrawer } from './drawers/OrderAcceptanceTimeDrawer';
import { OrderDrawer } from './drawers/orderdrawer';
import { OrdersKanban } from './kanban/OrdersKanban';
import { OrdersHeader } from './OrdersHeader';

const OrdersPage = () => {
  // context
  const { isStaff } = useFirebaseUserRole();
  const { business } = useContextBusiness();
  const { path } = useRouteMatch();
  const history = useHistory();
  // handlers
  const closeDrawerHandler = () => history.replace(path);
  if (business?.situation !== 'approved') {
    return <Redirect to="/app" push />;
  }
  return (
    <OrdersContextProvider>
      <Box mt={isStaff ? '80px' : '0'}>
        <OrdersHeader />
        <Container maxW={{ base: '100%', md: '740px', lg: '1260px' }}>
          <OrdersKanban />
        </Container>
      </Box>
      <Switch>
        <Route exact path={`${path}/acceptance-time`}>
          <OrderAcceptanceTimeDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/:orderId`}>
          <OrderDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </OrdersContextProvider>
  );
};

export default OrdersPage;
