import { ManagerProfile, WithId } from '@appjusto/types';
import { useContextStaffProfile } from 'app/state/staff/context';
import React from 'react';
import { useUpdateManagerProfile } from '../manager/useUpdateManagerProfile';

export const useUpdateManagerLastBusinessId = (
  manager?: WithId<ManagerProfile> | null,
  businessId?: string
) => {
  // context
  const { isBackofficeUser } = useContextStaffProfile();
  const { updateLastBusinessId } = useUpdateManagerProfile(manager?.id, true);
  // side effects
  React.useEffect(() => {
    if (isBackofficeUser !== false) return;
    if (!businessId) return;
    updateLastBusinessId(businessId);
  }, [isBackofficeUser, businessId, updateLastBusinessId]);
};
