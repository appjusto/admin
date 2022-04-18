import { ManagerProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import React from 'react';

export const useStaffs = () => {
  // contex
  const api = useContextApi();
  const { role } = useContextFirebaseUser();
  // state
  const [staffs, setStaffs] = React.useState<WithId<ManagerProfile>[] | null>();
  // side effects
  React.useEffect(() => {
    if (role !== 'owner') return;
    api.staff().observeStaffs(setStaffs);
  }, [api, role]);
  // return
  return { staffs };
};
