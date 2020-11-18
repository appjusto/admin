import { StateProvider } from 'app/state/StateProvider';
import React from 'react';
import { ApiProvider } from './api/context';
import { ChakraUIProvider } from './styles/ChakraUIProvider';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const RootProvider = ({ children }: Props) => {
  return (
    <ApiProvider>
      <StateProvider>
        <ChakraUIProvider>{children}</ChakraUIProvider>
      </StateProvider>
    </ApiProvider>
  );
};
