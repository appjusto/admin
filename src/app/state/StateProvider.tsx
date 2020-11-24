import React from 'react';
import { BusinessProvider } from './business/context';
import { ProfileProvider } from './profile/context';
import { FirebaseUserProvider } from './user/context';

interface Props {
  children: React.ReactNode;
}

export const StateProvider = ({ children }: Props) => {
  return (
    <FirebaseUserProvider>
      <ProfileProvider>
        <BusinessProvider value={{ id: 'default', name: 'Restaurante Novo', status: 'open' }}>
          {children}
        </BusinessProvider>
      </ProfileProvider>
    </FirebaseUserProvider>
  );
};
