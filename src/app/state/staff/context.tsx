import { StaffProfile, WithId } from '@appjusto/types';
import { useStaffProfile } from 'app/api/staff/useStaffProfile';
import { useUpdateStaffProfile } from 'app/api/staff/useUpdateStaffProfile';
import React from 'react';

let updateUserAgentCount = 0;

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
  const { updateProfile } = useUpdateStaffProfile(staff, false);
  const username = staff?.name ?? (staff?.email ? staff?.email.split('@')[0] : '');
  // side effects
  React.useEffect(() => {
    if (!staff) return;
    if (updateUserAgentCount > 0) return;
    const userAgent = window?.navigator?.userAgent;
    if (userAgent && staff.userAgent !== userAgent) {
      updateUserAgentCount++;
      updateProfile({ changes: { userAgent } });
    }
  }, [staff, updateProfile]);
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
