import { useBusinessesContext } from 'pages/backoffice/context/BusinessesContext';
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
  const { getBusinessById } = useBusinessesContext();
  const business = getBusinessById(businessId);
  //handlers

  //UI conditions

  //UI
  return (
    <BusinessBaseDrawer
      agent={{ id: 'sajkcawhAc', name: 'Nome do agente' }}
      business={business}
      managerName="Renan Costa"
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
