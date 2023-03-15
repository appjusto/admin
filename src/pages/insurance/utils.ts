import { BusinessService } from '@appjusto/types';
import dayjs from 'dayjs';
import { getDateAndHour } from 'utils/functions';

export const getBusinessInsuranceActivationDate = (
  insuranceAccepted?: BusinessService
) => {
  if (!insuranceAccepted) return null;
  try {
    const insuranceActivationDate = dayjs(insuranceAccepted.createdOn).toDate();
    const insuranceActivatedAt = getDateAndHour(insuranceActivationDate);
    return insuranceActivatedAt;
  } catch (error) {
    console.log('getBusinessInsuranceActivationDate error: ', error);
  }
};
