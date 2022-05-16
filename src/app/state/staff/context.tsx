import { StaffProfile, WithId } from '@appjusto/types';
import { useStaffProfile } from 'app/api/staff/useStaffProfile';
import React from 'react';

interface ContextProps {
  staff: WithId<StaffProfile> | undefined | null;
  username: string;
}

const StaffProfileContext = React.createContext<ContextProps>({} as ContextProps);

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const StaffProvider = ({ children }: Props) => {
  // state
  const staff = useStaffProfile();
  const username = staff?.name ?? (staff?.email ? staff?.email.split('@')[0] : '');
  // provider
  return (
    <StaffProfileContext.Provider value={{ staff, username }}>
      {children}
    </StaffProfileContext.Provider>
  );
};

export const useContextStaffProfile = () => {
  return React.useContext(StaffProfileContext);
};
