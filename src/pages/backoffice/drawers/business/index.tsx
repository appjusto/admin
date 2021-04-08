import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { BusinessBaseDrawer } from './BusinessBaseDrawer';
import { BusinessLive } from './Live';
import { BusinessRegister } from './Register';
import { BusinessStatus } from './Status';

interface BusinessDrawerProps {
  isOpen: boolean;
  onClose(): void;
}

type Params = {
  businessId: string;
};

export const BusinessDrawer = ({ onClose, ...props }: BusinessDrawerProps) => {
  //context
  const { path } = useRouteMatch();
  const { businessId } = useParams<Params>();
  const { setBusinessId, business } = useContextBusiness();
  const { agent, username } = useContextAgentProfile();
  const { manager, setManagerEmail } = useContextManagerProfile();

  //handlers

  // side effects
  React.useEffect(() => {
    if (businessId) setBusinessId(businessId);
  }, [businessId, setBusinessId]);

  React.useEffect(() => {
    if (business && business?.managers) {
      setManagerEmail(business?.managers[0]);
    }
  }, [business, setManagerEmail]);

  //UI
  return (
    <BusinessBaseDrawer
      agent={{ id: agent?.id, name: username }}
      business={business}
      managerName={manager?.name ?? 'Sem nome'}
      onClose={onClose}
      {...props}
    >
      <Switch>
        <Route exact path={`${path}`}>
          <BusinessRegister />
        </Route>
        <Route exact path={`${path}/live`}>
          <BusinessLive status={business?.status} enabled={business?.enabled} />
        </Route>
        <Route exact path={`${path}/status`}>
          <BusinessStatus situation={business?.situation} />
        </Route>
      </Switch>
    </BusinessBaseDrawer>
  );
};
