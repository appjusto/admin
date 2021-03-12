import { Box } from '@chakra-ui/react';
import Container from 'common/components/Container';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { OrdersContextProvider } from '../context';
import { OrderDrawer } from '../drawers/orderdrawer';
import { OrdersHistory } from './OrdersHistory';

const OrdersHistoryPage = () => {
  const { path } = useRouteMatch();
  const history = useHistory();
  const closeDrawerHandler = () => history.replace(path);
  return (
    <OrdersContextProvider>
      <Box>
        <Container maxW={{ base: '100%', md: '740px', lg: '1260px' }}>
          <OrdersHistory />
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

export default OrdersHistoryPage;
