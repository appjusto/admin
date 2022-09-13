import { CourierProfile, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useCourierSearch = (
  courierCode?: string,
  courierName?: string
) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('couriers');
  // state
  const [couriers, setCouriers] = React.useState<
    WithId<CourierProfile>[] | null
  >();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!courierCode && !courierName) {
      setCouriers(undefined);
      return;
    }
    const unsub = courierCode
      ? api.courier().observeCourierProfileByCode(courierCode, setCouriers)
      : api.courier().observeCourierProfileByName(courierName!, setCouriers);
    return () => unsub();
  }, [api, userCanRead, courierCode, courierName]);
  // return
  return couriers;
};
