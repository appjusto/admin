import { BannersOrdering } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import React from 'react';
import { useCustomMutation } from '../mutation/useCustomMutation';

export const useObserveBannersOrdering = () => {
  // context
  const api = useContextApi();
  // state
  const [ordering, setOrdering] = React.useState<BannersOrdering | null>();
  // mutations
  const {
    mutate: updateBannersOrdering,
    mutationResult: updateBannersOrderingResult,
  } = useCustomMutation(
    (ordering: BannersOrdering) => {
      return api.banners().updatebannersOrdering(ordering);
    },
    'updateBannersOrdering',
    false
  );
  // side effects
  React.useEffect(() => {
    api.banners().observeBannersOrdering(setOrdering);
  }, [api]);
  // result
  return { ordering, updateBannersOrdering, updateBannersOrderingResult };
};
