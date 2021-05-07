import { useContextAgentProfile } from 'app/state/agent/context';
import { CourierProvider } from 'app/state/courier/context';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CourierBaseDrawer } from './CourierBaseDrawer';
import { CourierRegister } from './CourierRegister';
import { CourierStatus } from './status/CourierStatus';

interface CourierDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const CourierDrawer = ({ onClose, ...props }: CourierDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  //UI
  return (
    <CourierProvider>
      <CourierBaseDrawer agent={{ id: agent?.id, name: username }} onClose={onClose} {...props}>
        <Switch>
          <Route exact path={`${path}`}>
            <CourierRegister />
          </Route>
          <Route exact path={`${path}/status`}>
            <CourierStatus />
          </Route>
        </Switch>
      </CourierBaseDrawer>
    </CourierProvider>
  );
};
