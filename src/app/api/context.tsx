import { getConfig } from 'app/config';
import React, { useContext } from 'react';
import Api from './Api';

const ApiContext = React.createContext<Api | undefined>(undefined);

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider = (props: ApiProviderProps) => {
  const [api] = React.useState(() => new Api(getConfig().api));
  return <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>;
};

export const useApi = () => {
  return useContext(ApiContext)!;
};
