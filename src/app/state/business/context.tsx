import { useObserveBusinessManagedBy } from 'app/api/business/profile/useObserveBusinessManagedBy';
import { useObserveBusinessProfile } from 'app/api/business/profile/useObserveBusinessProfile';
import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { useContextApi } from '../api/context';
import { useContextFirebaseUser } from '../auth/context';
import { getBusinessChangedKeys } from './utils';

interface ContextProps {
  business?: WithId<Business> | null;
  setBusinessId(businessId?: string | null): void;
  updateContextBusinessOrderPrint(status: boolean): void;
}

const BusinessContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessProvider = ({ children }: Props) => {
  // context
  const api = useContextApi();
  const { user, isBackofficeUser, refreshUserToken } = useContextFirebaseUser();
  const businesses = useObserveBusinessManagedBy(user?.email);
  const [businessId, setBusinessId] = React.useState<string | undefined | null>();
  const hookBusiness = useObserveBusinessProfile(businessId);
  // state
  const [business, setBusiness] = React.useState<WithId<Business> | null>();
  // handlers
  const updateContextBusiness = React.useCallback(
    (newState: WithId<Business> | null) => {
      if (business && newState) {
        const changedKeys = getBusinessChangedKeys(business, newState);
        if (changedKeys.length === 0) return;
        else setBusiness(newState);
      } else setBusiness(newState);
    },
    [business]
  );
  const updateContextBusinessOrderPrint = (status: boolean) => {
    setBusiness((prev) => {
      if (!prev) return;
      return {
        ...prev,
        orderPrinting: status,
      };
    });
  };
  // side effects
  React.useEffect(() => {
    if (businessId && refreshUserToken) refreshUserToken(businessId);
  }, [businessId, refreshUserToken]);
  React.useEffect(() => {
    if (hookBusiness === undefined) return;
    if (hookBusiness === null) return setBusiness(null);
    localStorage.setItem('business', hookBusiness.id);
    updateContextBusiness(hookBusiness);
  }, [hookBusiness, updateContextBusiness]);
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (!user?.email) return;
    if (!businesses) return;
    if (businessId) return;
    const localBusinessId = localStorage.getItem('business');
    if (localBusinessId) return setBusinessId(localBusinessId);
    // select first business or set it to null to indicate that user doesn't
    // manage any business
    setBusinessId(businesses.find(() => true)?.id ?? null);
  }, [api, businesses, user?.email, isBackofficeUser, businessId]);
  // provider
  return (
    <BusinessContext.Provider value={{ business, setBusinessId, updateContextBusinessOrderPrint }}>
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
