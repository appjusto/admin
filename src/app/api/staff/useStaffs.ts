import { ProfileSituation, StaffProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useContextFirebaseUser } from 'app/state/auth/context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';

const initialMap = new Map();

export const useStaffs = (situations: ProfileSituation[], email?: string) => {
  // contex
  const api = useContextApi();
  const { userAbility } = useContextFirebaseUser();
  // state
  const [staffMap, setStaffMap] =
    React.useState<Map<string | undefined, WithId<StaffProfile>[]>>(initialMap);
  const [staffs, setStaffs] = React.useState<WithId<StaffProfile>[] | null>();
  const [startAfter, setStartAfter] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastStaff, setLastStaff] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastStaff);
  }, [lastStaff]);
  // side effects
  React.useEffect(() => {
    if (
      userAbility?.cannot('read', 'staff') ||
      userAbility?.cannot('update', 'account_manager')
    )
      return;
    api.staff().observeStaffs(
      (results, last) => {
        setStaffMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastStaff(last);
      },
      situations,
      startAfter,
      email
    );
  }, [api, userAbility, startAfter, situations, email]);
  React.useEffect(() => {
    setStaffs(
      Array.from(staffMap.values()).reduce(
        (result, staffs) => [...result, ...staffs],
        []
      )
    );
  }, [staffMap]);
  // return
  return { staffs, fetchNextPage };
};
