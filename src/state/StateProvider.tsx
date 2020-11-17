import React from 'react';
import { BusinessProvider } from './business/business';

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
