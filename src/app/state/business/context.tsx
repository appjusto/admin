import { useObserveBusinessManagedBy } from 'app/api/business/profile/useObserveBusinessManagedBy';
import { useObserveBusinessProfile } from 'app/api/business/profile/useObserveBusinessProfile';
//import { useManagerProfile } from 'app/api/manager/useManagerProfile';
import { Business, WithId } from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';
import { useContextAgentProfile } from '../agent/context';
import { useContextApi } from '../api/context';
import { useContextFirebaseUserEmail } from '../auth/context';

interface ContextProps {
  business: WithId<Business> | undefined | null;
  setBusinessId: Dispatch<SetStateAction<string | undefined | null>>;
}

const BusinessContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessProvider = ({ children }: Props) => {
  const api = useContextApi();
  const email = useContextFirebaseUserEmail();
  const { isBackofficeUser } = useContextAgentProfile();
  //const manager = useManagerProfile();
  const businesses = useObserveBusinessManagedBy(email);
  const [businessId, setBusinessId] = React.useState<string | undefined | null>();
  const business = useObserveBusinessProfile(businessId);

  // side effects
  // flow for regular users
  React.useEffect(() => {
    if (!email) return;
    if (!businesses) return;
    if (businesses.length === 0 && !isBackofficeUser) {
      setBusinessId(null);
    } else {
      const id = businesses.find(() => true)?.id;
      if (id) setBusinessId(id);
    }
  }, [api, businesses, email]);

  return (
    <BusinessContext.Provider value={{ business, setBusinessId }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useContextBusiness = () => {
  return React.useContext(BusinessContext);
};

export const useContextBusinessId = () => {
  const { business } = useContextBusiness();
  return business?.id;
};
