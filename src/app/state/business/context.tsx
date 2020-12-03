import { Business, WithId } from 'appjusto-types';
import React from 'react';

const BusinessContext = React.createContext<WithId<Business> | undefined>(undefined);

export const BusinessProvider = (props: React.ProviderProps<WithId<Business> | undefined>) => {
  const [business] = React.useState<WithId<Business> | undefined>(props.value);

  return <BusinessContext.Provider value={business}>{props.children}</BusinessContext.Provider>;
};

export const useBusinessValue = () => {
  return React.useContext(BusinessContext)!;
};

export const useBusinessId = () => {
  return useBusinessValue()!.id;
};
