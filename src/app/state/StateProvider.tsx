import React from 'react';
import { BusinessProvider } from './business/context';
import { ManagerProvider } from './manager/context';
import { FirebaseUserProvider } from './user/context';

interface Props {
  children: React.ReactNode;
}

export const StateProvider = ({ children }: Props) => {
  return (
    <FirebaseUserProvider>
      <ManagerProvider>
        <BusinessProvider value={{ id: 'default', name: 'Restaurante Novo', status: 'open' }}>
          {children}
        </BusinessProvider>
      </ManagerProvider>
    </FirebaseUserProvider>
  );
};
