import { StateProvider } from 'app/state/StateProvider';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ApiProvider } from './state/api/context';
import { SearchApiProvider } from './state/search/context';
import { ChakraUIProvider } from './styles/ChakraUIProvider';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const RootProvider = ({ children }: Props) => {
  return (
    <ApiProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraUIProvider>
          <StateProvider>
            <SearchApiProvider>{children}</SearchApiProvider>
          </StateProvider>
        </ChakraUIProvider>
      </QueryClientProvider>
    </ApiProvider>
  );
};
