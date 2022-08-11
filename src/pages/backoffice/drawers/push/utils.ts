import dayjs from 'dayjs';

export const getScheduledDate = (
  pushDate: string,
  pushTime: string,
  onlyValidation?: boolean
) => {
  const time = pushTime.split(':');
  const scheduledDate = dayjs(pushDate)
    .set('hour', Number(time[0]))
    .set('minute', Number(time[1]))
    .toDate();
  if (dayjs(scheduledDate).isBefore(dayjs())) return false;
  if (onlyValidation) return true;
  return scheduledDate;
};
