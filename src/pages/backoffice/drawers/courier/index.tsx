import { useCourierPrivateData } from 'app/api/courier/useCourierPrivateData';
import { useCourierProfile } from 'app/api/courier/useCourierProfile';
import { useCourierProfilePictures } from 'app/api/courier/useCourierProfilePictures';
import { useContextAgentProfile } from 'app/state/agent/context';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { StatusTab } from '../tabs/StatusTab';
import { CourierBaseDrawer } from './CourierBaseDrawer';
import { CourierRegister } from './CourierRegister';

interface CourierDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  courierId: string;
};

export const CourierDrawer = ({ onClose, ...props }: CourierDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { courierId } = useParams<Params>();
  const courier = useCourierProfile(courierId);
  const pictures = useCourierProfilePictures(courierId);
  const { agent, username } = useContextAgentProfile();

  const platform = useCourierPrivateData(courierId);

  //handlers
  const marketPlaceIssues = platform?.marketPlace?.issues ?? undefined;

  // side effects
  console.log('courier', courier);
  console.log('platform', platform);
  //UI
  return (
    <CourierBaseDrawer
      agent={{ id: agent?.id, name: username }}
      courier={courier}
      onClose={onClose}
      {...props}
    >
      <Switch>
        <Route exact path={`${path}`}>
          <CourierRegister
            profile={courier}
            pictures={pictures}
            updateProfile={() => {}}
            result={{ isError: false, isSuccess: false, isLoading: false }}
          />
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
  );
};
