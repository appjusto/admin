import { useObserveBusinessManagedBy } from 'app/api/business/profile/useObserveBusinessManagedBy';
import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../api/context';
import { useContextFirebaseUserEmail } from '../auth/context';

const BusinessContext = React.createContext<WithId<Business> | undefined | null>(undefined);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessProvider = ({ children }: Props) => {
  const api = useContextApi();
  const email = useContextFirebaseUserEmail();
  const businesses = useObserveBusinessManagedBy(email);
  const [business, setBusiness] = React.useState<WithId<Business> | undefined>();

  // side effects
  // when manager's data becomes available
  React.useEffect(() => {
    if (!email) return;
    if (!businesses) return;
    if (businesses.length === 0) api.business().createBusinessProfile(email);
    else setBusiness(businesses.find(() => true));
  }, [api, businesses, email]);

  return <BusinessContext.Provider value={business}>{children}</BusinessContext.Provider>;
};

export const useContextBusiness = () => {
  return React.useContext(BusinessContext);
};

export const useContextBusinessId = () => {
  return useContextBusiness()?.id;
};
