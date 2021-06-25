import { GeneralRoles, useFirebaseUserRole } from 'app/api/auth/useFirebaseUserRole';
import { useObserveBusinessManagedBy } from 'app/api/business/profile/useObserveBusinessManagedBy';
import { useObserveBusinessProfile } from 'app/api/business/profile/useObserveBusinessProfile';
import { Business, WithId } from 'appjusto-types';
import React, { Dispatch, SetStateAction } from 'react';
import { useContextAgentProfile } from '../agent/context';
import { useContextApi } from '../api/context';
import { useContextFirebaseUserEmail } from '../auth/context';

interface ContextProps {
  business: WithId<Business> | undefined | null;
  userRole?: GeneralRoles | null;
  setBusinessId: Dispatch<SetStateAction<string | undefined | null>>;
  updateContextBusinessOrderPrint(status: boolean): void;
}

const BusinessContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessProvider = ({ children }: Props) => {
  // context
  const api = useContextApi();
  const email = useContextFirebaseUserEmail();
  const { isBackofficeUser } = useContextAgentProfile();
  const businesses = useObserveBusinessManagedBy(email);
  const [businessId, setBusinessId] = React.useState<string | undefined | null>();
  const hookBusiness = useObserveBusinessProfile(businessId);
  const { role: userRole } = useFirebaseUserRole(businessId);
  //const managers = useManagers(business, userRole);
  // state
  const [business, setBusiness] = React.useState<WithId<Business> | null>();

  // handlers
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
    if (hookBusiness === undefined) return;
    if (hookBusiness === null) setBusiness(null);
    setBusiness(hookBusiness);
  }, [hookBusiness]);
  // intended to auto-select a business id for a restaurant manager
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (!email) return;
    if (!businesses) return;
    // select first business or set it to null to indicate that user doesn't
    // manage any business
    setBusinessId(businesses.find(() => true)?.id ?? null);
  }, [api, businesses, email, isBackofficeUser]);

  return (
    <BusinessContext.Provider
      value={{ business, userRole, setBusinessId, updateContextBusinessOrderPrint }}
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
