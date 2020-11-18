import React from 'react';
import { BusinessProvider } from './business/context';

interface Props {
  children: React.ReactNode;
}

export const StateProvider = ({ children }: Props) => {
  return (
    <BusinessProvider value={{ name: 'Restaurante Novo', status: 'open' }}>
      {children}
    </BusinessProvider>
  );
};
