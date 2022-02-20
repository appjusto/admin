import { AlgoliaConfig, Environment } from '@appjusto/types';
import { getSearchConfig } from 'app/api/config';
import React, { useContext } from 'react';
import Api from '../../api/search/SearchApi';

const SearchApiContext = React.createContext<Api | undefined>(undefined);

interface ApiProviderProps {
  children: React.ReactNode;
}

export const SearchApiProvider = (props: ApiProviderProps) => {
  const { config, env } = getSearchConfig();
  const [api] = React.useState(() => new Api(config as AlgoliaConfig, env as Environment));
  return <SearchApiContext.Provider value={api}>{props.children}</SearchApiContext.Provider>;
};

export const useContextSearchApi = () => {
  const context = useContext(SearchApiContext);
  if (!context) {
    throw new Error('useContextSearchApi must be used within the SearchApiProvider');
  }
  return context;
};
