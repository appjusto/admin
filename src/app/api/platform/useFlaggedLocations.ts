import { FlaggedLocation } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useFlaggedLocations = () => {
  // context
  const api = useContextApi();
  // state
  //const [flaggedLocations, setFlaggedLocations] = React.useState<
  //  WithId<FlaggedLocation>[] | null
  //>();
  // mutations
  const { mutate: addFlaggedLocation, mutationResult: addFlaggedLocationResult } =
    useCustomMutation(
      (location: Partial<FlaggedLocation>) => api.platform().addFlaggedLocation(location),
      'addFlaggedLocation',
      false
    );
  const { mutate: deleteFlaggedLocation, mutationResult: deleteFlaggedLocationResult } =
    useCustomMutation(
      (locationId: string) => api.platform().deleteFlaggedLocation(locationId),
      'deleteFlaggedLocation',
      false,
      false
    );
  // side effects
  //React.useEffect(() => {
  //  if (!observe) return;
  //  const unsub = api.platform().observeFlaggedLocations(setFlaggedLocations);
  //  return () => unsub();
  //}, [api, observe]);
  // result
  return {
    addFlaggedLocation,
    addFlaggedLocationResult,
    deleteFlaggedLocation,
    deleteFlaggedLocationResult,
  };
};
