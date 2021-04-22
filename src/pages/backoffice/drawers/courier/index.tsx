import { useBusinessPrivateData } from 'app/api/business/useBusinessPrivateData';
import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import { UserProfile } from 'appjusto-types';
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
  const { setBusinessId, business } = useContextBusiness();
  const { agent, username } = useContextAgentProfile();
  const { manager, setManagerEmail } = useContextManagerProfile();
  const platform = useBusinessPrivateData(courierId);

  //handlers
  const marketPlaceIssues = platform?.marketPlace?.issues ?? undefined;

  // side effects
  React.useEffect(() => {
    if (courierId) setBusinessId(courierId);
  }, [courierId, setBusinessId]);

  React.useEffect(() => {
    if (business && business?.managers) {
      setManagerEmail(business?.managers[0]);
    }
  }, [business, setManagerEmail]);

  //UI
  return (
    <CourierBaseDrawer
      agent={{ id: agent?.id, name: username }}
      business={business}
      managerName={manager?.name ?? 'Sem nome'}
      onClose={onClose}
      {...props}
    >
      <Switch>
        <Route exact path={`${path}`}>
          <CourierRegister
            profile={{} as UserProfile}
            updateProfile={() => {}}
            result={{ isError: false, isSuccess: false, isLoading: false }}
          />
        </Route>
        <Route exact path={`${path}/status`}>
          <StatusTab
            situation={business?.situation}
            marketPlaceIssues={marketPlaceIssues}
            profileIssues={business?.profileIssues}
            updateProfile={() => {}}
            result={{ isError: false, isSuccess: false, isLoading: false }}
          />
        </Route>
      </Switch>
    </CourierBaseDrawer>
  );
};
