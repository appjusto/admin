import { Box } from '@chakra-ui/react';
import { useOrder } from 'app/api/order/useOrder';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { OrderBaseDrawer } from './OrderBaseDrawer';
import { Participants } from './Participants';

interface ConsumerDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  orderId: string;
};

export const BackofficeOrderDrawer = ({ onClose, ...props }: ConsumerDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  const { orderId } = useParams<Params>();
  const order = useOrder(orderId);

  // helpers

  //handlers

  // side effects

  //UI
  return (
    <ConsumerProvider>
      <OrderBaseDrawer
        agent={{ id: agent?.id, name: username }}
        order={order}
        onClose={onClose}
        {...props}
      >
        <Switch>
          <Route exact path={`${path}`}>
            <Participants order={order} />
          </Route>
          <Route exact path={`${path}/order`}>
            <Box>PEDIDO</Box>
          </Route>
          <Route exact path={`${path}/status`}>
            <Box>STATUS</Box>
          </Route>
        </Switch>
      </OrderBaseDrawer>
    </ConsumerProvider>
  );
};
