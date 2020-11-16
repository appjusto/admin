import React from 'react';
import { ChakraUIProvider } from './styles/ChakraUIProvider';
import { StateProvider } from 'state/StateProvider';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const RootProvider = ({ children }: Props) => {
  return (
    <StateProvider>
      <ChakraUIProvider>{children}</ChakraUIProvider>
    </StateProvider>
  );
};
