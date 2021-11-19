import React from 'react';
import { FlaggedLocation, WithId } from 'appjusto-types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useFlaggedLocations = (observe: boolean = true) => {
  // context
  const api = useContextApi();
  // state
  const [flaggedLocations, setFlaggedLocations] = React.useState<
    WithId<FlaggedLocation>[] | null
  >();
  // mutations
  const {
    mutateAsync: addFlaggedLocation,
    mutationResult: addFlaggedLocationResult,
  } = useCustomMutation(
    async (location: FlaggedLocation) => api.platform().addFlaggedLocation(location),
    'addFlaggedLocation'
  );
  // side effects
  React.useEffect(() => {
    if (!observe) return;
    const unsub = api.platform().observeFlaggedLocations(setFlaggedLocations);
    return () => unsub();
  }, [api, observe]);
  // result
  return { flaggedLocations, addFlaggedLocation, addFlaggedLocationResult };
};
