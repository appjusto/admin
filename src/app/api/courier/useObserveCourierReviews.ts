import { useContextApi } from 'app/state/api/context';
import { WithId } from '@appjusto/types';
import React from 'react';
import { CourierReview, CourierReviewType } from './CourierApi';
import dayjs from 'dayjs';

export const useObserveCourierReviews = (
  courierId?: string | null,
  types?: CourierReviewType[],
  start?: string,
  end?: string
) => {
  // context
  const api = useContextApi();
  // state
  const [reviews, setReviews] = React.useState<WithId<CourierReview>[] | null>();
  // side effects
  React.useEffect(() => {
    if (!courierId || !types || !start || !end) return; // during initialization
    let startDate = dayjs(start).startOf('day').toDate();
    let endDate = dayjs(end).endOf('day').toDate();
    const unsub = api
      .courier()
      .observeCourierReviews(courierId!, types, startDate, endDate, setReviews);
    return () => unsub();
  }, [api, courierId, types, start, end]);
  // return
  return reviews;
};
