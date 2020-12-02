import { StateProvider } from 'app/state/StateProvider';
import React from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { ApiProvider } from './api/context';
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
          <ChakraUIProvider>{children}</ChakraUIProvider>
        </StateProvider>
      </ReactQueryCacheProvider>
    </ApiProvider>
  );
};
