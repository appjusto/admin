import { useContextApi } from 'app/state/api/context';
import { BusinessRecommendation, WithId } from '@appjusto/types';
import React from 'react';
import dayjs from 'dayjs';
import { uniqWith, isEqual } from 'lodash';
import firebase from 'firebase/app';

export const useRecommendations = (search?: string, start?: string, end?: string) => {
  // context
  const api = useContextApi();
  // state
  const [recommendations, setRecommendations] = React.useState<WithId<BusinessRecommendation>[]>(
    []
  );
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  // handlers
  const getRecomendations = React.useCallback(() => {
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    api.consumer().getRecommendations(
      (results, last) => {
        if (!startAfter) setRecommendations(results);
        else
          setRecommendations((prev) => {
            if (prev) {
              const union = [...prev, ...results];
              return uniqWith(union, isEqual);
            }
            return results;
          });
        setStartAfter(last);
      },
      search,
      startDate,
      endDate,
      startAfter
    );
  }, [api, search, start, end, startAfter]);
  // side effects
  React.useEffect(() => {
    setStartAfter(undefined);
  }, [search, start, end]);
  // return
  return { recommendations, getRecomendations };
};
