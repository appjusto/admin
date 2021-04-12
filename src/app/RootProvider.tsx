import { StateProvider } from 'app/state/StateProvider';
import React from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { ApiProvider } from './state/api/context';
import { SearchApiProvider } from './state/search/context';
import { ChakraUIProvider } from './styles/ChakraUIProvider';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const RootProvider = ({ children }: Props) => {
  return (
    <ApiProvider>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <StateProvider>
          <ChakraUIProvider>
            <SearchApiProvider>{children}</SearchApiProvider>
          </ChakraUIProvider>
        </StateProvider>
      </ReactQueryCacheProvider>
    </ApiProvider>
  );
};
