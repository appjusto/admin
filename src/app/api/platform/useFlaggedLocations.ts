import { FlaggedLocation } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useFlaggedLocations = () => {
  // context
  const api = useContextApi();
  // mutations
  const {
    mutate: addFlaggedLocation,
    mutationResult: addFlaggedLocationResult,
  } = useCustomMutation(
    (location: Partial<FlaggedLocation>) =>
      api.platform().addFlaggedLocation(location),
    'addFlaggedLocation',
    false
  );
  const {
    mutate: deleteFlaggedLocation,
    mutationResult: deleteFlaggedLocationResult,
  } = useCustomMutation(
    (locationId: string) => api.platform().deleteFlaggedLocation(locationId),
    'deleteFlaggedLocation',
    false,
    false
  );
  // result
  return {
    addFlaggedLocation,
    addFlaggedLocationResult,
    deleteFlaggedLocation,
    deleteFlaggedLocationResult,
  };
};
