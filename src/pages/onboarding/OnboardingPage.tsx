import { useContextFirebaseUser } from 'app/state/auth/context';
import BankingInformation from 'pages/banking-information/BankingInformation';
import BusinessProfile from 'pages/business-profile/BusinessProfile';
import DeliveryArea from 'pages/delivery-area/DeliveryArea';
import InsurancePage from 'pages/insurance/InsurancePage';
import LogisticsPage from 'pages/logistics/LogisticsPage';
import { ManagerProfile } from 'pages/manager-profile/ManagerProfile';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { Commitments } from './Commitments';
import { OnboardingComplete } from './OnboardingComplete';
import { OnboardingErrorBoundary } from './OnboardingErrorBoundary';
import OnboardingOpening from './OnboardingOpening';
import OnboardingStep from './OnboardingStep';

const Onboarding = () => {
  // context
  const { path } = useRouteMatch();
  const { isBackofficeUser } = useContextFirebaseUser();
  // UI
  if (isBackofficeUser) return <Redirect to="/backoffice" />;
  return (
    <OnboardingErrorBoundary>
      <Switch>
        <Route exact path={`${path}`}>
          <OnboardingOpening path={path} />
        </Route>
        <Route path={`${path}/1`}>
          <OnboardingStep>
            <ManagerProfile redirect={`${path}/2`} onboarding="1" />
          </OnboardingStep>
        </Route>
        <Route path={`${path}/2`}>
          <OnboardingStep>
            <BusinessProfile redirect={`${path}/3`} onboarding="2" />
          </OnboardingStep>
        </Route>
        <Route path={`${path}/3`}>
          <OnboardingStep>
            <BankingInformation redirect={`${path}/4`} onboarding="3" />
          </OnboardingStep>
        </Route>
        <Route path={`${path}/4`}>
          <OnboardingStep>
            <DeliveryArea redirect={`${path}/5`} onboarding="4" />
          </OnboardingStep>
        </Route>
        <Route path={`${path}/5`}>
          <OnboardingStep>
            <LogisticsPage redirect={`${path}/6`} onboarding="5" />
          </OnboardingStep>
        </Route>
        <Route path={`${path}/6`}>
          <OnboardingStep>
            <InsurancePage redirect={`${path}/7`} onboarding="6" />
          </OnboardingStep>
        </Route>
        <Route path={`${path}/7`}>
          <OnboardingStep>
            <Commitments redirect={`${path}/complete`} />
          </OnboardingStep>
        </Route>
        <Route path={`${path}/complete`}>
          <OnboardingComplete />
        </Route>
      </Switch>
    </OnboardingErrorBoundary>
  );
};

export default Onboarding;
