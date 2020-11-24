import { Business, WithId } from 'appjusto-types';
import React from 'react';

interface BusinessContextInterface {
  business: WithId<Business> | undefined;
  setBusiness: React.Dispatch<React.SetStateAction<WithId<Business> | undefined>>;
}

const BusinessContext = React.createContext<BusinessContextInterface | undefined>(undefined);

export const BusinessProvider = (props: React.ProviderProps<WithId<Business> | undefined>) => {
  const [business, setBusiness] = React.useState<WithId<Business> | undefined>(props.value);
  const value: BusinessContextInterface = React.useMemo(() => ({ business, setBusiness }), [
    business,
  ]);
  return <BusinessContext.Provider value={value}>{props.children}</BusinessContext.Provider>;
};

export const useBusinessValue = () => {
  return React.useContext(BusinessContext)?.business;
};

export const useBusinessId = () => {
  return useBusinessValue()?.id;
};

export const useSetBusiness = () => {
  return React.useContext(BusinessContext)?.setBusiness;
};
