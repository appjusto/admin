import React from 'react';
import { AgentProvider } from './agent/context';
import { FirebaseUserProvider } from './auth/context';
import { BusinessProvider } from './business/context';
import { ManagerProvider } from './manager/context';

interface Props {
  children: React.ReactNode;
}

export const StateProvider = ({ children }: Props) => {
  return (
    <FirebaseUserProvider>
      <AgentProvider>
        <BusinessProvider>
          <ManagerProvider>{children}</ManagerProvider>
        </BusinessProvider>
      </AgentProvider>
    </FirebaseUserProvider>
  );
};
