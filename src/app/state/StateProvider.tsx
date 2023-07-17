import React from 'react';
import { FirebaseUserProvider } from './auth/context';
import { BusinessProvider } from './business/context';
import { ManagerProvider } from './manager/context';
import { MeasurementProvider } from './measurement/context';
import { AppRequestsProvider } from './requests/context';
import { ServerTimeProvider } from './server-time';
import { StaffProvider } from './staff/context';

interface Props {
  children: React.ReactNode;
}

export const StateProvider = ({ children }: Props) => {
  return (
    <AppRequestsProvider>
      <FirebaseUserProvider>
        <ServerTimeProvider>
          <StaffProvider>
            <ManagerProvider>
              <BusinessProvider>
                <MeasurementProvider>{children}</MeasurementProvider>
              </BusinessProvider>
            </ManagerProvider>
          </StaffProvider>
        </ServerTimeProvider>
      </FirebaseUserProvider>
    </AppRequestsProvider>
  );
};
