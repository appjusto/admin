import React from 'react';
import { ChakraUIProvider } from './styles/ChakraUIProvider';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const RootProvider = ({ children }: Props) => {
  return <ChakraUIProvider>{children}</ChakraUIProvider>;
};
