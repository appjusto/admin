import React from 'react';
import { StateProvider } from 'state/StateProvider';
import { ChakraUIProvider } from './styles/ChakraUIProvider';

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
