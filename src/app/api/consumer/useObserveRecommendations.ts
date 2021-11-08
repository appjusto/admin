import { useContextApi } from 'app/state/api/context';
import { BusinessRecommendation, WithId } from 'appjusto-types';
import React from 'react';
import dayjs from 'dayjs';
import { uniqWith, isEqual } from 'lodash';
import firebase from 'firebase/app';

export const useObserveRecommendations = (search?: string, start?: string, end?: string) => {
  // context
  const api = useContextApi();
  // state
  const [recommendations, setRecommendations] = React.useState<WithId<BusinessRecommendation>[]>(
    []
  );
  const [startAfter, setStartAfter] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  const [lastDocument, setLastDocument] = React.useState<
    firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  >();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastDocument);
  }, [lastDocument]);
  // side effects
  React.useEffect(() => {
    let startDate = start ? dayjs(start).startOf('day').toDate() : null;
    let endDate = end ? dayjs(end).endOf('day').toDate() : null;
    const unsub = api.consumer().observeRecommendations(
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
        setLastDocument(last);
      },
      search,
      startDate,
      endDate,
      startAfter
    );
    return () => unsub();
  }, [api, search, start, end, startAfter]);

  // return
  return { recommendations, fetchNextPage };
};
