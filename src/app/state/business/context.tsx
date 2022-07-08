import { Business, ManagerWithRole, WithId } from '@appjusto/types';
import { useObserveBusinessManagedBy } from 'app/api/business/profile/useObserveBusinessManagedBy';
import { useObserveBusinessProfile } from 'app/api/business/profile/useObserveBusinessProfile';
import { useGetManagers } from 'app/api/manager/useGetManagers';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useContextFirebaseUser } from '../auth/context';
import { shouldUpdateState } from '../utils';

const watchedFields: (keyof Business)[] = [
  // primitive types
  'name',
  'companyName',
  'cnpj',
  'phone',
  'phones',
  'status',
  'situation',
  'enabled',
  'profileIssuesMessage',
  'cuisine',
  'description',
  'minimumOrder',
  'fulfillment',
  'averageCookingTime',
  'orderAcceptanceTime',
  'deliveryRange',
  'onboarding',
  'logoExists',
  'coverImageExists',
  'orderPrinting',
  'slug',
  'settings',
  // object types
  'managers',
  'profileIssues',
  'businessAddress',
  'schedules',
];

interface ContextProps {
  business?: WithId<Business> | null;
  clearBusiness(): void;
  setBusinessId(businessId?: string | null): void;
  updateContextBusinessOrderPrint(status: boolean): void;
  businesses?: WithId<Business>[];
  setBusinessIdByBusinesses(): void;
  businessManagers?: ManagerWithRole[];
  setIsGetManagersActive: React.Dispatch<React.SetStateAction<boolean>>;
  fetchManagers(): void;
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
  const hookBusiness = useObserveBusinessProfile(businessId);
  // state
  const [business, setBusiness] = React.useState<WithId<Business> | null>();
  const [isGetManagersActive, setIsGetManagersActive] = React.useState(false);
  // business managers
  const { managers: businessManagers, fetchManagers } = useGetManagers(
    business,
    isGetManagersActive
  );
  // handlers
  const clearBusiness = React.useCallback(() => {
    setBusiness(undefined);
  }, []);
  const setBusinessIdByBusinesses = React.useCallback(() => {
    if (!businesses) return;
    setBusinessId(businesses.find(() => true)?.id ?? null);
  }, [businesses]);
  const updateContextBusiness = React.useCallback(
    (newState: WithId<Business> | null) => {
      if (!shouldUpdateState(business, newState, watchedFields)) return;
      else setBusiness(newState);
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
      setBusiness(null);
      return;
    }
    if (isBackofficeUser === false) {
      localStorage.setItem(`${user.email}-${process.env.REACT_APP_ENVIRONMENT}`, hookBusiness.id);
    }
    updateContextBusiness(hookBusiness);
    queryClient.invalidateQueries();
  }, [user, hookBusiness, isBackofficeUser, queryClient, updateContextBusiness]);
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (!user?.email) return;
    if (businessId) return;
    const localBusinessId = localStorage.getItem(
      `${user.email}-${process.env.REACT_APP_ENVIRONMENT}`
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
        clearBusiness,
        setBusinessId,
        updateContextBusinessOrderPrint,
        businesses,
        setBusinessIdByBusinesses,
        businessManagers,
        setIsGetManagersActive,
        fetchManagers,
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
