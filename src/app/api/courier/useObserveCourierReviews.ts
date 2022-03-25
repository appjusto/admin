import { OrderConsumerReview, ReviewType, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import dayjs from 'dayjs';
import React from 'react';

export const useObserveCourierReviews = (
  courierId?: string | null,
  types?: ReviewType[],
  start?: string,
  end?: string
) => {
  // context
  const api = useContextApi();
  // state
  const [reviews, setReviews] = React.useState<WithId<OrderConsumerReview>[] | null>();
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
