import { useObserveBusinessProfile } from 'app/api/business/useObserveBusinessProfile';
import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { useContextManagerProfile } from '../manager/context';

const BusinessContext = React.createContext<WithId<Business> | undefined | null>(undefined);

export const BusinessProvider = (props: Omit<React.ProviderProps<Business>, 'value'>) => {
  const manager = useContextManagerProfile();
  const [selectedBusinessId, setSelectedBusinessId] = React.useState<string | undefined | null>();
  const business = useObserveBusinessProfile(selectedBusinessId);

  React.useEffect(() => {
    if (!manager) return;
    const firstBusinessId = manager.businessIds?.find(() => true);
    setSelectedBusinessId(firstBusinessId ?? null);
  }, [manager]);

  return <BusinessContext.Provider value={business}>{props.children}</BusinessContext.Provider>;
};

export const useContextBusiness = () => {
  return React.useContext(BusinessContext);
};

export const useBusinessId = () => {
  return useContextBusiness()?.id;
};
