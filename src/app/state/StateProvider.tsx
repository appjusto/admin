import React from 'react';
import { AgentProvider } from './agent/context';
import { FirebaseUserProvider } from './auth/context';
import { BusinessProvider } from './business/context';
import { ManagerProvider } from './manager/context';
import { MeasurementProvider } from './measurement/context';
import { AppRequestsProvider } from './requests/context';
import { ServerTimeProvider } from './server-time';

interface Props {
  children: React.ReactNode;
}

export const StateProvider = ({ children }: Props) => {
  return (
    <AppRequestsProvider>
      <FirebaseUserProvider>
        <ServerTimeProvider>
          <AgentProvider>
            <BusinessProvider>
              <ManagerProvider>
                <MeasurementProvider>{children}</MeasurementProvider>
              </ManagerProvider>
            </BusinessProvider>
          </AgentProvider>
        </ServerTimeProvider>
      </FirebaseUserProvider>
    </AppRequestsProvider>
  );
};
