import { Fleet, OutsourceAccountType } from '@appjusto/types';

export const fleetValidation = (data: Partial<Fleet>) => {
  if (!data.maxDistance) return false;
  return true;
};

export const isLogisticsIncluded = (
  orderFareCourierPayee?: OutsourceAccountType
) => {
  return !orderFareCourierPayee || orderFareCourierPayee === 'platform';
};
