import { useContextAgentProfile } from 'app/state/agent/context';
import { CourierProvider, useContextCourierProfile } from 'app/state/courier/context';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { StatusTab } from '../tabs/StatusTab';
import { CourierBaseDrawer } from './CourierBaseDrawer';
import { CourierRegister } from './CourierRegister';

interface CourierDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

export const CourierDrawer = ({ onClose, ...props }: CourierDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { agent, username } = useContextAgentProfile();
  const { courier, pictures, marketPlaceIssues } = useContextCourierProfile();
  // helpers

  //handlers

  // side effects

  //UI
  return (
    <CourierProvider>
      <CourierBaseDrawer agent={{ id: agent?.id, name: username }} onClose={onClose} {...props}>
        <Switch>
          <Route exact path={`${path}`}>
            <CourierRegister />
          </Route>
          <Route exact path={`${path}/status`}>
            <StatusTab
              situation={courier?.situation}
              marketPlaceIssues={marketPlaceIssues}
              profileIssues={courier?.profileIssues}
              updateProfile={() => {}}
              result={{ isError: false, isSuccess: false, isLoading: false }}
            />
          </Route>
        </Switch>
      </CourierBaseDrawer>
    </CourierProvider>
  );
};
