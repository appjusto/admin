import { useContextAgentProfile } from 'app/state/agent/context';
import { ConsumerProvider } from 'app/state/consumer/context';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ConsumerBaseDrawer } from './ConsumerBaseDrawer';
import { ConsumerOrders } from './ConsumerOrders';
import { ConsumerStatus } from './ConsumerStatus';
import { PersonalProfile } from './PersonalProfile';

interface ConsumerDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const ConsumerDrawer = ({ onClose, ...props }: ConsumerDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  //UI
  return (
    <ConsumerProvider>
      <ConsumerBaseDrawer agent={{ id: agent?.id, name: username }} onClose={onClose} {...props}>
        <Switch>
          <Route exact path={`${path}`}>
            <PersonalProfile />
          </Route>
          <Route exact path={`${path}/orders`}>
            <ConsumerOrders />
          </Route>
          <Route exact path={`${path}/status`}>
            <ConsumerStatus />
          </Route>
        </Switch>
      </ConsumerBaseDrawer>
    </ConsumerProvider>
  );
};
