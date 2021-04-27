import { Box } from '@chakra-ui/react';
import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { OrderBaseDrawer } from './OrderBaseDrawer';

interface ConsumerDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const BackofficeOrderDrawer = ({ onClose, ...props }: ConsumerDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  // helpers

  //handlers

  // side effects

  //UI
  return (
    <ConsumerProvider>
      <OrderBaseDrawer agent={{ id: agent?.id, name: username }} onClose={onClose} {...props}>
        <Switch>
          <Route exact path={`${path}`}>
            <Box>GERAL</Box>
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
