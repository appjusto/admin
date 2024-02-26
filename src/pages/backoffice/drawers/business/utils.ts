import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

export const getAvailableAtMinDate = () => {
  try {
    const date = dayjs().add(1, 'day');
    return date.format('YYYY-MM-DD');
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const getStringDateFromTimestamp = (timestamp?: Timestamp | null) => {
  try {
    if (!timestamp) return '';
    const date = dayjs(timestamp.toDate());
    return date.format('YYYY-MM-DD');
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const getTimestampFromStringDate = (value: string) => {
  try {
    const date = dayjs(value).startOf('day').toDate();
    return Timestamp.fromDate(date);
  } catch (error) {
    console.log(error);
    return null;
  }
};
