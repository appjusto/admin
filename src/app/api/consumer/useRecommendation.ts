import { useContextApi } from 'app/state/api/context';
import { BusinessRecommendation, WithId } from '@appjusto/types';
import React from 'react';
import { documentAs } from 'core/fb';

export const useRecommendation = (recommendationId: string) => {
  // context
  const api = useContextApi();
  // state
  const [
    recommendation,
    setRecommendation,
  ] = React.useState<WithId<BusinessRecommendation> | null>();
  // side effects
  React.useEffect(() => {
    (async () => {
      const data = await api.consumer().fecthRecommendation(recommendationId);
      if (data.exists) setRecommendation(documentAs<BusinessRecommendation>(data));
      else setRecommendation(null);
    })();
  }, [api, recommendationId]);

  // return
  return recommendation;
};
