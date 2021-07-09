import { useContextApi } from 'app/state/api/context';
import { CourierProfile, WithId } from 'appjusto-types';
import React from 'react';
import { useMutation } from 'react-query';

export const useCourierSearch = (orderId?: string, courierCode?: string, courierName?: string) => {
  // context
  const api = useContextApi();
  // state
  const [couriers, setCouriers] = React.useState<WithId<CourierProfile>[] | null>();
  // mutations
  const [courierManualAllocation, allocationResult] = useMutation(async (courierId: string) =>
    api.courier().courierManualAllocation(orderId!, courierId)
  );
  // side effects
  React.useEffect(() => {
    if (!courierCode && !courierName) {
      setCouriers(undefined);
      return;
    }
    const unsub = courierCode
      ? api.courier().observeCourierProfileByCode(courierCode, setCouriers)
      : api.courier().observeCourierProfileByName(courierName!, setCouriers);
    return () => unsub();
  }, [api, courierCode, courierName]);
  // return
  return { couriers, courierManualAllocation, allocationResult };
};
