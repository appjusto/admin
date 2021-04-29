import { useBusinessProfile } from 'app/api/business/profile/useBusinessProfile';
import { useBusinessPrivateData } from 'app/api/business/useBusinessPrivateData';
import { useContextAgentProfile } from 'app/state/agent/context';
import { useContextBusiness } from 'app/state/business/context';
import { useContextManagerProfile } from 'app/state/manager/context';
import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { StatusTab } from '../tabs/StatusTab';
import { BusinessBaseDrawer } from './BusinessBaseDrawer';
import { BusinessRegister } from './BusinessRegister';
import { BusinessLive } from './Live';

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
  const platform = useBusinessPrivateData(businessId);
  const { updateBusinessProfile, updateResult: result } = useBusinessProfile();

  // state
  /*const [profile, dispatch] = React.useReducer(businessBOReducer, {} as WithId<Business>);
  const [validation, setValidation] = React.useState({
    cpf: true,
    cnpj: true,
    agency: true,
    account: true,
  });*/

  //handlers
  const marketPlaceIssues = platform?.marketPlace?.issues ?? undefined;

  // side effects
  React.useEffect(() => {
    if (businessId) setBusinessId(businessId);
  }, [businessId, setBusinessId]);

  React.useEffect(() => {
    if (business && business?.managers) {
      setManagerEmail(business?.managers[0] ?? null);
    } else setManagerEmail(null);
  }, [business, setManagerEmail]);

  React.useEffect(() => {
    if (businessId) setBusinessId(businessId);
  }, [businessId, setBusinessId]);

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
          <StatusTab
            situation={business?.situation}
            marketPlaceIssues={marketPlaceIssues}
            profileIssues={business?.profileIssues}
            updateProfile={updateBusinessProfile}
            result={result}
          />
        </Route>
      </Switch>
    </BusinessBaseDrawer>
  );
};
