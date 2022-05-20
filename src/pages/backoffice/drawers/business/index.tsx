import { BusinessBOProvider } from 'app/state/business/businessBOContext';
import { useContextStaffProfile } from 'app/state/staff/context';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ManagerBaseDrawer } from '../manager/ManagerBaseDrawer';
import { BusinessBaseDrawer } from './BusinessBaseDrawer';
import { BusinessIugu } from './BusinessIugu';
import { BusinessManagers } from './BusinessManagers';
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
  const { staff, username } = useContextStaffProfile();
  //UI
  return (
    <BusinessBOProvider>
      <BusinessBaseDrawer staff={{ id: staff?.id, name: username }} onClose={onClose} {...props}>
        <Switch>
          <Route exact path={`${path}`}>
            <BusinessRegister />
          </Route>
          <Route exact path={`${path}/managers`}>
            <BusinessManagers />
          </Route>
          <Route exact path={`${path}/managers/:managerId`}>
            <ManagerBaseDrawer onClose={onClose} {...props} />
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
