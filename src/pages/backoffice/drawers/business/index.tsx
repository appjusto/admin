import { useContextAgentProfile } from 'app/state/agent/context';
import { BusinessBOProvider } from 'app/state/business/businessBOContext';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { BusinessBaseDrawer } from './BusinessBaseDrawer';
import { BusinessIugu } from './BusinessIugu';
import { BusinessRegister } from './BusinessRegister';
import { BusinessLive } from './Live';
import { StatusTab } from './StatusTab';

interface BusinessDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const BusinessDrawer = ({ onClose, ...props }: BusinessDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  //UI
  return (
    <BusinessBOProvider>
      <BusinessBaseDrawer agent={{ id: agent?.id, name: username }} onClose={onClose} {...props}>
        <Switch>
          <Route exact path={`${path}`}>
            <BusinessRegister />
          </Route>
          <Route exact path={`${path}/live`}>
            <BusinessLive />
          </Route>
          <Route exact path={`${path}/status`}>
            <StatusTab />
          </Route>
          <Route exact path={`${path}/iugu`}>
            <BusinessIugu />
          </Route>
        </Switch>
      </BusinessBaseDrawer>
    </BusinessBOProvider>
  );
};
