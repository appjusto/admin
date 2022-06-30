import { useOrdersContext } from 'app/state/order';
import { useContextServerTime } from 'app/state/server-time';
import dayjs from 'dayjs';

export const useCanAdvanceReceivables = () => {
  const { getServerTime } = useContextServerTime();
  const { platformParams } = useOrdersContext();
  if (!platformParams) return false;
  const { advances } = platformParams.marketplace;
  const now = dayjs(getServerTime());
  if (!advances.daysOfWeek.includes(now.day())) return false;
  const startAt = dayjs(now).hour(advances.startAt).minute(0).second(0).millisecond(0);
  const endAt = dayjs(now).hour(advances.endAt).minute(0).second(0).millisecond(0);
  return startAt.isBefore(now) && endAt.isAfter(now);
};
