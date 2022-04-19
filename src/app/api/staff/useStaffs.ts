import { ManagerProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';

export const useStaffs = () => {
  // contex
  const api = useContextApi();
  // state
  const [staffs, setStaffs] = React.useState<WithId<ManagerProfile>[] | null>();
  // side effects
  React.useEffect(() => {
    api.staff().observeStaffs(setStaffs);
  }, [api]);
  // return
  return { staffs };
};
