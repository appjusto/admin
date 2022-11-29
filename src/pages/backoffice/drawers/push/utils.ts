import dayjs from 'dayjs';

const isLive = process.env.REACT_APP_ENVIRONMENT === 'live';

const checkDate = (date: Date) => {
  if (isLive) {
    return dayjs(date).isBefore(dayjs().add(10, 'minute'));
  }
  return dayjs(date).isBefore(dayjs());
};

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
  if (checkDate(scheduledDate)) return false;
  if (onlyValidation) return true;
  return scheduledDate;
};
