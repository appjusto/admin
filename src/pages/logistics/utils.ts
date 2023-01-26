import { Fleet } from '@appjusto/types';

export const fleetValidation = (data: Partial<Fleet>) => {
  if (!data.maxDistance) return false;
  return true;
};
