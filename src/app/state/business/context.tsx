import React from 'react';

interface Business {
  name: string;
  status: 'open' | 'closed';
}

interface BusinessContextInterface {
  business: Business | undefined;
  setBusiness: React.Dispatch<React.SetStateAction<Business | undefined>>;
}

const BusinessContext = React.createContext<BusinessContextInterface | undefined>(undefined);

export const BusinessProvider = (props: React.ProviderProps<Business | undefined>) => {
  const [business, setBusiness] = React.useState<Business | undefined>(props.value);
  const value: BusinessContextInterface = React.useMemo(() => ({ business, setBusiness }), [
    business,
  ]);
  return <BusinessContext.Provider value={value}>{props.children}</BusinessContext.Provider>;
};

export const useBusinessValue = () => {
  return React.useContext(BusinessContext)?.business;
};

export const useSetBusiness = () => {
  return React.useContext(BusinessContext)?.setBusiness;
};
