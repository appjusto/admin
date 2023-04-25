import { BusinessService } from '@appjusto/types';
import dayjs from 'dayjs';
import { getDateAndHour } from 'utils/functions';

export const getBusinessServiceActivationDate = (
  service?: BusinessService | null
) => {
  if (!service) return null;
  try {
    const serviceActivationDate = dayjs(service.createdOn).toDate();
    const serviceActivatedAt = getDateAndHour(serviceActivationDate);
    return serviceActivatedAt;
  } catch (error) {
    console.log('getBusinessServiceActivationDate error: ', error);
  }
};
