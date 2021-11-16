import { useObserveBusinessManagedBy } from 'app/api/business/profile/useObserveBusinessManagedBy';
import { useObserveBusinessProfile } from 'app/api/business/profile/useObserveBusinessProfile';
import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useContextFirebaseUser } from '../auth/context';
import { getBusinessChangedKeys } from './utils';

interface ContextProps {
  business?: WithId<Business> | null;
  setBusinessId(businessId?: string | null): void;
  updateContextBusinessOrderPrint(status: boolean): void;
  businessesIsEmpty: boolean;
  setBusinessIdByBusinesses(): void;
  isDeleted: boolean;
  setIsDeleted(value: boolean): void;
}

const BusinessContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessProvider = ({ children }: Props) => {
  // context
  const queryClient = useQueryClient();
  const { user, isBackofficeUser, refreshUserToken } = useContextFirebaseUser();
  const businesses = useObserveBusinessManagedBy(user?.email);
  const [businessId, setBusinessId] = React.useState<string | undefined | null>();
  const [isDeleted, setIsDeleted] = React.useState(false);
  const hookBusiness = useObserveBusinessProfile(businessId);
  // state
  const [business, setBusiness] = React.useState<WithId<Business> | null>();
  // helpers
  const businessesIsEmpty = businesses?.length === 0;
  // handlers
  const setBusinessIdByBusinesses = React.useCallback(() => {
    if (!businesses) return;
    if (businesses.length > 1) {
      setBusinessId(businesses.find((business) => business.situation === 'approved')?.id ?? null);
    } else setBusinessId(businesses.find(() => true)?.id ?? null);
  }, [businesses]);
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
    if (!user) setBusinessId(null);
  }, [user]);
  React.useEffect(() => {
    if (businessId && refreshUserToken) refreshUserToken(businessId);
  }, [businessId, refreshUserToken]);
  React.useEffect(() => {
    if (!user?.email) return;
    if (hookBusiness === undefined) return;
    if (hookBusiness === null) {
      localStorage.removeItem(`business-${process.env.REACT_APP_ENVIRONMENT}-${user.email}`);
      setBusiness(null);
      return;
    }
    if (isBackofficeUser === false) {
      localStorage.setItem(
        `business-${process.env.REACT_APP_ENVIRONMENT}-${user.email}`,
        hookBusiness.id
      );
    }
    updateContextBusiness(hookBusiness);
    queryClient.invalidateQueries();
  }, [
    user,
    hookBusiness,
    isBackofficeUser,
    queryClient,
    setBusinessIdByBusinesses,
    updateContextBusiness,
  ]);
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (!user?.email) return;
    if (businessId) return;
    const localBusinessId = localStorage.getItem(
      `business-${process.env.REACT_APP_ENVIRONMENT}-${user.email}`
    );
    if (localBusinessId) {
      setBusinessId(localBusinessId);
      return;
    }
    // select first business, or first business approved, or set it to null to indicate that user doesn't
    // manage any business
    setBusinessIdByBusinesses();
  }, [user?.email, isBackofficeUser, businessId, setBusinessIdByBusinesses]);
  // provider
  return (
    <BusinessContext.Provider
      value={{
        business,
        setBusinessId,
        updateContextBusinessOrderPrint,
        isDeleted,
        setIsDeleted,
        businessesIsEmpty,
        setBusinessIdByBusinesses,
      }}
    >
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
