import { Timestamp } from '@appjusto/types/external/firebase';
import dayjs from 'dayjs';

export const getOutsourceQuotationValues = (
  consumerValue?: number,
  externalTotal?: string
) => {
  if (!externalTotal || !consumerValue)
    return {
      external: null,
      externalNet: null,
      extra: null,
    };
  const external = parseInt(externalTotal.replace('.', ''));
  const externalNet = Math.round(external * 0.84);
  const extra =
    consumerValue > externalNet ? Math.round(consumerValue - externalNet) : 0;
  return { external, externalNet, extra };
};

export const getExternalQuotationStatus = (
  quotationId?: string,
  createdAt?: Timestamp
) => {
  if (typeof quotationId !== 'string') return false;
  if (dayjs().isAfter(dayjs(createdAt?.toDate()).add(3, 'minute')))
    return false;
  return true;
};
