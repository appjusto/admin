import { Coupon, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import React from 'react';

const initialMap = new Map();

export const useObserveCoupons = (code?: string) => {
  // context
  const api = useContextApi();
  // state
  const [couponsMap, setCouponsMap] =
    React.useState<Map<string | undefined, WithId<Coupon>[]>>(initialMap);
  const [coupons, setCoupons] = React.useState<WithId<Coupon>[]>([]);
  const [startAfter, setStartAfter] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  const [lastDoc, setLastDoc] =
    React.useState<QueryDocumentSnapshot<DocumentData>>();
  // handlers
  const fetchNextPage = React.useCallback(() => {
    setStartAfter(lastDoc);
  }, [lastDoc]);
  // side effects
  React.useEffect(() => {
    if (!api) return;
    const unsub = api.coupon().observeCoupons(
      (results, last) => {
        setCouponsMap((current) => {
          const value = new Map(current.entries());
          value.set(startAfter?.id, results);
          return value;
        });
        if (last) setLastDoc(last);
      },
      startAfter,
      code
    );
    return () => unsub();
  }, [api, startAfter, code]);
  React.useEffect(() => {
    setCoupons(
      Array.from(couponsMap.values()).reduce(
        (result, orders) => [...result, ...orders],
        []
      )
    );
  }, [couponsMap]);
  // return
  return { coupons, fetchNextPage };
};
