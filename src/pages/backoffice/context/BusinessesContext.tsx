import { useBusinesses } from 'app/api/business/useBusinesses';
import { useContextApi } from 'app/state/api/context';
import { Business, WithId } from 'appjusto-types';
import React from 'react';

interface ContextProps {
  businesses: WithId<Business>[] | undefined;
  getBusinessById(id: string): WithId<Business> | undefined;
}

const BusinessesContext = React.createContext<ContextProps>({} as ContextProps);

const options = { active: true, inactive: true };

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export const BusinessesContextProvider = (props: ProviderProps) => {
  // context
  const api = useContextApi();
  const hookBusinesses = useBusinesses(options);

  //state
  const [businesses, setBusinesses] = React.useState<WithId<Business>[]>([]);

  //handlers
  const getBusinessById = (id: string) => {
    const business = businesses.find((business: WithId<Business>) => business.id === id);
    return business;
  };

  // side effects
  React.useEffect(() => {
    if (hookBusinesses) {
      setBusinesses(hookBusinesses);
    }
  }, [hookBusinesses]);
  // provider
  return (
    <BusinessesContext.Provider
      value={{
        businesses,
        getBusinessById,
      }}
      {...props}
    />
  );
};

export const useBusinessesContext = () => {
  const context = React.useContext(BusinessesContext);
  if (!context) {
    throw new Error('useBusinessesContext must be used within the BusinessesContextProvider');
  }
  return context;
};
