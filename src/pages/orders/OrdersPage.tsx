import { Box } from '@chakra-ui/react';
import { useContextBusiness } from 'app/state/business/context';
import { useOrdersContext } from 'app/state/order';
import { useContextStaffProfile } from 'app/state/staff/context';
import Container from 'common/components/Container';
import { ChatDrawer } from 'pages/chat/ChatDrawer';
import React from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { BusinessStatusDrawer } from './drawers/BusinessStatusDrawer';
import { OrderAcceptanceTimeDrawer } from './drawers/OrderAcceptanceTimeDrawer';
import { OrderDrawer } from './drawers/orderdrawer';
import { OrdersKanban } from './kanban/OrdersKanban';
import { OrdersHeader } from './OrdersHeader';

const OrdersPage = () => {
  // context
  const { isBackofficeUser } = useContextStaffProfile();
  const { business } = useContextBusiness();
  const { scheduledOrders } = useOrdersContext();
  const { path } = useRouteMatch();
  const history = useHistory();
  // helpers
  const isScheduledOrders = scheduledOrders.length > 0;
  // handlers
  const closeDrawerHandler = React.useCallback(
    () => history.replace(path),
    [history, path]
  );
  // side effects
  React.useEffect(() => {
    window?.scrollTo(0, 0);
  }, []);
  // UI
  if (business?.situation !== 'approved') {
    return <Redirect to="/app" push />;
  }
  return (
    <>
      <Box mt={isBackofficeUser ? '80px' : '0'}>
        <OrdersHeader />
        <Container
          maxW={{
            base: '100%',
            md: '740px',
            lg: isScheduledOrders ? '1460px' : '1260px',
          }}
        >
          <OrdersKanban />
        </Container>
      </Box>
      <Switch>
        <Route exact path={`${path}/acceptance-time`}>
          <OrderAcceptanceTimeDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route exact path={`${path}/business-status`}>
          <BusinessStatusDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/chat/:orderId/:counterpartId`}>
          <ChatDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
        <Route path={`${path}/:orderId`}>
          <OrderDrawer isOpen onClose={closeDrawerHandler} />
        </Route>
      </Switch>
    </>
  );
};

export default OrdersPage;
