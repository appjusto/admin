import { BusinessRecommendation, WithId } from '@appjusto/types';
import { useContextApi } from 'app/state/api/context';
import { documentAs } from 'core/fb';
import React from 'react';
import { useUserCanReadEntity } from '../auth/useUserCanReadEntity';

export const useRecommendation = (recommendationId: string) => {
  // context
  const api = useContextApi();
  const userCanRead = useUserCanReadEntity('recommendations');
  // state
  const [recommendation, setRecommendation] =
    React.useState<WithId<BusinessRecommendation> | null>();
  // side effects
  React.useEffect(() => {
    if (!userCanRead) return;
    if (!recommendationId) return;
    (async () => {
      const data = await api.consumer().fecthRecommendation(recommendationId);
      if (data.exists())
        setRecommendation(documentAs<BusinessRecommendation>(data));
      else setRecommendation(null);
    })();
  }, [api, userCanRead, recommendationId]);

  // return
  return recommendation;
};
