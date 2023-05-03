import { ManagerProfile, WithId } from '@appjusto/types';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';
import { useUpdateManagerProfile } from '../manager/useUpdateManagerProfile';

export const useUpdateManagerLastBusinessId = (
  manager?: WithId<ManagerProfile> | null,
  businessId?: string
) => {
  // context
  const { isBackofficeUser } = useContextFirebaseUser();
  const { updateLastBusinessId } = useUpdateManagerProfile(manager?.id, true);
  // side effects
  React.useEffect(() => {
    if (isBackofficeUser) return;
    if (!businessId) return;
    updateLastBusinessId(businessId);
  }, [isBackofficeUser, businessId, updateLastBusinessId]);
};
