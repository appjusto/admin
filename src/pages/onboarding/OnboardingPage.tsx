import { useContextAgentProfile } from 'app/state/agent/context';
import BankingInformation from 'pages/business-profile/BankingInformation';
import BusinessProfile from 'pages/business-profile/BusinessProfile';
import DeliveryArea from 'pages/delivery-area/DeliveryArea';
import { ManagerProfile } from 'pages/manager-profile/ManagerProfile';
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { OnboardingComplete } from './OnboardingComplete';
import OnboardingOpening from './OnboardingOpening';
import OnboardingStep from './OnboardingStep';

const Onboarding = () => {
  // context
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextAgentProfile();

  // UI
  if (isBackofficeUser) return <Redirect to="/backoffice" />;
  return (
    <Switch>
      <Route exact path={`${path}`}>
        <OnboardingOpening path={path} />
      </Route>
      <Route path={`${path}/1`}>
        <OnboardingStep>
          <ManagerProfile redirect={`${path}/2`} onboarding />
        </OnboardingStep>
      </Route>
      <Route path={`${path}/2`}>
        <OnboardingStep>
          <BusinessProfile redirect={`${path}/3`} onboarding />
        </OnboardingStep>
      </Route>
      <Route path={`${path}/3`}>
        <OnboardingStep>
          <BankingInformation redirect={`${path}/4`} onboarding />
        </OnboardingStep>
      </Route>
      <Route path={`${path}/4`}>
        <OnboardingStep>
          <DeliveryArea redirect={`${path}/complete`} onboarding />
        </OnboardingStep>
      </Route>
      {/*<Route path={`${path}/5`}>
        <OnboardingStep>
          <TermsOfUse redirect={`${path}/complete`} />
        </OnboardingStep>
      </Route>*/}
      <Route path={`${path}/complete`}>
        <OnboardingComplete />
      </Route>
    </Switch>
  );
};

export default Onboarding;
