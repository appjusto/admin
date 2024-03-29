import { getConfig } from 'app/api/config';
import React, { useContext } from 'react';
import Api from '../../api/Api';

const ApiContext = React.createContext<Api | undefined>(undefined);

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider = (props: ApiProviderProps) => {
  const [api] = React.useState(() => new Api(getConfig().api));
  return <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>;
};

export const useContextApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useContextApi must be used within the ApiProvider');
  }
  return context;
};
